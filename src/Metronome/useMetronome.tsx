import { useEffect, useCallback, useState, useMemo } from "react";
import * as metro from "./Metronome";

// State with the field we might want to display
type MetroViewState = Pick<
  metro.State,
  'volume' |
  'diodeOn' |
  'isPlaying' | 
  'tempo' | 
  'mode' | 
  'tempoBegin' | 
  'tempoEnd' |
  'period'
>

const DEFAULT_VIEW_STATE: MetroViewState = {
  volume: 100,
  isPlaying: false,
  tempo: -1,
  tempoBegin: -1, tempoEnd: -1,
  mode: 0,
  diodeOn: false,
  period: 60,
}

// Headless metronome
export function useMetronome( initialState: Partial<metro.InitialState> = {})
{
  const metronome = useMemo(() => metro.create(initialState), [])
  const [viewState, setViewState] = useState<MetroViewState>(DEFAULT_VIEW_STATE)

  const setMode = useCallback( (mode: metro.Mode) => metro.set_mode(metronome, mode), [] )
  const setTempoBegin   = useCallback( (value: number) => metro.set_tempo(metronome, value, 'tempoBegin'), [] )
  const setTempoEnd     = useCallback( (value: number) => metro.set_tempo(metronome, value, 'tempoEnd'), [] )
  const setTempo = useCallback( (value: number) => metro.set_tempo(metronome, value), [] )
  const play     = useCallback( () => metro.play(metronome), [] )
  const stop     = useCallback( () => metro.stop(metronome), [] )
  const setPeriod = useCallback( (value: number) => metro.set_period(metronome, value), [])
  const setVolume = useCallback( (value: number) => metro.set_volume(metronome, value), [])

  useEffect(() => {

    // TODO: this could be an event emitted by the metronome, like onInit()
    const { isPlaying, tempo, tempoBegin, tempoEnd, mode, diodeOn, period, volume } = metronome;
    setViewState({ isPlaying, tempo, tempoBegin, tempoEnd, mode, diodeOn, period, volume })

    metronome.onChange = (changes) => {
      console.log('State changes:', changes)
      setViewState( viewState => ({...viewState, ...changes}))
    }
    return () => {
      // We could use a subscription, but only one is listening so..
      metronome.onChange = (_:any) => {};
    }
  }, [metronome])

  return {
    viewState,
    setTempo,
    setTempoBegin,
    setTempoEnd,
    play,
    stop,
    setPeriod,
    setMode,
    setVolume,
  }
}
