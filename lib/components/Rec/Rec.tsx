import { FC, useEffect, useState } from "react"
import { RecProps } from "../../types/rec"

const Rec:FC<RecProps> = ({ isRecording }) => {
    const [isFlashing, setIsFlashing] = useState<boolean>(false)

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null
        if (isRecording) {
            intervalId = setInterval(() => {
                setIsFlashing(prev => !prev)
            }, 600)
        } else {
            setIsFlashing(false)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        } 
    }, [isRecording])

    return (
        <>
            {isRecording && 
                <div 
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <span 
                        style={{
                            color: 'white',
                            fontFamily: 'monospace',
                            fontSize: '1rem'
                        }}
                    >
                        REC
                    </span>
                    <div 
                        style={{
                            width: '1rem',
                            height: '1rem',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            opacity: isFlashing ? 0 : 1,
                            transition: 'opacity 0.2s ease-in-out'
                        }}></div>
                </div>
            }
        </>
    )
}

export default Rec