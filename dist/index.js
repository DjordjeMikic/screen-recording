"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenRecording = void 0;
const ScreenRecording = (options) => {
    const processVideo = options.processVideo;
    const onEnded = options?.onEnded;
    const processChunks = options?.processChunks;
    const resetChunks = options.resetChunks || false;
    const interval = options.interval || 5000;
    let recordingInProgress = false;
    let chunks = [];
    let mediaRecorder = null;
    let recordingStream = null;
    const startRecording = async () => {
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
                recordingStream = stream;
                start();
                return stream;
            }
        }
        catch (e) {
            return e;
        }
    };
    const stopRecording = () => {
        recordingInProgress = false;
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    };
    const cleanChunks = () => (chunks.length = 0);
    const start = () => {
        if (recordingInProgress)
            return;
        if (!recordingStream) {
            console.log('Could not start recording');
            return;
        }
        recordingInProgress = true;
        const readyStream = new MediaStream();
        recordingStream.getTracks().forEach((track) => {
            readyStream.addTrack(track);
        });
        recordingStream.getTracks()[0].onended = (e) => {
            onEnded?.(e);
        };
        mediaRecorder = new MediaRecorder(readyStream, {
            mimeType: 'video/webm;codecs=vp8,opus',
        });
        mediaRecorder.addEventListener('dataavailable', (chunk) => {
            chunks.push(chunk.data);
            processChunks?.(chunk);
        });
        mediaRecorder.addEventListener('stop', async (e) => {
            if (recordingStream) {
                recordingStream.getTracks().forEach((track) => track.stop());
            }
            recordingStream = null;
            console.log('Now it should download');
            processVideo(new Blob(chunks, { type: chunks[0].type }));
            if (resetChunks)
                cleanChunks();
        });
        mediaRecorder.start(interval);
    };
    const getRecordingInProgress = () => recordingInProgress;
    return {
        startRecording,
        stopRecording,
        getRecordingInProgress,
    };
};
exports.ScreenRecording = ScreenRecording;
