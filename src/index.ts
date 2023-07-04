export interface Options {
  processVideo: (blob: Blob) => void;
  onEnded?: (e) => void;
  processChunks?: (chunk) => void;
  resetChunks?: boolean;
  interval?: number;
}

export class ScreenRecording {
  private recordingInProgress: boolean;
  private chunks: Blob[];
  private mediaRecorder: MediaRecorder | null;
  private recordingStream: MediaStream | null;
  private processVideo: (blob: Blob) => void;
  private onEnded?: (e) => void;
  private processChunks?: (chunk) => void;
  private resetChunks?: boolean;
  private interval: number;

  constructor(options: Options) {
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
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: {
          displaySurface: 'monitor',
          height: 1200,
          width: 1440,
        },
      } as DisplayMediaStreamOptions);

      if (stream) {
        this.recordingStream = stream as any;
        this.start();
        return stream;
      }
    } catch (e) {
      return e;
    }
  }

  stopRecording() {
    this.recordingInProgress = false;

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  private start() {
    if (this.recordingInProgress) return;

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

      if (this.resetChunks) this.cleanChunks();
    });

    this.mediaRecorder.start(this.interval);
  }

  private cleanChunks() {
    this.chunks.length = 0;
  }
}
