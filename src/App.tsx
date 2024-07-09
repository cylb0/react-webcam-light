import { useRef, useState } from 'react'
import Webcam from '../lib/components/Webcam/Webcam'
import { VideoConstraints } from '../lib/types/videoContraints'
import './App.css'
import { WebcamRef } from '../lib/types/webcam'
import { AspectRatio } from '../lib/enums/aspectRatios'
import { RecordingState } from '../lib/enums/recordingStates'

function App() {
  const webcamRef = useRef<WebcamRef>(null)
  const [recordingState, setRecordingState] = useState<RecordingState | null>(null)

  const videoConstraints: VideoConstraints = {
    height: 600,
    aspectRatio: AspectRatio.SIXTEEN_NINE
  }

  const handleRecordingStateChange = (state: RecordingState) => {
    setRecordingState(state)
  }

  return (
    <>
      <p>{webcamRef.current?.getRecordingState()}</p>
      <Webcam
        ref={webcamRef}
        rec
        videoConstraints={videoConstraints}
        onRecordingStateChange={handleRecordingStateChange}
      />
      {recordingState !== 'recording' &&
        (<button onClick={() => webcamRef.current?.startRecording()}>Start recording</button>)
      }
      {recordingState === 'recording' && 
        (<button onClick={() => webcamRef.current?.stopRecording()}>Stop recording</button>)}
      {recordingState === 'stopped' && 
      <button onClick={() => {
        webcamRef.current?.downloadVideo('test')
      }}>Download Chunks</button>}
    </>
  )
}

export default App
