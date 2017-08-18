import * as soundworks from 'soundworks/client';


const audioContext = soundworks.audioContext;
 

export default class WhiteNoiseSynth {
  constructor() {
    const sampleRate = audioContext.sampleRate;
    const channels = 1;
    const length = 0.1 * sampleRate;

    this.buffer = audioContext.createBuffer(channels, length, sampleRate);
    
    const data = this.buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  trigger() {
    const bufferSrc = audioContext.createBufferSource();
    bufferSrc.buffer = this.buffer; 
    bufferSrc.connect(audioContext.destination);
    bufferSrc.start();
  }
}







