import { useCallback, type ChangeEventHandler, type MouseEventHandler } from "react";

export type Props = {
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

function constrainAbove1(tempo: number) {
  return Math.max(1, tempo);
}

export function Tempo({
  tempo         = 60,
  onTempoChange = (_: number) => {},
}: Partial<Props>)
{
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
    <div className="tempo">
        <button onClick={handleDecreaseTempo}>-</button>
        <input onChange={handleTempoInputChange} type="number" step={1} min={60} max={300} value={Math.round(tempo)}/>
        <button onClick={handleIncreaseTempo}>+</button>        
    </div>
  )
}
