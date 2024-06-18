import Webcam from '../lib/components/Webcam/Webcam'
import { VideoConstraints } from '../lib/types/videoContraints'
import './App.css'

function App() {

  const videoConstraints: VideoConstraints = {
    aspectRatio: 1.77
  }

  return (
    <>
      <Webcam
        videoConstraints={videoConstraints}
        fullscreen
      />
    </>
  )
}

export default App
