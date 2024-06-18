import { useRef, useState } from 'react'
import Webcam, { WebcamRef } from '../lib/components/Webcam/Webcam'
import { VideoConstraints } from '../lib/types/videoContraints'
import './App.css'

function App() {

  const webcamRef = useRef<WebcamRef>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const videoConstraints: VideoConstraints = {
    aspectRatio: 1.77
  }

  const handleGetRecordedChunks = () => {
    const chunks: Array<Blob> = webcamRef.current?.getRecordedChunks() || []
    if (chunks.length > 0) {
      const blobVideo = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blobVideo)
      console.log(url)
      window.open(url, '_blank')
    } else {
      alert('No recorded chunks')
    }
  }

  const handleStartRecording = () => {
    console.log('click start')
    webcamRef.current?.startRecording()
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    console.log('click stop')
    webcamRef.current?.stopRecording()
    setIsRecording(false)
  }

  return (
    <>
      <Webcam
        ref={webcamRef}
        videoConstraints={videoConstraints}
      />
      {!isRecording &&
        (<button onClick={handleStartRecording}>Start recording</button>)
      }
      {isRecording && 
        (<button onClick={handleStopRecording}>Stop recording</button>)}
      {!isRecording && <button onClick={handleGetRecordedChunks}>Download Chunks</button>}
    </>
  )
}

export default App
