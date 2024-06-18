import { useEffect, useState } from "react"
import { VideoConstraints } from "../types/videoContraints"

export const useComputeDimensions = (videoConstraints: VideoConstraints) => {
    const [dimensions, setDimensions] = useState<{ width: number, height: number }>({
        width: 640,
        height: 360
    })

    useEffect(() => {
        const { aspectRatio, height: initialHeight, width: initialWidth } = videoConstraints
        let width = initialWidth
        let height = initialHeight

        if (!width && aspectRatio && height) {
            width = Math.floor(height * aspectRatio)
        } else if (!height && aspectRatio && width) {
            height = Math.floor(width / aspectRatio)
        }

        setDimensions({ height: height || 360, width: width || 640 })
    }, [videoConstraints])

    return dimensions
}