export interface Options {
  processVideo: (blob: Blob) => void;
  onEnded?: (e) => void;
  processChunks?: (chunk) => void;
  resetChunks?: boolean;
  interval?: number;
}

type VoidParam = (e) => void;

export const ScreenRecording = (options: Options) => {
  const processVideo: (blob: Blob) => void = options.processVideo;
  const onEnded: VoidParam | undefined = options?.onEnded;
  const processChunks: VoidParam | undefined = options?.processChunks;
  const  resetChunks: boolean = options.resetChunks || false;
  const  interval: number = options.interval || 5000;

  let recordingInProgress: boolean = false;
  let chunks: Blob[] = [];
  let mediaRecorder: MediaRecorder | null = null;
  let recordingStream: MediaStream | null = null;

  const startRecording = async () => {
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
          recordingStream = stream as any;
          start();
          return stream;
      }

      } catch (e) {
          return e;
      }
  }

  const stopRecording = () => {
      recordingInProgress = false;

      if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
      }
  }

  const cleanChunks = () => chunks.length = 0;

  const start = () => {
      if (recordingInProgress) return;

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

          if (resetChunks) cleanChunks();
      });

      mediaRecorder.start(interval);
  }

  return { startRecording, stopRecording, recordingInProgress };
}
