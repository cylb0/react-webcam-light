import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useComputeDimensions } from "../../hooks/useComputeDimensions";
import { createPortal } from "react-dom";
import Rec from "../Rec/Rec";
import { WebcamProps, WebcamRef } from "../../types/webcam";

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
    const [isRecording, setIsRecording] = useState<boolean>(false)
    
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
    }, [audio, onRecordingStateChange])

    /**
     * Handles the data available event from MediaRecorder.
     * 
     * This is triggered whenever MediaRecorder has available data
     * If data size is greater than 0 it appends data to the
     * recordedChunks state.
     * 
     * @param {BlobEvent} event - The BlobEvent object containing
     * recorded data.
     */
    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data])
        }
    }

    /**
     * Starts recording the media stream
     * 
     * This functions initializes the recording by reseting the
     * recorded chunks state. It then starts the MediaRecorder
     * and notify the parent component about the change in recording
     * state using prop callback.
     * 
     * @function
     */
    const startRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive' ) {
            setRecordedChunks([])
            mediaRecorderRef.current.start()
            setIsRecording(true)
            if (onRecordingStateChange) onRecordingStateChange(true)
        }
    }, [])

    /**
     * Stops recording the MediaStream.
     * 
     * This function stops the MediaRecorder if it is in 'recording' state.
     * 
     * @function
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }, [])

    /**
     * Retrieves recorded chunks as a single Blob object.
     * 
     * This function combines the recorded media chunks into a single
     * Blob object and returns it. If now chunks are available or if 
     * an error occurs while creating the Blob, it throws an error.
     * 
     * @returns {Blob} - The recorded media chunks combined in a single Blob.
     * @throws {Error} - If there are no recorded chunks or if Blob
     * creation fails.
     * @function
     * 
     */
    const getRecordedChunks = useCallback(() => {
        if (recordedChunks.length === 0) {
            throw new Error('No recorded chunks available.')
        }
        
        try {
            return new Blob(recordedChunks, { type: 'video/webm' })
        } catch (error) {
            throw new Error('Failed to create Blob from recorded chunks.')
        }
    }, [recordedChunks])

    const videoElement = 
    <div style={{
        position: 'relative'
    }}>
        <Rec isRecording={isRecording} />
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
    </div>

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