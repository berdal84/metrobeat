import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, type MouseEventHandler } from "react"
import { TempoInput } from "./Metronome/TempoInput"

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

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback((_) => {
    if (viewState.isPlaying) {
      stop()
    } else {
      play()
    }
  }, [viewState.isPlaying])

  useEffect( () => {
    console.log("useEffect's viewState:", viewState);
  }, [viewState.isPlaying])

  return (
    <div className="App">

      <header>
        Métron<span style={{ color: "#bec6ffff" }}>ô</span>me
        <span onClick={handleVersionClick} className="version">v{packageJson.version}</span>
      </header>

      <main>

        <section className="controls">
          <button className='playButton' style={{ marginTop: 'auto'}}
            onClick={handlePlayButtonClick}
          >
            {viewState.isPlaying ? 'STOP' : 'PLAY'}
            <div style={{ opacity: viewState.diodeOn ? 1 : 0.4 }} className='diode'/>
          </button>
          <div inert={viewState.variationOn}>
            { viewState.variationOn && <label>BPM (courant)</label>}
            <TempoInput tempo={viewState.tempo} onTempoChange={setTempo}/>
          </div>
        </section>

        <section className="variation">
          <label>
            <input
              type="checkbox"
              checked={viewState.variationOn}
              onChange={toggleVariation}
            />
            Mode Crescendo
          </label>
          { viewState.variationOn && <div className="TempoInputRange">
            <div><label>BPM (départ)</label><TempoInput tempo={viewState.tempoBegin} onTempoChange={setTempoBegin}/></div>
            <div><label>BPM (arrivée)</label><TempoInput  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd}/></div>
          </div>}
        </section>

      </main>

      <footer className="description">"Le" métronome qui sait se distinguer.</footer>

    </div>
  )
}

export default App
