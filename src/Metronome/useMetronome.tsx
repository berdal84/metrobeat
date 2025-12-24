import { useState, useEffect, useCallback } from "react";
import { metro_create, metro_play, metro_stop, metro_set_tempo } from "./Metronome";

// Headless metronome
export function useMetronome()
{
  const [metronome] = useState(metro_create({ tempo: 100}));

  const [tempo, _setTempo] = useState(metronome._tempo)
  const [isPlaying, _setIsPlaying] = useState(metronome.isPlaying)
  const [diodeOn, setDiodeOn] = useState(false)

  useEffect(() => {
    metronome.onChange = (_metronome) => {
      _setTempo(metronome._tempo)
      _setIsPlaying(metronome.isPlaying)
    }
    metronome.onTick = () => {
      setDiodeOn(true)
      setTimeout(() => setDiodeOn(false), 100 )
    }
  }, [])

  const play = useCallback(() => {
    metro_play(metronome)
  }, [metronome])

  const stop = useCallback(() => {
    metro_stop(metronome)
  }, [metronome])

  const setTempo = useCallback((tempo: number) => {
    metro_set_tempo(metronome, tempo)
  }, [metronome])

  return { tempo, setTempo, isPlaying, play, stop, diodeOn, metronome }
}
