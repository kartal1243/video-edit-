import { SynthGenre } from '../types/editor';

export class AudioSynthService {
  private static ctx: AudioContext | null = null;
  private static isPlayingBGM: boolean = false;
  private static currentGenre: SynthGenre | null = null;
  private static bgmGainNode: GainNode | null = null;
  private static loopIntervalId: number | null = null;

  static getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Sound effect: Whoosh (scene transition)
   */
  static playWhoosh(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Filtered white noise
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio SFX error:', e);
    }
  }

  /**
   * Sound effect: Pop / Bubble (element appear)
   */
  static playPop(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio SFX error:', e);
    }
  }

  /**
   * Sound effect: Chime / Ding (Call To Action / Success)
   */
  static playDing(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const freqs = [880, 1320, 1760];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.04);

        gain.gain.setValueAtTime(0.2 / (i + 1), now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i * 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + 0.9);
      });
    } catch (e) {
      console.warn('Audio SFX error:', e);
    }
  }

  /**
   * Play dynamic looping background music synthesized in real-time
   */
  static startBGM(genre: SynthGenre = 'tech', volume: number = 0.3): void {
    const ctx = this.getAudioContext();
    this.stopBGM();

    this.isPlayingBGM = true;
    this.currentGenre = genre;

    this.bgmGainNode = ctx.createGain();
    this.bgmGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    this.bgmGainNode.connect(ctx.destination);

    // Play initial loop and schedule repeating pattern
    this.scheduleMusicLoop(genre);
    // Every 4 seconds, trigger next bar
    this.loopIntervalId = window.setInterval(() => {
      if (this.isPlayingBGM) {
        this.scheduleMusicLoop(genre);
      }
    }, 4000);
  }

  private static scheduleMusicLoop(genre: SynthGenre): void {
    if (!this.ctx || !this.bgmGainNode) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Chords and bass notes
    let notes = [130.81, 155.56, 174.61, 196.00]; // C, Eb, F, G (minor pentatonic)
    if (genre === 'lofi') {
      notes = [146.83, 174.61, 220.00, 261.63]; // Dm7
    } else if (genre === 'energetic') {
      notes = [164.81, 196.00, 246.94, 329.63]; // E, G, B, E
    }

    // Play 8-step bass & chord pattern across 4 seconds (0.5s per beat)
    notes.forEach((freq, idx) => {
      const stepTime = now + idx * 0.5;

      // Bass note
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = genre === 'tech' ? 'sawtooth' : genre === 'lofi' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(freq / 2, stepTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(genre === 'tech' ? 600 : 400, stepTime);

      oscGain.gain.setValueAtTime(0.18, stepTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.45);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.bgmGainNode!);

      osc.start(stepTime);
      osc.stop(stepTime + 0.48);

      // Hi-hat / click beat on off-beats
      if (idx % 2 === 1) {
        const hhBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = hhBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const hh = ctx.createBufferSource();
        hh.buffer = hhBuffer;
        const hhFilter = ctx.createBiquadFilter();
        hhFilter.type = 'highpass';
        hhFilter.frequency.setValueAtTime(7000, stepTime);
        const hhGain = ctx.createGain();
        hhGain.gain.setValueAtTime(0.08, stepTime);
        hhGain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.05);

        hh.connect(hhFilter);
        hhFilter.connect(hhGain);
        hhGain.connect(this.bgmGainNode!);
        hh.start(stepTime);
        hh.stop(stepTime + 0.06);
      }
    });
  }

  static stopBGM(): void {
    this.isPlayingBGM = false;
    if (this.loopIntervalId !== null) {
      clearInterval(this.loopIntervalId);
      this.loopIntervalId = null;
    }
    if (this.bgmGainNode) {
      try {
        this.bgmGainNode.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
        this.bgmGainNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.bgmGainNode = null;
    }
  }

  static setBGMVolume(volume: number): void {
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
    }
  }
}
