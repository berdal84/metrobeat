import { Howl } from 'howler'

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
    variationOn: boolean;
    variationDuration: number;
    diodeOn: boolean;
}

export type MetroEventChange = Partial<Pick<MetroState, 'isPlaying' | 'tempo' |  'tempoBegin' | 'tempoEnd' | 'variationOn' |'diodeOn' | 'variationDuration'>>

export type MetroInitialState = {
    tempo: number;
    isPlaying: boolean;
    tempoBegin: number;
    tempoEnd: number;
    variationDuration: number;
}

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
        variationOn: false,
        isPlaying: false,
        sound,
        next_tick_delay: 0,
        last_frame_time: 0,
        requestAnimationFrameId: 0,
        onChange: (_: Partial<MetroEventChange>) => {},
        period: 0,
        diodeOn: false,
        variationDuration: 0,
        ...initialState
    }


    metro_update_period(state);

    return state;
}

export function metro_play(state: MetroState)
{
    if (state.isPlaying)
        return

    state.isPlaying        = true;
    state.last_frame_time = performance.now();

    if (state.variationOn)
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

function metro_update_period(state: MetroState)
{
    state.period = 60 / state.tempo * 1000; // frequency in bpm to period in ms
}

export function metro_set_tempo(state: MetroState, new_tempo: number, slot: 'tempo' | 'tempoBegin' | 'tempoEnd' = 'tempo')
{
    if (state[slot] == new_tempo )
        return;

    const diffAsIntegers = Math.round(state[slot]) - Math.round(new_tempo)

    state[slot] = new_tempo    
    metro_update_period(state);

    if ( Math.abs(diffAsIntegers) > 0 ) state.onChange({ [slot]: Math.round(new_tempo) })
}

export function metro_update(state: MetroState, dt: number)
{
    // skip any update that took too much time
    if ( dt > state.period)
        return;

    if (!state.isPlaying)
        return;
          
    if ( state.variationOn )
    {
        if ( state.tempo >= state.tempoEnd )
        {
            metro_stop(state)
            return;
        }

        // TODO: precompute once?
        const bpmRange = state.tempoEnd-state.tempoBegin
        const bpmToAddPerMs = bpmRange / (state.variationDuration * 1000);

        metro_set_tempo(state, state.tempo + bpmToAddPerMs * dt )
    }
    
    if ( state.next_tick_delay > dt)
    {
        state.next_tick_delay -= dt;
        return;
    }

    metro_flash_diode(state)
    state.next_tick_delay =  state.next_tick_delay - dt + state.period;
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

export function metro_toggle_variation(state: MetroState)
{
    state.variationOn = ! state.variationOn
    metro_emit_change(state, { variationOn: state.variationOn })
}

export function metro_set_variation_duration(state: MetroState, variationDuration: number)
{
    state.variationDuration = variationDuration
    metro_emit_change(state, { variationDuration: state.variationDuration })
}
