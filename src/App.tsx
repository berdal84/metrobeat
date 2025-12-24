import { useMetronome } from "./Metronome/useMetronome"
import { MetronomeView } from "./Metronome/MetronomeView"
import packageJson from "../package.json"
import { useCallback } from "react"

const news = `
    Quoi de neuf?
    - correction de pb de son lors de perte de la recuperation du focus de la fenetre.
  `

function App() {

  const metronome = useMetronome()
  const handleVersionClick = useCallback(() => {
    alert(news)
  }, [])

  return (
    <div className="App">
      <h1 className="title">
        Métron<span style={{ color: "#bec6ffff" }}>ô</span>me
        <span onClick={handleVersionClick} className="version">v{packageJson.version}</span></h1>
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
