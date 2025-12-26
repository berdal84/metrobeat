import { Howl } from 'howler'
import { clamp } from '../tools';

export type  Mode = "normal" | "grow" | "yoyo";

export type MetroState = {
    isPlaying: boolean;
    onChange: (change: Partial<MetroEventChange>) => void;
    tempo: number;
    tempoBegin: number;
    tempoEnd: number;
    sound: Howl;
    last_frame_time: DOMHighResTimeStamp;
    next_tick_delay: DOMHighResTimeStamp;
    requestAnimationFrameId: number;
    period: number;
    mode: Mode;
    variationDirection: number;
    diodeOn: boolean;
}

export type MetroEventChange = Partial<Pick<MetroState, 'mode'| 'isPlaying' | 'tempo' |  'tempoBegin' | 'tempoEnd' | 'diodeOn' | 'period'>>

export type MetroInitialState = MetroEventChange;
export function metro_create( initialState: Partial<MetroInitialState> = {} ): MetroState
{

    const sound = new Howl({
        src: ['tick.mp3'],
        preload: true,
    })

    const state: MetroState = {
        tempo: 80,
        tempoBegin: 80,
        tempoEnd: 120,
        isPlaying: false,
        sound,
        next_tick_delay: 0,
        last_frame_time: 0,
        requestAnimationFrameId: 0,
        onChange: (_: Partial<MetroEventChange>) => {},
        period: 0,
        diodeOn: false,
        variationDirection: 1,
        mode: "normal",
        ...initialState
    }

    return state;
}

export function metro_play(state: MetroState)
{
    if (state.isPlaying)
        return

    state.isPlaying        = true;
    state.last_frame_time = performance.now();

    if (state.mode != "normal")
        metro_set_tempo(state, state.tempoBegin);

    metro_loop(state);
    metro_emit_change(state, { isPlaying: state.isPlaying});
}

export function metro_emit_change(state: MetroState, changes: MetroEventChange)
{
    state.onChange(changes);
}

export function metro_stop(state: MetroState)
{
    state.isPlaying  = false;
    
    if (state.requestAnimationFrameId) {
        cancelAnimationFrame(state.requestAnimationFrameId)
        state.requestAnimationFrameId = 0
    }

    metro_emit_change(state, { isPlaying: state.isPlaying });
}

export function metro_set_tempo(state: MetroState, new_tempo: number, slot: 'tempo' | 'tempoBegin' | 'tempoEnd' = 'tempo')
{
    console.assert(new_tempo > 0, "New tempo must be strictly positive");

    if (state[slot] == new_tempo )
        return;

    const diffAsIntegers = Math.round(state[slot]) - Math.round(new_tempo)

    state[slot] = new_tempo;

    if ( Math.abs(diffAsIntegers) > 0 ) state.onChange({ [slot]: Math.round(new_tempo) })
}

export function metro_update(state: MetroState, dt: number)
{
    // skip any update that took too much time
    if ( dt > state.period)
        return;

    if (!state.isPlaying)
        return;
          
    if ( state.mode != "normal" )
    {
        let reachedBoundary =
            ( state.variationDirection > 0 && state.tempoEnd - state.tempo <= 0 ) ||
            ( state.variationDirection < 0 && state.tempo - state.tempoBegin <= 0 ) 

        if ( reachedBoundary && state.mode === "yoyo")
        {
            state.variationDirection = -state.variationDirection;
        }

        // TODO: precompute once?
        const bpmRange = (state.tempoEnd-state.tempoBegin) * state.variationDirection;
        const bpmToAddPerMs = bpmRange / (state.period * 1000);
        const newTempo = clamp(state.tempo + bpmToAddPerMs * dt, state.tempoBegin, state.tempoEnd)

        metro_set_tempo(state, newTempo );
    }
    
    if ( state.next_tick_delay > dt)
    {
        state.next_tick_delay -= dt;
        return;
    }

    metro_flash_diode(state)
    state.next_tick_delay =  state.next_tick_delay - dt + (60 / state.tempo * 1000);
    state.sound.play()
}

export function metro_set_diode(state: MetroState, diodeOn: boolean)
{
    if (state.diodeOn == diodeOn)
        return

    state.diodeOn = diodeOn
    metro_emit_change(state, { diodeOn: diodeOn })
}

function metro_flash_diode(state: MetroState, duration: number = 100)
{
    metro_set_diode(state, true)
    setTimeout(() => metro_set_diode(state, false), duration)
}

export function metro_loop(state: MetroState)
{
    state.requestAnimationFrameId = requestAnimationFrame((_: number) => {

        const now = performance.now();
        const dt  = now - state.last_frame_time;
        state.last_frame_time = now;

        metro_update(state, dt);
        metro_loop(state);
    });
}

export function metro_set_mode(state: MetroState, mode: Mode)
{
    state.mode = mode;
    metro_emit_change(state, { mode: state.mode })
}

export function metro_set_period(state: MetroState, period: number)
{
    state.period = period
    metro_emit_change(state, { period: state.period })
}
