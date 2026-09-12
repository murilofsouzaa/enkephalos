const audioCache = new Map<string, HTMLAudioElement>();

export const SOUND_PATHS = {
  START: '/timer-start.mp3',
  PAUSED: '/timer-paused.mp3',
  ENDED: '/timer-ended.mp3',
  RESTART: '/time-restart.mp3',
} as const;

/**
 * Plays an audio sound with the given source and volume, caching the HTMLAudioElement
 * instance to prevent memory leaks from unbounded object creation.
 */
export const playSound = (src: string, volume = 0.7): void => {
  if (typeof window === 'undefined') return;

  try {
    let audio = audioCache.get(src);
    if (!audio) {
      audio = new Audio(src);
      audioCache.set(src, audio);
    }
    audio.currentTime = 0;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(() => {
      // Browser autoplay policy might reject audio until interaction, ignore safely
    });
  } catch {
    // Ignore audio playback errors safely
  }
};

export const playTimerStart = () => playSound(SOUND_PATHS.START, 0.7);
export const playTimerPaused = () => playSound(SOUND_PATHS.PAUSED, 0.7);
export const playTimerEnded = () => playSound(SOUND_PATHS.ENDED, 0.8);
export const playTimerRestart = () => playSound(SOUND_PATHS.RESTART, 0.7);
