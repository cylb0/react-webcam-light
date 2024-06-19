import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { VideoConstraints } from "../../types/videoContraints";
import { useComputeDimensions } from "../../hooks/useComputeDimensions";
import { createPortal } from "react-dom";

export type WebcamRef = {
    startRecording: () => void;
    stopRecording: () => void;
    getRecordedChunks: () => Array<Blob>;
}

interface WebcamProps {
    audio?: boolean;
    fullscreen?: boolean;
    onRecordingStateChange: (isRecording: boolean) => void;
    videoConstraints: VideoConstraints;
}

const Webcam = forwardRef<WebcamRef, WebcamProps>(({
    audio = false,
    fullscreen = false,
    onRecordingStateChange,
    videoConstraints = {
        width: 640,
        height: 360
    }
}, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const dimensions = useComputeDimensions(videoConstraints)
    const [recordedChunks, setRecordedChunks] = useState<Array<Blob>>([])
    const [stream, setStream] = useState<MediaStream | null>(null)
    
    useEffect(() => {
        const handleRecordingStopped = () => {
            if (onRecordingStateChange) onRecordingStateChange(false)
        }

        const initStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
                mediaRecorderRef.current = new MediaRecorder(stream)
                mediaRecorderRef.current.ondataavailable = handleDataAvailable
                mediaRecorderRef.current.onstop = handleRecordingStopped
                setStream(stream)
            } catch (error) {
                alert('An error occured while accessing the camera.')
            }
        }
        initStream()

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [audio, onRecordingStateChange, stream])

    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data])
        }
    }



    const startRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive' ) {
            setRecordedChunks([])
            mediaRecorderRef.current.start()
            if (onRecordingStateChange) onRecordingStateChange(true)
        }
    }, [])

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
        }
    }, [])

    const getRecordedChunks = useCallback(() => {
        return recordedChunks
    }, [recordedChunks])

    const videoElement = 
    <video 
        ref={videoRef}
        style={{
           width: fullscreen ? '100%' : `${dimensions.width}px`,
           height: fullscreen ? '100%' : `${dimensions.height}px`,
           objectFit: 'cover'
        }}
        autoPlay
        muted
    />

    useImperativeHandle(ref, () => ({
        startRecording,
        stopRecording,
        getRecordedChunks,
    }), [getRecordedChunks, startRecording, stopRecording])

    return (
        <>
            {fullscreen
                ? createPortal(
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: -1,
                        }}
                    >
                        {videoElement}
                    </div>,
                    document.body
                ) : (
                    videoElement
                )
            }
        </>
    )
})

export default Webcam