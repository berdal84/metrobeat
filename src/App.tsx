import { useMetronome } from "./Metronome/useMetronome"
import { MetronomeView } from "./Metronome/MetronomeView"
import packageJson from "../package.json"
import { useCallback, useEffect } from "react"
import { Tempo } from "./Metronome/Tempo"

const news = `
    Quoi de neuf?
    - correction de bugs mode variation: play échoue 1ere fois, perte de valeur de tempo.
    - debut de la fonctionnalite de variation (sur une minute pour l'instant)
    - correction de pb de son lors de perte de la recuperation du focus de la fenetre.
  `

function App() {

  const {
    viewState,
    stop, play,
    setTempo, setTempoBegin, setTempoEnd,
    toggleVariation
  } = useMetronome({ tempo: 80, tempoBegin: 80, tempoEnd: 120});

  const handleVersionClick = useCallback(() => {
    alert(news)
  }, [])

  useEffect( () => {
    console.log("useEffect's viewState:", viewState);
  }, [viewState.isPlaying])

  return (
    <div className="App">
      <h1 className="title">
        Métron<span style={{ color: "#bec6ffff" }}>ô</span>me
        <span onClick={handleVersionClick} className="version">v{packageJson.version}</span></h1>
      <MetronomeView
        diodeOn={viewState.diodeOn}
        tempo={viewState.tempo}
        isPlaying={viewState.isPlaying}
        onTempoChange={setTempo}
        onPlayPressed={play}
        onStopPressed={stop}
      />

      <div className="divider"/>
      
      <div className="variation">
        <label>
        <input
          type="checkbox"
          checked={viewState.variationOn}
          onChange={toggleVariation}
        />
          Variation ON
        </label>
        { viewState.variationOn && <div className="tempos">
          <p>(Sur une duree d'1 min pour le moment...)</p>
          <label>BPM (départ)</label><Tempo tempo={viewState.tempoBegin} onTempoChange={setTempoBegin}/>
          <label>BPM (arrivée)</label><Tempo  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd}/>
        </div>}
      </div>
      <div className="divider"/>
      <p className="description">"Le" métronome qui sait se distinguer.</p>
    </div>
  )
}

export default App
