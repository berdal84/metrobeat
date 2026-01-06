import { useMetronome } from "./Metronome/useMetronome"
import packageJson from "../package.json"
import { useCallback, useEffect, useMemo, useState, type MouseEventHandler, type ReactNode } from "react"
import { ValueInputField } from "./ValueInputField"
import { MODE, type Mode } from "./Metronome/Metronome"

// TODO LIST
//
// ## Corriger bugs:
// -  tempo de départ > tempo d'arrivée provoque une erreur dans Metronome.ts
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
    - début de séquenceur avec trois sons (tick, snare, kick), hat et crash seraient intéressants.
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
    state,
    stop, play,
    setTempo, setTempoBegin, setTempoEnd,
    setPeriod,
    setMode,
    setVolume,
    replaceSequence
  } = useMetronome({ tempo: 80, tempoBegin: 80, tempoEnd: 120, period: 60});

  const handleVersionClick = useCallback(() => {
    alert(news)
  }, [])

  const handlePlayButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback((_) => {
    if (state.isPlaying) {
      stop()
    } else {
      play()
    }
  }, [state.isPlaying])

  useEffect( () => {
    console.log("useEffect's state:", state);
  }, [state.isPlaying])

  const volumeLabel = useMemo(() => {
    if (state.volume === 0)
      return `Muet`;
    return `Vol ${Math.round(state.volume*100)}%`
  }, [state.volume])

  const getSequencerBtnClassName = useCallback((value: number, step: number) => {

    const classes = ['sequencer-btn'];

    if (value == 1)
      classes.push('down');
    
    if (step == state.step)
      classes.push('current');

    return classes.join(" ");

  }, [state.step])

  const [showSequencer, setShowSequencer] = useState(false)

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
              <div className={ state.diodeOn ? 'diode diode-on' : 'diode' }/>
              <p className={`value ${!state.isPlaying ? 'disabled' : ''}`}>
                {state.tempo}
                <span className="unit">bpm</span>
              </p>
            </div>

            <div className="flex-col">
              <button className='play-button' onClick={handlePlayButtonClick}>
                { state.isPlaying ? <>{stopIcon} STOP</> : <>{playIcon} PLAY</> }
              </button>
              <div className="volume">
                <input
                  type="range"
                  id="volume"
                  name="volume"
                  min="0"
                  max="1"
                  value={state.volume}
                  onChange={(event) => setVolume(event.currentTarget.valueAsNumber)}
                  step="0.05" />
                <label htmlFor="volume">{volumeLabel}</label>
              </div>
            </div>

          </div>

          <div className="modes" inert={state.isPlaying}>
              <hr/>
              <div className="FormGroup">
              {MODES.map( (item, i) => {
                return <button
                  key={i}
                  className={item.value == state.mode ? 'selected' : 'unselected'}
                  onClick={(_) => setMode(item.value)}
                >
                  {item.label}
                </button>
              })}
              </div>
              <hr/>
            </div>
            
        </section>

        <section hidden={state.mode != MODE.CONSTANT}>
          <div className="ValueInputField-group">
            <label className="ValueInputField-label">Tempo</label>
            <ValueInputField tempo={state.tempo} onTempoChange={setTempo} unit="bpm"/>
          </div>          
        </section>

        <section className="variation" inert={state.isPlaying}>
          <div className="TempoInputRange" hidden={state.mode ==  MODE.CONSTANT}>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo de départ</label>
              <ValueInputField tempo={state.tempoBegin} onTempoChange={setTempoBegin} unit="bpm"/>
            </div>
            <div className="ValueInputField-group">
              <label className="ValueInputField-label">Tempo d'arrivée</label>
              <ValueInputField  tempo={state.tempoEnd} onTempoChange={setTempoEnd} unit="bpm"/>
            </div>
          </div>

          <div className="ValueInputField-group" hidden={state.mode ==  MODE.CONSTANT}>
            <label className="ValueInputField-label">{ state.mode ==  MODE.INTERPOLATE_UP_AND_DOWN_FOREVER ? "Demi-période" : "Durée"} </label>
            <ValueInputField 
              tempo={state.period}
              onTempoChange={setPeriod}
              min={1} max={10*60} unit="sec"
            />
          </div>
        </section>

        <section className="advanced">
          <input id="sequencer-checkbox" type="checkbox" checked={showSequencer} onChange={() => setShowSequencer(v => !v)}/>
          <label htmlFor="sequencer-checkbox">Afficher Séquenceur</label>
        </section>

        { showSequencer && <section className="sequencer">
          <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Fonctionnalité en chantier...</p>
          {state.sequencer.map( (seq, idx) => 
            (<div key={`seq-${idx}`} className="sequencer-line">
              <span >{seq.soundId}</span>
              {seq.data.map( (n, step) => (
                <button
                  key={`${idx}-${step}`}
                  className={getSequencerBtnClassName(n, step)}
                  onClick={() => {
                    const new_data = [...seq.data];
                    new_data[step] = new_data[step] ? 0 : 1;
                    replaceSequence({ soundId: seq.soundId, data: new_data })
                  }}
                >
                </button>
              ))}
            </div>)
          )}
          
        </section>}
      </main>

      <footer>
        <span onClick={handleVersionClick} className="what-s-new">Quoi d'neuf sur la v{packageJson.version}?</span>
      </footer>
    </div>
  )
}

export default App
