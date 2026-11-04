// Web Audio API Synthesizer for instant, reliable sound effects
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('tabuada_sound_enabled', enabled ? 'true' : 'false');
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tabuada_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
}

// Sucess chime: Bright rising triad (C5 - E5 - G5 - C6)
export function playSuccessSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5];
  const now = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0, now + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 0.3);
  });
}

// Gentle "tenta outra vez" sound: Warm, gentle double tone, not punishing
export function playGentleTryAgainSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(329.63, now); // E4
  osc.frequency.setValueAtTime(261.63, now + 0.15); // C4

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

// Subtle click / selection pop
export function playPopSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

// Fanfare when finishing a game or unlocking a medal
export function playVictoryFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const melody = [
    { freq: 523.25, time: 0, dur: 0.12 },    // C5
    { freq: 523.25, time: 0.14, dur: 0.12 }, // C5
    { freq: 523.25, time: 0.28, dur: 0.12 }, // C5
    { freq: 659.25, time: 0.42, dur: 0.2 },  // E5
    { freq: 783.99, time: 0.64, dur: 0.2 },  // G5
    { freq: 1046.5, time: 0.86, dur: 0.45 }, // C6
  ];

  melody.forEach(item => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.freq, now + item.time);

    gain.gain.setValueAtTime(0, now + item.time);
    gain.gain.linearRampToValueAtTime(0.25, now + item.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + item.time);
    osc.stop(now + item.time + item.dur + 0.05);
  });
}

// Speak Portuguese multiplication phrase (Web Speech API)
export function speakMathPhrase(phrase: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!soundEnabled) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterance
    const utterance = new SpeechSynthesisUtterance(phrase);
    
    // Attempt to pick a pt-PT voice, fallback to any pt, then default
    const voices = window.speechSynthesis.getVoices();
    const ptPtVoice = voices.find(v => v.lang.startsWith('pt-PT')) || 
                      voices.find(v => v.lang.startsWith('pt'));
    
    if (ptPtVoice) {
      utterance.voice = ptPtVoice;
    }
    utterance.lang = 'pt-PT';
    utterance.rate = 0.95; // Slightly slower and clearer for 8-year-old kids
    utterance.pitch = 1.1; // Cheerful tone

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available', err);
  }
}
