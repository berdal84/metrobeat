import { useCallback, type ChangeEventHandler, type MouseEventHandler } from "react";

export type MetronomeViewProps = {
  tempo: number;
  isPlaying: boolean;
  diodeOn: boolean;
  onTempoChange: (tempo: number) => void;
  onPlayPressed: () => void;
  onStopPressed: () => void;
}

function constrainAbove1(tempo: number) {
  return Math.max(1, tempo);
}

export function MetronomeView({
  tempo         = 60,
  isPlaying     = false,
  diodeOn       = false,
  onTempoChange = (_: number) => {},
  onPlayPressed = () => {},
  onStopPressed = () => {}
}: Partial<MetronomeViewProps>)
{

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    if (isPlaying){
      onStopPressed()
    } else {
      onPlayPressed()
    }
  }, [isPlaying])

  const handleTempoInputChange: ChangeEventHandler<HTMLInputElement> = useCallback( (event) => {
    onTempoChange( constrainAbove1(event.currentTarget.valueAsNumber) )
  }, [tempo])

  const handleIncreaseTempo: MouseEventHandler<HTMLButtonElement> = useCallback( (_) => {
    onTempoChange( constrainAbove1(tempo + 10) )
  }, [tempo])

  const handleDecreaseTempo: MouseEventHandler<HTMLButtonElement> = useCallback( (_) => {
    onTempoChange( constrainAbove1(tempo - 10) )
  }, [tempo])

  return (
    <div className="buttons">
        <button className='playButton' onClick={handlePlayButtonClick}>
          {isPlaying ? 'STOP' : 'PLAY'}
          <div style={{ opacity: diodeOn ? 1 : 0.4 }} className='diode'/>
        </button>
        <button onClick={handleDecreaseTempo}>-</button>
        <input onChange={handleTempoInputChange} type="number" step={1} min={60} max={300} value={tempo}/>
        <button onClick={handleIncreaseTempo}>+</button>        
    </div>
  )
}
