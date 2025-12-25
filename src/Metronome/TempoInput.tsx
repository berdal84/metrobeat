import { useCallback, type ChangeEventHandler, type HTMLAttributes, type MouseEventHandler } from "react";

const PlusIcon = () => {
  return(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  )
}

const MinusIcon = () => {
  return(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
  )
}

function constrainAbove1(tempo: number) {
  return Math.max(1, tempo);
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

export function TempoInput(props: Props )
{
  const {
    tempo         = 60,
    onTempoChange = (_: number) => {},
    ...divProps
  } = props;

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
    <div className="TempoInput" {...divProps}>
      
        <button onClick={handleDecreaseTempo}>
          <MinusIcon/>
        </button>

        <input
          onChange={handleTempoInputChange}
          type="number" step={1} min={60} max={300}
          value={Math.round(tempo)}
        />

        <button onClick={handleIncreaseTempo}>
          <PlusIcon/>
        </button>

    </div>
  )
}
