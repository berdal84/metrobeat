import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, type MouseEventHandler } from "react"
import { TempoInput } from "./Metronome/TempoInput"

// TODO LIST
//
// ## Corriger bugs:
// - [ ] accererando: contraindre le BPM entre [BPM début, BPM fin] à tout instant. Ne doit jamais aller au delà du max, en deçà du min.
//
// ## Fonctionnalités:
// - [ ] limiter BPM entre 10 et 300 sur l'interface graphique.
// - [ ] modes: utiliser les mots "régulier", "accererando", "zigzag" (en groupe de boutons toggle)
// - [ ]  accererando: ne pas faire stop en fin, rester au tempo de fin à l'infini.
// - [ ] tempo: deux boutons (+/-1, +/- 10)
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
    - ajout du mode yoyo.
    - correction de bugs mode variation: play échoue 1ere fois, perte de valeur de tempo.
    - debut de la fonctionnalite de variation (sur une minute pour l'instant)
    - correction de pb de son lors de perte de la recuperation du focus de la fenetre.
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
            { viewState.variationOn && viewState.isPlaying && <label>Actuel: {viewState.tempo} bpm</label>}
            { !viewState.variationOn && <TempoInput tempo={viewState.tempo} onTempoChange={setTempo}/>}
        </section>

        <section className="variation" inert={viewState.isPlaying}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={viewState.variationOn}
                onChange={toggleVariation}
              />
              Mode Crescendo
            </label>
            { viewState.variationOn && <label>
              <input type="checkbox" checked={viewState.yoyo} onChange={toggleYoyo}/>
                Boucler (Yoyo)
            </label>}
          </div>

          { viewState.variationOn && <div className="TempoInputRange">
            <div><label>BPM de début:</label><TempoInput tempo={viewState.tempoBegin} onTempoChange={setTempoBegin}/></div>
            <div><label>BPM de fin:</label><TempoInput  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd}/></div>
            <div><label>Durée en sec:</label><TempoInput  tempo={viewState.variationDuration} onTempoChange={setVariationDuration}/></div>
          </div>}
        </section>

      </main>

      <footer className="description">"Le" métronome qui sait se distinguer.</footer>

    </div>
  )
}

export default App
