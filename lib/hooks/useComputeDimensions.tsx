import { useEffect, useState } from "react"
import { VideoConstraints } from "../types/videoContraints"
import { Dimensions } from "../types/webcam"
import { base_aspect_ratio, base_width } from "../constants/webcam"
import { AspectRatio } from "../enums/aspectRatios"

export const useComputeDimensions = (videoConstraints: VideoConstraints) => {
    const [dimensions, setDimensions] = useState<Dimensions | null>(null)

    useEffect(() => {
        const { aspectRatio, height, width } = videoConstraints
        const aspectRatioValue = AspectRatio[aspectRatio as keyof typeof AspectRatio]

        if (height && width) {
            setDimensions({ height, width })
        } else if (!aspectRatio) {
            const baseHeight = base_width * base_aspect_ratio
            setDimensions({
                height: height || (width ? width * base_aspect_ratio : baseHeight),
                width: width || (height ? height / base_aspect_ratio : base_width)
            })
        } else if (aspectRatio) {
            setDimensions({
                height: height || (width ? width * aspectRatioValue : base_width * aspectRatioValue),
                width: width || (height ? height / aspectRatioValue : base_width)
            })
        }

    }, [videoConstraints])

    return dimensions
}