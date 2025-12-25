import { useCallback, type MouseEventHandler } from "react";
import { Tempo } from "./Tempo";

export type Props = {
  tempo: number;
  isPlaying: boolean;
  diodeOn: boolean;
  onTempoChange: (tempo: number) => void;
  onPlayPressed: () => void;
  onStopPressed: () => void;
}

export function MetronomeView({
  tempo         = 60,
  isPlaying     = false,
  diodeOn       = false,
  onTempoChange = (_: number) => {},
  onPlayPressed = () => {},
  onStopPressed = () => {}
}: Partial<Props>)
{

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    if (isPlaying){
      onStopPressed()
    } else {
      onPlayPressed()
    }
  }, [isPlaying])

  return (
    <div className="buttons">
        <button className='playButton' style={{ marginTop: 'auto'}} onClick={handlePlayButtonClick}>
          {isPlaying ? 'STOP' : 'PLAY'}
          <div style={{ opacity: diodeOn ? 1 : 0.4 }} className='diode'/>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
          <label>BPM</label>
          <Tempo tempo={tempo} onTempoChange={onTempoChange} />
        </div>
    </div>
  )
}
