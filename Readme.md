# Screen recording

## Description
Simple js library for screen recording and saving it in webm format

### Install

npm

`npm install screen-recording`

yarn

`yarn add screen-recording`

### Usage

```js
  import { ScreenRecording } from 'screen-recording';

  const recording = new ScreenRecording({
    processVideo: (blob: Blob) => void, // *Required (what to do with with video recorded),
    onEnded: (e: Event) => void, // Optional action which happens when you click on stop sharing popup
    processChunks: (chunk) => void, // Optional action which happens when chunk data is available.
    resetChunks: boolean, // Optional if you want to clean chunks after recording is stopped (then put true, default false)
    interval: number // Optional time interval for chunk creating (default 5sec)
  });

  // Start recording
  recording.startRecording();
  // Stop recording
  recording.stopRecording();
```