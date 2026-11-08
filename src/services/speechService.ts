export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  static getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  static speak(
    text: string, 
    lang: string = 'tr-TR', 
    rate: number = 1.05, 
    pitch: number = 1.0, 
    onEnd?: () => void
  ): void {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = this.getVoices();
    // Try to find a matching voice
    const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) || 
                         voices.find(v => v.lang.includes('tr') || v.lang.includes('en'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.activeUtterance = null;
      if (onEnd) onEnd();
    };

    this.activeUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.activeUtterance = null;
  }
}
