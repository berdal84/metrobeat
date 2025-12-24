import { useMetronome } from "./Metronome/useMetronome"
import { MetronomeView } from "./Metronome/MetronomeView"

function App() {

  const metronome = useMetronome()

  return (
    <div className="App">
      <h1 className="title">Métron<span style={{ color: "#bec6ffff" }}>ô</span>me</h1>
      <MetronomeView
        diodeOn={metronome.diodeOn}
        tempo={metronome.tempo}
        isPlaying={metronome.isPlaying}
        onTempoChange={metronome.setTempo}
        onPlayPressed={metronome.play}
        onStopPressed={metronome.stop}
      />
      <p className="description">"Le" métronome qui sait se distinguer.</p>
    </div>
  )
}

export default App
