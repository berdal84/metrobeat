import { Howl } from 'howler'
import { clamp } from '../tools';

export const MODE = {
    CONSTANT    : 0,
    INTERPOLATE_UP_AND_HOLD : 1,
    INTERPOLATE_UP_AND_DOWN_FOREVER: 2,
} as const

export type Mode = typeof MODE.CONSTANT
                 | typeof MODE.INTERPOLATE_UP_AND_HOLD
                 | typeof MODE.INTERPOLATE_UP_AND_DOWN_FOREVER;

export type Sequence = {
    name: 'tick' |'hit' | 'hat' | 'snare';
    data: Array<number>;
}

export type State = {
    isPlaying: boolean;
    onChange: (change: Partial<EventChange>) => void;
    tempo: number;
    tempoBegin: number;
    tempoEnd: number;
    sound: Howl;
    last_frame_time: DOMHighResTimeStamp;
    step: number;
    step_per_bar: number;
    bar_per_seq: number;
    next_step_delay: DOMHighResTimeStamp;
    requestAnimationFrameId: number;
    period: number;
    mode: Mode;
    variationDirection: number;
    diodeOn: boolean;
    volume: number;
    sequencer: Array<Sequence>;
}

export type EventChange =  Partial<Pick<State, 'sequencer' | 'volume' | 'mode'| 'isPlaying' | 'tempo' |  'tempoBegin' | 'tempoEnd' | 'diodeOn' | 'period'>>

export type InitialState = EventChange;
export function create( initialState: Partial<InitialState> = {} ): State
{

    const sound = new Howl({
        src: ['tick_C.mp3'],
        preload: true,
    })

    const state: State = {
        volume: 0.5,
        step: 0,
        step_per_bar: 4,
        bar_per_seq: 4,
        tempo: 80,
        tempoBegin: 80,
        tempoEnd: 120,
        isPlaying: false,
        sound,
        next_step_delay: 0,
        last_frame_time: 0,
        requestAnimationFrameId: 0,
        onChange: (_: Partial<EventChange>) => {},
        period: 0,
        diodeOn: false,
        variationDirection: 1,
        mode: 0,
        sequencer: [
            { name: 'tick',  data: [1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0,  1, 0, 0, 0] },
            { name: 'hat',   data: [0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0] },
            { name: 'hit',   data: [0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0] },
            { name: 'snare', data: [0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0] },
        ],
        ...initialState
    }

    return state;
}

export function play(state: State)
{
    if (state.isPlaying)
        return

    state.isPlaying        = true;
    state.last_frame_time = performance.now();

    if (state.mode != MODE.CONSTANT)
        set_tempo(state, state.tempoBegin);

    state.sound.stereo(-0.2); // update loop will toggle pan's sign
    loop(state);
    emit_change(state, { isPlaying: state.isPlaying});
}

export function emit_change(state: State, changes: EventChange)
{
    state.onChange(changes);
}

export function stop(state: State)
{
    state.isPlaying  = false;
    
    if (state.requestAnimationFrameId) {
        cancelAnimationFrame(state.requestAnimationFrameId)
        state.requestAnimationFrameId = 0
    }

    emit_change(state, { isPlaying: state.isPlaying });
}

export function set_tempo(state: State, new_tempo: number, slot: 'tempo' | 'tempoBegin' | 'tempoEnd' = 'tempo')
{
    console.assert(new_tempo > 0, "New tempo must be strictly positive");

    if (state[slot] == new_tempo )
        return;

    const diffAsIntegers = Math.round(state[slot]) - Math.round(new_tempo)

    state[slot] = new_tempo;

    if ( Math.abs(diffAsIntegers) > 0 ) state.onChange({ [slot]: Math.round(new_tempo) })
}

export function update(state: State, dt: number)
{
    // skip any update that took too much time
    if ( dt > state.period)
        return;

    if (!state.isPlaying)
        return;
          
    if ( state.mode != MODE.CONSTANT )
    {
        let reachedBoundary =
            ( state.variationDirection > 0 && state.tempoEnd - state.tempo <= 0 ) ||
            ( state.variationDirection < 0 && state.tempo - state.tempoBegin <= 0 ) 

        if ( reachedBoundary && state.mode === MODE.INTERPOLATE_UP_AND_DOWN_FOREVER)
        {
            state.variationDirection = -state.variationDirection;
        }

        // TODO: precompute once?
        const bpmRange = (state.tempoEnd-state.tempoBegin) * state.variationDirection;
        const bpmToAddPerMs = bpmRange / (state.period * 1000);
        const newTempo = clamp(state.tempo + bpmToAddPerMs * dt, state.tempoBegin, state.tempoEnd)

        set_tempo(state, newTempo );
    }
    
    if ( state.next_step_delay > dt)
    {
        state.next_step_delay -= dt;
        return;
    }

    // From here, we know we just entered next step

    flash_diode(state)

    const barDelay = 60 / (state.tempo * state.step_per_bar) * 1000;
    state.next_step_delay =  state.next_step_delay - dt + barDelay;

    const totalBarCount = state.step_per_bar * state.bar_per_seq;
    state.step = (state.step+1) % totalBarCount;
    
    for ( const seq of state.sequencer)
    {
        if ( seq.data[state.step] === 0 )
            continue;

        // Alternate left/right pan
        const pan = state.sound.stereo();
        state.sound.stereo(-pan)

        state.sound.play()
    }
}

export function set_diode(state: State, diodeOn: boolean)
{
    if (state.diodeOn == diodeOn)
        return

    state.diodeOn = diodeOn
    emit_change(state, { diodeOn: diodeOn })
}

function flash_diode(state: State, duration: number = 100)
{
    set_diode(state, true)
    setTimeout(() => set_diode(state, false), duration)
}

export function loop(state: State)
{
    state.requestAnimationFrameId = requestAnimationFrame((_: number) => {

        const now = performance.now();
        const dt  = now - state.last_frame_time;
        state.last_frame_time = now;

        update(state, dt);
        loop(state);
    });
}

export function set_mode(state: State, mode: Mode)
{
    state.mode = mode;
    emit_change(state, { mode })
}

export function set_period(state: State, period: number)
{
    state.period = period
    emit_change(state, { period })
}

export function set_volume(state: State, volume: number)
{
    state.volume = volume;
    state.sound.volume(volume);
    emit_change(state, { volume })
}

export function replace_sequence(state: State, seq: Sequence)
{
    console.assert(seq.data.length === state.bar_per_seq * state.step_per_bar );
    const existing = state.sequencer.findIndex( s => s.name === seq.name );

    if (existing === -1)
    {
        state.sequencer = [...state.sequencer, seq]
    }
    else
    {
        state.sequencer[existing] = seq;
        state.sequencer = [...state.sequencer]
    }
    
    emit_change(state, { sequencer: state.sequencer})
}

