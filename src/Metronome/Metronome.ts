import { Howl } from 'howler'

export type MetroState = {
    isPlaying: boolean;
    onChange: (state: MetroState) => void;
    onTick: () => void;
    _tempo: number;
    _sound: Howl;
    _last_frame_time: DOMHighResTimeStamp;
    _next_tick_delay: DOMHighResTimeStamp;
    _shouldStop: boolean;
    _requestId: number;
    _period: number;
}

export type MetroInitialState = {
    tempo: number;
    isPlaying: boolean;
}

export function metro_create( initialState: Partial<MetroInitialState> = {} ): MetroState
{

    const sound = new Howl({
        src: ['tick.mp3'],
        preload: true,
    })

    const state: MetroState = {
        _tempo: initialState?.tempo ?? 100,
        isPlaying: initialState?.isPlaying ?? false,
        _sound: sound,
        _next_tick_delay: 0,
        _last_frame_time: 0,
        _requestId: 0,
        _shouldStop: false,
        onChange: (_: MetroState) => {},
        onTick: () => {},
        _period: 0,
    }

    metro_update_period(state);

    return state;
}

export function metro_play(state: MetroState)
{
    state.isPlaying        = true;
    state._last_frame_time = performance.now();
    metro_loop(state);
    state.onChange(state);
}

export function metro_stop(state: MetroState)
{
    state.isPlaying  = false;
    
    if (state._requestId) {
        window.cancelAnimationFrame(state._requestId)
        state._requestId = 0
    }

    state.onChange(state);
}

function metro_update_period(state: MetroState)
{
    state._period = 60 / state._tempo * 1000; // frequency in bpm to period in ms
}

export function metro_set_tempo(state: MetroState, new_tempo: number)
{
    state._tempo  = new_tempo;
    metro_update_period(state);
    state.onChange(state)
}

export function metro_update(state: MetroState, dt: number)
{
    // skip any update that took too much time
    if ( dt > state._period)
        return;

    if ( state._next_tick_delay > dt)
    {
        state._next_tick_delay -= dt;
        return;
    }

    state._next_tick_delay =  state._next_tick_delay - dt + state._period;

    state._sound.play()
    state.onTick();
}

export function metro_loop(state: MetroState)
{
    state._requestId = requestAnimationFrame((_: number) => {

        const now = performance.now();
        const dt  = now - state._last_frame_time;
        state._last_frame_time = now;

        metro_update(state, dt);
        metro_loop(state);
    });
}
