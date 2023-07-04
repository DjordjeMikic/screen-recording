"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenRecording = void 0;
class ScreenRecording {
    recordingInProgress;
    chunks;
    mediaRecorder;
    recordingStream;
    processVideo;
    onEnded;
    processChunks;
    resetChunks;
    interval;
    constructor(options) {
        this.recordingInProgress = false;
        this.chunks = [];
        this.mediaRecorder = null;
        this.recordingStream = null;
        this.processVideo = options.processVideo;
        this.onEnded = options?.onEnded;
        this.processChunks = options?.processChunks;
        this.resetChunks = options.resetChunks || false;
        this.interval = options.interval || 5000;
    }
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
                video: {
                    displaySurface: 'monitor',
                    height: 1200,
                    width: 1440,
                },
            });
            if (stream) {
                this.recordingStream = stream;
                this.start();
                return stream;
            }
        }
        catch (e) {
            return e;
        }
    }
    stopRecording() {
        this.recordingInProgress = false;
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
    }
    start() {
        if (this.recordingInProgress)
            return;
        if (!this.recordingStream) {
            console.log('Could not start recording');
            return;
        }
        this.recordingInProgress = true;
        const readyStream = new MediaStream();
        this.recordingStream.getTracks().forEach((track) => {
            readyStream.addTrack(track);
        });
        this.recordingStream.getTracks()[0].onended = (e) => {
            this.onEnded?.(e);
        };
        this.mediaRecorder = new MediaRecorder(readyStream, {
            mimeType: 'video/webm;codecs=vp8,opus',
        });
        this.mediaRecorder.addEventListener('dataavailable', (chunk) => {
            this.chunks.push(chunk.data);
            this.processChunks?.(chunk);
        });
        this.mediaRecorder.addEventListener('stop', async (e) => {
            if (this.recordingStream) {
                this.recordingStream.getTracks().forEach((track) => track.stop());
            }
            this.recordingStream = null;
            console.log('Now it should download');
            this.processVideo(new Blob(this.chunks, { type: this.chunks[0].type }));
            if (this.resetChunks)
                this.cleanChunks();
        });
        this.mediaRecorder.start(this.interval);
    }
    cleanChunks() {
        this.chunks.length = 0;
    }
}
exports.ScreenRecording = ScreenRecording;
