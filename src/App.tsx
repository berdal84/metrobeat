import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, type MouseEventHandler } from "react"
import { ValueInputField } from "./ValueInputField"

// TODO LIST
//
// ## Corriger bugs:
//
// ## Fonctionnalités:
// - [ ] modes: utiliser les mots "régulier", "accererando", "zigzag" (en groupe de boutons toggle)
// - [ ] volume: slider horizontal 
//
// ## Secondaire:
// - [ ] valeur note du 1er temps: [-1 Octave, 0, +1 Octave] (Cad freq x1/2 ou x2).
// - [ ] Nombre de temp(s): 1, 2, 3, 4, 5, 6, 7, 8 (options buttons)
//
// ## Idées:
// - Sauvegarde/Chargement automatique des valeurs de l'interface et Bouton de réinitialisation des valeurs l'interface.
// - S'assurer que l'interface utilise tout l'écran sur smartphone.
// - S'assurer que l'interface fonctionne en mode portrait ET paysage.

const news = `
    Quoi de neuf?
    - tempo: deux boutons (+/-1, +/- 10)
    - limiter BPM entre 10 et 300 sur l'interface graphique.
    - accelerando: ne pas faire stop en fin, rester au tempo de fin à l'infini.
    - accererando/yoyo: contraindre le BPM entre [BPM début, BPM fin] à tout instant.
  `

function App() {

  const {
    viewState,
    stop, play,
    setTempo, setTempoBegin, setTempoEnd,
    toggleVariation,
    setVariationDuration,
    toggleYoyo
  } = useMetronome({ tempo: 80, tempoBegin: 80, tempoEnd: 120, variationDuration: 60});

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
        <span className="version">v{packageJson.version}</span>
      </header>

      <main>

        <section className="controls">
          <button className='playButton' style={{ marginTop: 'auto'}}
            onClick={handlePlayButtonClick}
          >
            {viewState.isPlaying ? 'STOP' : 'PLAY'}
            <div style={{ opacity: viewState.diodeOn ? 1 : 0.4 }} className='diode'/>
          </button>
            { viewState.variationOn && viewState.isPlaying && <p>Actuel: {viewState.tempo} bpm</p>}
            { !viewState.variationOn && <ValueInputField tempo={viewState.tempo} onTempoChange={setTempo} unit="bpm"/>}
        </section>

        <section className="variation" inert={viewState.isPlaying}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={viewState.variationOn}
                onChange={toggleVariation}
              />
              Interpoler le tempo
            </label>
            { viewState.variationOn && <label>
              <input type="checkbox" checked={viewState.yoyo} onChange={toggleYoyo}/>
                Boucler à l'infini
            </label>}
          </div>

          <div className="TempoInputRange" hidden={!viewState.variationOn}>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de départ</label>
              <ValueInputField tempo={viewState.tempoBegin} onTempoChange={setTempoBegin} unit="bpm"/>
            </div>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de fin</label>
              <ValueInputField  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd} unit="bpm"/>
            </div>
          </div>

          <div className="ValueInputField-group" hidden={!viewState.variationOn}>
            <label className="ValueInputField-label">Durée d'interpolation</label>
            <ValueInputField 
              tempo={viewState.variationDuration}
              onTempoChange={setVariationDuration}
              min={1} max={10*60} unit="sec"
            />
          </div>
        </section>

      </main>

      <footer>
        <span onClick={handleVersionClick} className="what-s-new">Quoi d'neuf sur la v{packageJson.version}?</span>
      </footer>
    </div>
  )
}

export default App
