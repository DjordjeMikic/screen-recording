export interface Options {
    processVideo: (blob: Blob) => void;
    onEnded?: (e: any) => void;
    processChunks?: (chunk: any) => void;
    resetChunks?: boolean;
    interval?: number;
}
export declare class ScreenRecording {
    private recordingInProgress;
    private chunks;
    private mediaRecorder;
    private recordingStream;
    private processVideo;
    private onEnded?;
    private processChunks?;
    private resetChunks?;
    private interval;
    constructor(options: Options);
    startRecording(): Promise<unknown>;
    stopRecording(): void;
    private start;
    private cleanChunks;
}
