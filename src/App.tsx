import { useMetronome } from "./Metronome/useMetronome"
import { MetronomeView } from "./Metronome/MetronomeView"
import packageJson from "../package.json"
import { useCallback, useState } from "react"
import { Tempo } from "./Metronome/Tempo"

const news = `
    Quoi de neuf?
    - bug connu: il faut cliquer deux fois sur play en mode variation.
    - debut de la fonctionnalite de variation (sur une minute pour l'instant)
    - correction de pb de son lors de perte de la recuperation du focus de la fenetre.
  `

function App() {

  const { stop, play, tempo, setTempo, diodeOn, isPlaying, metronome } = useMetronome()
  const handleVersionClick = useCallback(() => {
    alert(news)
  }, [])

  const [variationOn, setVariation] = useState(false);
  const [tempoBegin, setTempoBegin] = useState(60)
  const [tempoEnd, setTempoEnd] = useState(120)

  const handlePlay = useCallback( () => {
    
    if (!variationOn)
      return play()
    
    const variationLoop = (amount: number, speed: number) => {

      if (!metronome.isPlaying)
        return
      
      if ( metronome._tempo >= tempoEnd )
      {
          stop()
          return;
      }

      setTempo( metronome._tempo + amount)

      setTimeout( () => variationLoop(amount, speed), speed)
    }

    setTempo(tempoBegin)
    play()
    variationLoop( (tempoEnd-tempoBegin) / 60, 1000 )

  }, [metronome, variationOn, tempoBegin, tempoEnd])

  return (
    <div className="App">
      <h1 className="title">
        Métron<span style={{ color: "#bec6ffff" }}>ô</span>me
        <span onClick={handleVersionClick} className="version">v{packageJson.version}</span></h1>
      <MetronomeView
        diodeOn={diodeOn}
        tempo={tempo}
        isPlaying={isPlaying}
        onTempoChange={setTempo}
        onPlayPressed={handlePlay}
        onStopPressed={stop}
      />

      <div className="divider"/>
      
      <div className="variation">
        <label>
        <input
          type="checkbox"
          checked={variationOn}
          onChange={(event) => { setVariation(event.currentTarget.checked)}}
        />
          Variation ON
        </label>
        { variationOn && <div className="tempos">
          <p>(Sur une duree d'1 min pour le moment...)</p>
          <label>Tempo (begin)</label><Tempo tempo={tempoBegin} onTempoChange={setTempoBegin}/>
          <label>Tempo (end)</label><Tempo  tempo={tempoEnd} onTempoChange={setTempoEnd}/>
        </div>}
      </div>
      <div className="divider"/>
      <p className="description">"Le" métronome qui sait se distinguer.</p>
    </div>
  )
}

export default App
