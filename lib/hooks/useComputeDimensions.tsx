import { useEffect, useState } from "react"
import { VideoConstraints } from "../types/videoContraints"
import { Dimensions } from "../types/webcam"
import { BASE_ASPECT_RATIO, BASE_WIDTH } from "../constants/webcam"

export const useComputeDimensions = (videoConstraints: VideoConstraints) => {
    const [dimensions, setDimensions] = useState<Dimensions | null>(null)

    useEffect(() => {
        const { aspectRatio, height, width } = videoConstraints

        if (height && width) {
            setDimensions({ height, width })
        } else if (!aspectRatio) {
            setDimensions({
                height: height || (width ? width / BASE_ASPECT_RATIO : BASE_WIDTH / BASE_ASPECT_RATIO),
                width: width || (height ? height * BASE_ASPECT_RATIO : BASE_WIDTH)
            })
        } else if (aspectRatio) {
            setDimensions({
                height: height || (width ? width / aspectRatio : BASE_WIDTH / aspectRatio),
                width: width || (height ? height * aspectRatio : BASE_WIDTH)
            })
        }

    }, [videoConstraints])

    return dimensions
}