const closeAudioContext = (audioContext) => {
  audioContext.close().catch(() => {});
};

/** Plays a short synthesized chime without requiring a bundled audio asset. */
export const playRevealSound = (volume = 50) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const play = () => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime;
    const peakGain = Math.pow(volume / 100, 2);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(659.25, start);
    oscillator.frequency.setValueAtTime(880, start + 0.1);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain), start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.addEventListener('ended', () => closeAudioContext(audioContext));
    oscillator.start(start);
    oscillator.stop(start + 0.36);
  };

  if (audioContext.state === 'suspended') {
    audioContext.resume().then(play).catch(() => closeAudioContext(audioContext));
  } else {
    play();
  }
};
