// Audio alert utility supporting "เนเน่นายแน่มาก!" loud alarm sound
// Combines Web Audio API synthesizer for loud high-impact fanfare/chime + Web Speech Synthesis for clear voice announcement

export type AlarmSoundType = 'nene' | 'radar' | 'doctor';

let currentAudioContext: AudioContext | null = null;
let activeIntervalId: number | null = null;
let isAudioActive = false;

// Helper to get or resume audio context
const getAudioContext = (): AudioContext | null => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!currentAudioContext) {
      currentAudioContext = new AudioCtx();
    }
    if (currentAudioContext.state === 'suspended') {
      currentAudioContext.resume();
    }
    return currentAudioContext;
  } catch {
    return null;
  }
};

// Play upbeat fanfare tones (loud and energetic)
const playFanfareAlert = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  // Energetic bright fanfare notes (G4 -> C5 -> E5 -> G5)
  const notes = [
    { freq: 392.0, time: 0.0, dur: 0.12 },
    { freq: 523.25, time: 0.1, dur: 0.12 },
    { freq: 659.25, time: 0.2, dur: 0.12 },
    { freq: 783.99, time: 0.3, dur: 0.35 },
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Use triangle + square mix for rich, piercing audible timbre
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.001, now + time);
    gain.gain.exponentialRampToValueAtTime(0.45, now + time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + dur + 0.05);
  });
};

// Play standard iOS radar chime (milder fallback)
const playRadarChime = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  const notes = [659.25, 830.61, 987.77];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.14);

    gain.gain.setValueAtTime(0.001, now + idx * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.14 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.14);
    osc.stop(now + idx * 0.14 + 0.55);
  });
};

// Play speech synthesis utterance with Thai voice and enthusiastic punch
export const speakThaiUtterance = (text: string, pitch = 1.25, rate = 1.05) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.volume = 1.0; // Maximum volume
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const thaiVoice =
      voices.find((v) => v.lang === 'th-TH' || v.lang.toLowerCase().includes('th')) ||
      voices.find((v) => v.name.toLowerCase().includes('thai'));

    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis warning:', err);
  }
};

/**
 * Play a single iteration of the selected alarm sound
 */
export const playSingleAlarmSound = (soundType: AlarmSoundType = 'nene') => {
  const ctx = getAudioContext();

  if (soundType === 'nene') {
    // 1. Play loud upbeat fanfare first
    if (ctx) {
      playFanfareAlert(ctx);
    }
    // 2. Clear loud iconic Thai vocal announcement: "เนเน่ นายแน่มาก! ได้เวลากินยาแล้วครับ!"
    // Delayed slightly by 250ms so fanfare leads the cue
    setTimeout(() => {
      speakThaiUtterance('เนเน่ นายแน่มาก! เนเน่ นายแน่มาก! ได้เวลารับประทานยาแล้วครับ!', 1.25, 1.05);
    }, 250);
  } else if (soundType === 'doctor') {
    if (ctx) {
      playFanfareAlert(ctx);
    }
    setTimeout(() => {
      speakThaiUtterance('ขอแจ้งเตือนค่ะ ได้เวลารับประทานยาตามเวลาแล้วค่ะ กรุณาทานยาด้วยนะคะ', 1.1, 1.0);
    }, 200);
  } else {
    // Standard radar
    if (ctx) {
      playRadarChime(ctx);
    }
  }
};

/**
 * Start looping the alarm sound until explicitly stopped
 */
export const startLoopingAlarmSound = (
  soundType: AlarmSoundType = 'nene',
  intervalMs = 4000
) => {
  stopLoopingAlarmSound();
  isAudioActive = true;

  // Initial play immediately
  playSingleAlarmSound(soundType);

  // Repeat loop
  activeIntervalId = window.setInterval(() => {
    if (isAudioActive) {
      playSingleAlarmSound(soundType);
    }
  }, intervalMs);
};

/**
 * Stop alarm sound immediately
 */
export const stopLoopingAlarmSound = () => {
  isAudioActive = false;
  if (activeIntervalId !== null) {
    clearInterval(activeIntervalId);
    activeIntervalId = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
};
