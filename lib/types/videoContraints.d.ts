import { AspectRatio } from "../enums/aspectRatios";

export type VideoConstraints = {
    width?: number;
    height?: number;
    aspectRatio?: keyof typeof AspectRatio;
}