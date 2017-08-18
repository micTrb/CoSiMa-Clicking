import * as soundworks from 'soundworks/client';

const audioContext = soundworks.audioContext;



export default class ClickNoiseSynth {
	constructor() {

		this.env = audioContext.createGain();
		this.env.connect(audioContext.destination);		
    
	}

	trigger() {
		const currentTime = audioContext.currentTime;
		const attack = 0.002;
		const release = 0.098;
		const duration = attack + release;
		const frequency = 600;

		this.env.gain.value = 0.0;
    this.env.gain.setValueAtTime(0, currentTime);
    this.env.gain.linearRampToValueAtTime(1.0, currentTime + attack);
    this.env.gain.exponentialRampToValueAtTime(0.0001, currentTime + attack + release);

		const osc = audioContext.createOscillator();
    osc.frequency.value = frequency;
    osc.start();
    osc.stop(currentTime + duration);
    osc.connect(this.env);
	}
}