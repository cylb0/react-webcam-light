import { VideoConstraints } from "./videoContraints";

export interface WebcamProps {
    audio?: boolean;
    fullscreen?: boolean;
    onRecordingStateChange: (isRecording: boolean) => void;
    rec?: boolean;
    videoConstraints: VideoConstraints;
}

export type WebcamRef = {
    startRecording: () => void;
    stopRecording: () => void;
    getRecordedChunks: () => Blob;
}