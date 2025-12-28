import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, useMemo, type MouseEventHandler, type ReactNode } from "react"
import { ValueInputField } from "./ValueInputField"
import { MODE, type Mode } from "./Metronome/Metronome"

// TODO LIST
//
// ## Corriger bugs:
//
// ## Fonctionnalités:
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
    - réorganisation de l'interface
    - afficher le BPM courant
    - mode accelerando: "période" => "durée", "tempo de fin" => "tempo d'arrivée".
  `

const MODES: Array<{ value: Mode, label: ReactNode }> = [
  {
    value: MODE.CONSTANT,
    label: "Régulier"
  },
  {
    value: MODE.INTERPOLATE_UP_AND_HOLD,
    label:
      <div className="d-flex">
        <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
        </svg>
        <span>Accelerando</span>
      </div>
  },
  {
    value: MODE.INTERPOLATE_UP_AND_DOWN_FOREVER,
    label:
      <div className="d-flex">
        <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <span>Yoyo</span>
      </div>
  },
]

const playIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
</svg>

const stopIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z" clipRule="evenodd" />
</svg>



function App() {

  const {
    viewState,
    stop, play,
    setTempo, setTempoBegin, setTempoEnd,
    setPeriod,
    setMode,
    setVolume,
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

  const volumeLabel = useMemo(() => {
    if (viewState.volume === 0)
      return `Muet`;
    return `Vol ${Math.round(viewState.volume*100)}%`
  }, [viewState.volume])

  return (
    <div className="App">

      <header>
        Métronome
        <span className="version">v{packageJson.version}</span>
      </header>

      <main>

        <section className="controls">

          <div className="controls-main">
            
            <div className="bpm-display">
              <div className={ viewState.diodeOn ? 'diode diode-on' : 'diode' }/>
              <p className={`value ${!viewState.isPlaying ? 'disabled' : ''}`}>
                {viewState.tempo}
                <span className="unit">bpm</span>
              </p>
            </div>

            <div className="flex-col">
              <button className='play-button' onClick={handlePlayButtonClick}>
                { viewState.isPlaying ? <>{stopIcon} STOP</> : <>{playIcon} PLAY</> }
              </button>
              <div className="volume">
                <input
                  type="range"
                  id="volume"
                  name="volume"
                  min="0"
                  max="1"
                  value={viewState.volume}
                  onChange={(event) => setVolume(event.currentTarget.valueAsNumber)}
                  step="0.05" />
                <label htmlFor="volume">{volumeLabel}</label>
              </div>
            </div>

          </div>

          <div className="FormGroup modes" inert={viewState.isPlaying}>
              {MODES.map( (item, i) => {
                return <button
                  key={i}
                  className={item.value == viewState.mode ? 'selected' : 'unselected'}
                  onClick={(_) => setMode(item.value)}
                >
                  {item.label}
                </button>
              })}
            </div>
        </section>

        <section hidden={viewState.mode != MODE.CONSTANT}>
          <ValueInputField tempo={viewState.tempo} onTempoChange={setTempo} unit="bpm"/>
        </section>

        <section className="variation" inert={viewState.isPlaying}>
          <div className="TempoInputRange" hidden={viewState.mode ==  MODE.CONSTANT}>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de départ</label>
              <ValueInputField tempo={viewState.tempoBegin} onTempoChange={setTempoBegin} unit="bpm"/>
            </div>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo d'arrivée</label>
              <ValueInputField  tempo={viewState.tempoEnd} onTempoChange={setTempoEnd} unit="bpm"/>
            </div>
          </div>

          <div className="ValueInputField-group" hidden={viewState.mode ==  MODE.CONSTANT}>
            <label className="ValueInputField-label">{ viewState.mode ==  MODE.INTERPOLATE_UP_AND_DOWN_FOREVER ? "Demi-période" : "Durée"} </label>
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
