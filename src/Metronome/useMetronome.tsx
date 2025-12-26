import { useEffect, useCallback, useState, useMemo } from "react";
import {
  metro_create,
  metro_play,
  metro_stop,
  metro_set_tempo,
  type MetroState,
  type MetroEventChange,
  type MetroInitialState,
  metro_set_period,
  metro_set_mode,
  type Mode,
} from "./Metronome";

// State with the field we might want to display
type MetroViewState = Pick<
  MetroState,
  'diodeOn' |
  'isPlaying' | 
  'tempo' | 
  'mode' | 
  'tempoBegin' | 
  'tempoEnd' |
  'period'
>

const DEFAULT_VIEW_STATE: MetroViewState = {
    isPlaying: false,
    tempo: -1,
    tempoBegin: -1, tempoEnd: -1,
    mode: "normal",
    diodeOn: false,
    period: 60,
}

// Headless metronome
export function useMetronome( initialState: Partial<MetroInitialState> = {})
{
  const metronome = useMemo(() => metro_create(initialState), [])
  const [viewState, setViewState] = useState<MetroViewState>(DEFAULT_VIEW_STATE)

  const setMode = useCallback( (mode: Mode) => metro_set_mode(metronome, mode), [] )
  const setTempoBegin   = useCallback( (value: number) => metro_set_tempo(metronome, value, 'tempoBegin'), [] )
  const setTempoEnd     = useCallback( (value: number) => metro_set_tempo(metronome, value, 'tempoEnd'), [] )
  const setTempo = useCallback( (value: number) => metro_set_tempo(metronome, value), [] )
  const play     = useCallback( () => metro_play(metronome), [] )
  const stop     = useCallback( () => metro_stop(metronome), [] )
  const setPeriod = useCallback( (value: number) => metro_set_period(metronome, value), [])

  useEffect(() => {

    // TODO: this could be an event emitted by the metronome, like onInit()
    const { isPlaying, tempo, tempoBegin, tempoEnd, mode, diodeOn, period } = metronome;
    setViewState({ isPlaying, tempo, tempoBegin, tempoEnd, mode, diodeOn, period })

    metronome.onChange = (changes: MetroEventChange) => {
      console.log('State changes:', changes)
      setViewState( viewState => ({...viewState, ...changes}))
    }
    return () => {
      // We could use a subscription, but only one is listening so..
      metronome.onChange = (_:any) => {};
    }
  }, [metronome])

  return {
    metronome: metronome,
    viewState,
    setTempo,
    setTempoBegin,
    setTempoEnd,
    play,
    stop,
    setPeriod,
    setMode,
  }
}
