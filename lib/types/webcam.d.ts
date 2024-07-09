import { RecordingState } from "../enums/recordingStates";
import { VideoConstraints } from "./videoContraints";

/**
 * Interface defining props for Webcam component
 */
export interface WebcamProps {
    /**
     * (Optional) Wether to include audio in the webcam capture. Defaults to `false`.
     */
    audio?: boolean;
    /**
     * (Optional) Wether to display Webcam feed in fullscreen mode. Defaults to `false`.
     */
    fullscreen?: boolean;
    /**
     * Wether or not to display a Recording overlay when recording starts.
     */
    rec?: boolean;
    /**
     * An object defining video constraints for the webcam, including width,
     * height and aspect ratio.
     */
    videoConstraints: VideoConstraints;
    /**
     * Callback that notifies parent component when recording state changes.
     */
    onRecordingStateChange: (RecordingState) => void
}

/**
 * Interface defining the reference object exposed by the Webcam component.
 */
export interface WebcamRef {
    /**
     * Starts recording the webcam feed.
     */
    startRecording: () => void;
    /**
     * Stops recording the webcam feed.
     */
    stopRecording: () => void;
    /**
     * Retrieves the recorded video data as a Blob object.
     * 
     * @returns The Blob object representing the final recorded video.
     * @throws {Error} If no video has been recorded yet.
     */
    getRecordedChunks: () => Blob;
    /**
     * Download the recorded video as a webm file with the specified name.
     * 
     * @param filename - The name of the video file.
     */
    downloadVideo: (filename: string) => void;
    /**
     * Returns the state of the recording.
     */
    getRecordingState: () => RecordingState
}

/**
 * Interface defining the dimensions of the webcam feed.
 */
export interface Dimensions {
    /**
     * The height of the webcam feed in pixels.
     */
    height: number;
    /**
     * The width of the webcam feed in pixels.
     */
    width: number;
}
