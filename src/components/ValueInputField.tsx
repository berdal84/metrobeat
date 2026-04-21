import { useCallback, type ChangeEvent, type HTMLAttributes } from "react";
import { clamp } from "@metro/utils/math";
import { MinusIcon, PlusIcon } from "@metro/components/Icons";

interface Props extends HTMLAttributes<HTMLDivElement> {
  min: number,
  max: number,
  tempo: number;
  unit: string;
  onTempoChange: (tempo: number) => void;
}

export function ValueInputField(props: Partial<Props> )
{
  const {
    min = 10,
    max = 300,
    tempo: value = 60,
    unit = "",
    onTempoChange = (_: number) => {},
    ...divProps
  } = props;

  const setValue = useCallback((unboundedValue: number) => {
    const value = clamp(unboundedValue, min, max);
    onTempoChange(value)
  }, [])

  const handleInput = useCallback( (event: ChangeEvent<HTMLInputElement>) => {
    setValue( event.currentTarget.valueAsNumber )
  }, [])

  const handleMinusTen = useCallback( () => setValue( value - 10 ), [value])
  const handleMinusOne = useCallback( () => setValue( value - 1 ), [value])
  const handlePlusOne  = useCallback( () => setValue( value + 1 ), [value])
  const handlePlusTen  = useCallback( () => setValue( value + 10 ), [value])

  return (
    <div className="ValueInputField FormGroup" {...divProps}>
      
        <button onClick={handleMinusTen} inert={value <= min}>
          <MinusIcon/><span>10</span>
        </button>

        <button onClick={handleMinusOne} inert={value <= min}> 
          <MinusIcon/><span>1</span>
        </button>

        <div className="ValueInputField-div">
          <input className="ValueInputField-input"
            onChange={handleInput}          
            type="number" min={min} max={max}
            value={Math.round(value)}
          />
          <span className="ValueInputField-unit">{unit}</span>
        </div>

        <button onClick={handlePlusOne} inert={value >= max}>
          <PlusIcon/><span>1</span>
        </button>

        <button onClick={handlePlusTen} inert={value >= max}>
          <PlusIcon/><span>10</span>
        </button>

    </div>
  )
}
