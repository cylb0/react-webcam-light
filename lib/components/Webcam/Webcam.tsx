import { FC, useEffect, useRef } from "react";
import { VideoConstraints } from "../../types/videoContraints";
import { useComputeDimensions } from "../../hooks/useComputeDimensions";
import { createPortal } from "react-dom";

type WebcamProps = {
    audio?: boolean;
    fullscreen?: boolean;
    videoConstraints: VideoConstraints;
}
const Webcam: FC<WebcamProps> = ({
    audio = false,
    fullscreen = false,
    videoConstraints = {
        width: 640,
        height: 360
    }
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const dimensions = useComputeDimensions(videoConstraints)
    
    useEffect(() => {
        const initStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audio })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (error) {
                alert('An error occured while accessing the camera.')
                console.error('An error occured while accessing the camera.', error)
            }
        }
        initStream()
    }, [audio])

    const videoElement = 
    <video 
        ref={videoRef}
        style={{
           width: fullscreen ? '100%' : `${dimensions.width}px`,
           height: fullscreen ? '100%' : `${dimensions.height}px`,
           objectFit: 'cover'
        }}
        autoPlay
    />

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
}

export default Webcam