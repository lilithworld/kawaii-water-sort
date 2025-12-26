class AudioService {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // Initialize on user interaction to comply with browser policies
  }

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination);
      this.gainNode.gain.value = 0.4; // Master volume
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  // Synthesize a "Meow" sound
  private playMeow(startFreq: number, endFreq: number, duration: number, type: OscillatorType = 'sawtooth', delay: number = 0) {
    this.init();
    if (!this.context || !this.gainNode) return;

    const t = this.context.currentTime + delay;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t);
    // Pitch bend for the "meow" contour
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

    // Filter to soften the sawtooth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);

    // Envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + (duration * 0.1)); // Attack
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration); // Decay

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    osc.start(t);
    osc.stop(t + duration);
  }

  playPop() {
    // Short high chirp
    this.playMeow(800, 1200, 0.1, 'sine');
  }

  playPour() {
    // A purr/liquid sound texture
    this.init();
    if (!this.context || !this.gainNode) return;
    
    const duration = 0.3;
    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    // AM Modulation for Purr effect
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, t); // Low rumble
    
    const lfo = this.context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 25; // Purr speed
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 500;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency); // FM synthesis for purr

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + duration);

    osc.connect(gain);
    gain.connect(this.gainNode);
    
    osc.start(t);
    lfo.start(t);
    osc.stop(t + duration);
    lfo.stop(t + duration);
  }

  playWin() {
    // Happy Meow Melody
    // Meow-Meow-Meow!
    this.playMeow(500, 400, 0.2, 'sawtooth', 0);
    this.playMeow(600, 500, 0.2, 'sawtooth', 0.15);
    this.playMeow(800, 600, 0.4, 'sawtooth', 0.3);
  }

  playLose() {
    // Sad, long, descending moan
    this.playMeow(450, 150, 0.8, 'triangle', 0);
    // Add a little whimper at the end
    this.playMeow(200, 150, 0.3, 'sine', 0.7);
  }

  playSelect() {
    // Short "mew"
    this.playMeow(600, 900, 0.08, 'sine');
  }
}

export const audioManager = new AudioService();