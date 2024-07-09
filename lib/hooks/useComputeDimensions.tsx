import { useEffect, useState } from "react"
import { VideoConstraints } from "../types/videoContraints"
import { Dimensions } from "../types/webcam"
import { base_aspect_ratio, base_width } from "../constants/webcam"

export const useComputeDimensions = (videoConstraints: VideoConstraints) => {
    const [dimensions, setDimensions] = useState<Dimensions | null>(null)

    useEffect(() => {
        const { aspectRatio, height, width } = videoConstraints

        if (height && width) {
            setDimensions({ height, width })
        } else if (!aspectRatio) {
            setDimensions({
                height: height || (width ? width / base_aspect_ratio : base_width / base_aspect_ratio),
                width: width || (height ? height * base_aspect_ratio : base_width)
            })
        } else if (aspectRatio) {
            setDimensions({
                height: height || (width ? width / aspectRatio : base_width / aspectRatio),
                width: width || (height ? height * aspectRatio : base_width)
            })
        }

    }, [videoConstraints])

    return dimensions
}