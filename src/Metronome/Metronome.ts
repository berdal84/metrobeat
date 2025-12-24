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

    return {
        _tempo: initialState?.tempo ?? 100,
        isPlaying: initialState?.isPlaying ?? false,
        _sound: sound,
        _next_tick_delay: 0,
        _last_frame_time: 0,
        _shouldStop: false,
        onChange: (state: MetroState) => {},
        onTick: () => {}
    }
}

export function metro_play(state: MetroState)
{
    state.isPlaying        = true;
    state._last_frame_time = -1;
    metro_loop(state);
    state.onChange(state);
}

export function metro_stop(state: MetroState)
{
    state.isPlaying  = false;
    state._shouldStop = true;
    // loop will stop on itself
    state.onChange(state);
}

export function metro_set_tempo(state: MetroState, new_tempo: number)
{
    state._tempo = new_tempo;
    state.onChange(state)
}

export function metro_update(state: MetroState, dt: number)
{
    if ( state._next_tick_delay - dt > 0)
    {
        state._next_tick_delay -= dt;
        return;
    }

    const period = 60 /  state._tempo * 1000;
    state._next_tick_delay =  state._next_tick_delay - dt + period;
    state._sound.play()

    state.onTick();
}

export function metro_loop(state: MetroState)
{
    requestAnimationFrame((current_time: number) => {

        let dt = 0;

        if ( state._last_frame_time != -1 )
        {
            dt = current_time - state._last_frame_time;
        }

        state._last_frame_time = current_time;

        if ( state._shouldStop )
        {
            state._sound.stop()
            state._shouldStop = false;
            return;
        }

        metro_update(state, dt);
        metro_loop(state);
    });
}
