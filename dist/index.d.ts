export interface Options {
    processVideo: (blob: Blob) => void;
    onEnded?: (e: any) => void;
    processChunks?: (chunk: any) => void;
    resetChunks?: boolean;
    interval?: number;
}
export declare const ScreenRecording: (options: Options) => {
    startRecording: () => Promise<unknown>;
    stopRecording: () => void;
    getRecordingInProgress: () => boolean;
};
