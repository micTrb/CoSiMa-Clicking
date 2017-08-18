import * as soundworks from 'soundworks/client';

const audioContext = soundworks.audioContext;

export default class SampleSynth {
	constructor(buffer) {
		this.bufferSource = audioContext.createBufferSource();
		this.bufferSource.buffer = buffer;
		console.log(buffer);
	}

	trigger() { 
		const source = audioContext.createBufferSource();
		source.buffer = this.bufferSource.buffer; 
		source.connect(audioContext.destination);
    source.start(audioContext.currentTime);
	}
}
