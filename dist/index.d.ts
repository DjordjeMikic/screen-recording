export interface Options {
    processVideo: (blob: Blob) => void;
    interval: number;
    onEnded?: (e: any) => void;
    processChunks?: (chunk: any) => void;
    resetChunks?: boolean;
}
export declare class ScreenRecording {
    private recordingInProgress;
    private saved;
    private chunks;
    private mediaRecorder;
    private recordingStream;
    private processVideo;
    private onEnded?;
    private processChunks?;
    private resetChunks?;
    private interval;
    constructor(options: Options);
    requestRecordingPermission(): Promise<unknown>;
    stopRecording(): void;
    startRecording(): void;
    cleanChunks(): void;
}
