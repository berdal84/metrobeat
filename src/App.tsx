import { useEffect, useState } from 'react'
import './App.css'
import { Howl } from 'howler'

const sound = new Howl({
  src: ['tick.mp3'],
  preload: true,
})

let tempo    = 100; // in ms
let nextTick = 0;
let play     = false;

function update(dt: number)
{
  if (!play)
  {
    if ( sound.playing() )
    {
      sound.stop()
    }
    return;
  }

  if ( nextTick-dt > 0 )
  {
    nextTick -= dt;
  }
  else
  {
    nextTick = nextTick - dt + 60/tempo*1000;
    console.log(`Play!`)
    sound.play()
  }
}

let last_time = 0;

function loop () {
  requestAnimationFrame(( current_time: number ) => {
    const dt = current_time - last_time;
    last_time = current_time;

    update(dt);
    loop();
  });
}

loop();

function App() {
  const [viewTempo, setViewTempo] = useState(120)
  const [viewPlay, setViewPlay] = useState(false)

  // Sync tempo vith view
  useEffect(() => {
    tempo = viewTempo;
    play  = viewPlay;
  }, [viewTempo, viewPlay])

  return (
    <>
      <h1>MetroBeat</h1>
      <div className="buttons">
        <button onClick={() => setViewPlay( v => !v)}>{ viewPlay ? 'STOP' : 'PLAY'}</button>
        <button onClick={() => setViewTempo( (v: number) => v - 10 )}>-</button>
        <input type="number" step={1} min={60} max={300} value={viewTempo}
          onChange={(e) => setViewTempo(e.currentTarget.valueAsNumber)}/>
        <button onClick={() => setViewTempo( (v: number) => v + 10 )}>+</button>
      </div>
      <p className="description">
        Ceci est un test de metronome web. B.
      </p>
    </>
  )
}

export default App
