import { useCallback, useRef, useState } from 'react'
import Webcam from '../lib/components/Webcam/Webcam'
import { VideoConstraints } from '../lib/types/videoContraints'
import './App.css'
import { WebcamRef } from '../lib/types/webcam'

function App() {

  const webcamRef = useRef<WebcamRef>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const videoConstraints: VideoConstraints = {
  }

  const handleGetRecordedChunks = () => {
    const blob: Blob = webcamRef.current!.getRecordedChunks()
    const url = URL.createObjectURL(blob)
    console.log(url)
    window.open(url, '_blank')
  }

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecording(isRecording)
  }, [])

  return (
    <>
      <Webcam
        ref={webcamRef}
        onRecordingStateChange={handleRecordingStateChange}
        rec
        videoConstraints={videoConstraints}
      />
      {!isRecording &&
        (<button onClick={() => webcamRef.current?.startRecording()}>Start recording</button>)
      }
      {isRecording && 
        (<button onClick={() => webcamRef.current?.stopRecording()}>Stop recording</button>)}
      {!isRecording && 
      <button onClick={handleGetRecordedChunks}>Download Chunks</button>}
    </>
  )
}

export default App
