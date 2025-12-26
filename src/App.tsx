import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, useState, type MouseEventHandler } from "react"
import { ValueInputField } from "./ValueInputField"
import type { Mode } from "./Metronome/Metronome"

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

const MODES: Array<{value: Mode, label: string}> = [
  { value: "normal", label: "régulier" },
  { value: "grow", label: "interpoler" },
  { value: "yoyo", label: "yoyo" },
]

function App() {

  const {
    viewState,
    stop, play,
    setTempo, setTempoBegin, setTempoEnd,
    setPeriod,
    setMode,
  } = useMetronome({ tempo: 80, tempoBegin: 80, tempoEnd: 120, period: 60});

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

          <div className="FormGroup modes" inert={viewState.isPlaying}>
            {MODES.map( (item, i) => {
              return <button
                key={i} name="mode"
                className={ item.value == viewState.mode ? 'on' : 'off'}
                onClick={(_) => setMode(item.value)}
              >
                {item.label}
              </button>
            })}
          </div>
        </section>



        <div hidden={viewState.mode != "normal"}>
          <ValueInputField tempo={viewState.tempo} onTempoChange={setTempo} unit="bpm"/>
        </div>

        <section className="variation" inert={viewState.isPlaying}>
          <div className="TempoInputRange" hidden={viewState.mode == "normal"}>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de départ</label>
              <ValueInputField tempo={viewState.tempoBegin} onTempoChange={setTempoBegin} unit="bpm"/>
            </div>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de fin</label>
              <ValueInputField  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd} unit="bpm"/>
            </div>
          </div>

          <div className="ValueInputField-group" hidden={viewState.mode == "normal"}>
            <label className="ValueInputField-label">Durée d'interpolation</label>
            <ValueInputField 
              tempo={viewState.period}
              onTempoChange={setPeriod}
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
