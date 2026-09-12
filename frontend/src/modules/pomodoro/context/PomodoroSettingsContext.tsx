import { useState, useEffect, useRef, type ReactNode, type FC } from 'react';
import { PomodoroSettingsContext } from './PomodoroContext';
import { DEFAULT_SETTINGS, STORAGE_KEY, AVAILABLE_SONGS } from '../constants';
import { playSound } from '../utils/soundEffects';

export const PomodoroSettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          liquidColors: { ...DEFAULT_SETTINGS.liquidColors, ...(parsed.liquidColors || {}) },
          timerDurations: { ...DEFAULT_SETTINGS.timerDurations, ...(parsed.timerDurations || {}) },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio player refs
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Songs Audio Sync
  useEffect(() => {
    if (!musicAudioRef.current) {
      musicAudioRef.current = new Audio();
      musicAudioRef.current.loop = true;
    }

    const audio = musicAudioRef.current;
    audio.volume = Math.max(0, Math.min(1, settings.musicVolume / 100));

    if (settings.selectedSongUrl) {
      if (audio.src !== window.location.origin + settings.selectedSongUrl && !audio.src.endsWith(encodeURI(settings.selectedSongUrl))) {
        audio.src = settings.selectedSongUrl;
        audio.load();
      }

      if (isMusicPlaying) {
        audio.play().catch(() => {
          setIsMusicPlaying(false);
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [settings.selectedSongUrl, settings.musicVolume, isMusicPlaying]);

  // Ambient Audio Sync
  useEffect(() => {
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio();
      ambientAudioRef.current.loop = true;
    }

    const audio = ambientAudioRef.current;
    audio.volume = Math.max(0, Math.min(1, settings.ambientVolume / 100));

    if (settings.selectedAmbientUrl) {
      if (audio.src !== window.location.origin + settings.selectedAmbientUrl && !audio.src.endsWith(encodeURI(settings.selectedAmbientUrl))) {
        audio.src = settings.selectedAmbientUrl;
        audio.load();
      }

      if (isAmbientPlaying) {
        audio.play().catch(() => {
          setIsAmbientPlaying(false);
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [settings.selectedAmbientUrl, settings.ambientVolume, isAmbientPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current = null;
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current = null;
      }
    };
  }, []);

  const setLiquidColor = (mode: 'pomodoro' | 'shortBreak' | 'longBreak', color: string) => {
    setSettings((prev: typeof settings) => ({
      ...prev,
      liquidColors: {
        ...prev.liquidColors,
        [mode]: color,
      },
    }));
  };

  const setTimerDuration = (mode: 'pomodoro' | 'shortBreak' | 'longBreak', minutes: number) => {
    const safeMinutes = Math.max(1, Math.min(180, Math.round(Number(minutes) || 1)));
    setSettings((prev: typeof settings) => ({
      ...prev,
      timerDurations: {
        ...prev.timerDurations,
        [mode]: safeMinutes,
      },
    }));
  };

  const setIsLiquidAnimated = (isLiquidAnimated: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, isLiquidAnimated }));
  };

  const setButtonSoundsEnabled = (buttonSoundsEnabled: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, buttonSoundsEnabled }));
  };

  const setIsRealPomodoroMode = (isRealPomodoroMode: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, isRealPomodoroMode }));
  };

  const setSelectedBackground = (selectedBackground: string | null) => {
    setSettings((prev: typeof settings) => ({ ...prev, selectedBackground }));
  };

  const setBackgroundBlur = (backgroundBlur: number) => {
    setSettings((prev: typeof settings) => ({ ...prev, backgroundBlur }));
  };

  const setBallSize = (ballSize: number) => {
    setSettings((prev: typeof settings) => ({ ...prev, ballSize }));
  };

  const setSelectedSongUrl = (selectedSongUrl: string | null) => {
    setSettings((prev: typeof settings) => ({ ...prev, selectedSongUrl }));
    if (selectedSongUrl) {
      setIsMusicPlaying(true);
    } else {
      setIsMusicPlaying(false);
    }
  };

  const setMusicVolume = (musicVolume: number) => {
    setSettings((prev: typeof settings) => ({ ...prev, musicVolume }));
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = Math.max(0, Math.min(1, musicVolume / 100));
    }
  };

  const toggleMusicPlaying = () => {
    if (!settings.selectedSongUrl) return;
    setIsMusicPlaying((prev) => !prev);
  };

  const nextSong = () => {
    if (AVAILABLE_SONGS.length === 0) return;
    const currentIndex = AVAILABLE_SONGS.findIndex((s) => s.url === settings.selectedSongUrl);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % AVAILABLE_SONGS.length;
    setSelectedSongUrl(AVAILABLE_SONGS[nextIndex].url);
  };

  const prevSong = () => {
    if (AVAILABLE_SONGS.length === 0) return;
    const currentIndex = AVAILABLE_SONGS.findIndex((s) => s.url === settings.selectedSongUrl);
    const prevIndex = currentIndex <= 0 ? AVAILABLE_SONGS.length - 1 : currentIndex - 1;
    setSelectedSongUrl(AVAILABLE_SONGS[prevIndex].url);
  };

  const setSelectedAmbientUrl = (selectedAmbientUrl: string | null) => {
    setSettings((prev: typeof settings) => ({ ...prev, selectedAmbientUrl }));
    if (selectedAmbientUrl) {
      setIsAmbientPlaying(true);
    } else {
      setIsAmbientPlaying(false);
    }
  };

  const setAmbientVolume = (ambientVolume: number) => {
    setSettings((prev: typeof settings) => ({ ...prev, ambientVolume }));
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = Math.max(0, Math.min(1, ambientVolume / 100));
    }
  };

  const toggleAmbientPlaying = () => {
    if (!settings.selectedAmbientUrl) return;
    setIsAmbientPlaying((prev) => !prev);
  };

  const setSelectedTimerPhoto = (selectedTimerPhoto: string | null) => {
    setSettings((prev: typeof settings) => ({ ...prev, selectedTimerPhoto }));
  };

  const setIsSecretPhotosUnlocked = (isSecretPhotosUnlocked: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, isSecretPhotosUnlocked }));
  };

  const toggleSecretPhotosUnlocked = () => {
    setSettings((prev: typeof settings) => ({
      ...prev,
      isSecretPhotosUnlocked: !prev.isSecretPhotosUnlocked,
    }));
  };

  const playButtonSound = (audioSrc: string) => {
    if (!settings.buttonSoundsEnabled) return;
    playSound(audioSrc);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setIsMusicPlaying(false);
    setIsAmbientPlaying(false);
  };

  return (
    <PomodoroSettingsContext.Provider
      value={{
        liquidColors: settings.liquidColors,
        setLiquidColor,
        timerDurations: settings.timerDurations,
        setTimerDuration,
        isLiquidAnimated: settings.isLiquidAnimated,
        setIsLiquidAnimated,
        buttonSoundsEnabled: settings.buttonSoundsEnabled,
        setButtonSoundsEnabled,
        isRealPomodoroMode: settings.isRealPomodoroMode,
        setIsRealPomodoroMode,
        selectedBackground: settings.selectedBackground,
        setSelectedBackground,
        backgroundBlur: settings.backgroundBlur ?? 0,
        setBackgroundBlur,
        ballSize: settings.ballSize,
        setBallSize,
        selectedSongUrl: settings.selectedSongUrl,
        setSelectedSongUrl,
        musicVolume: settings.musicVolume,
        setMusicVolume,
        isMusicPlaying,
        setIsMusicPlaying,
        toggleMusicPlaying,
        nextSong,
        prevSong,
        selectedAmbientUrl: settings.selectedAmbientUrl,
        setSelectedAmbientUrl,
        ambientVolume: settings.ambientVolume,
        setAmbientVolume,
        isAmbientPlaying,
        setIsAmbientPlaying,
        toggleAmbientPlaying,
        selectedTimerPhoto: settings.selectedTimerPhoto,
        setSelectedTimerPhoto,
        isSecretPhotosUnlocked: settings.isSecretPhotosUnlocked,
        setIsSecretPhotosUnlocked,
        toggleSecretPhotosUnlocked,
        isSettingsOpen,
        setIsSettingsOpen,
        playButtonSound,
        resetSettings,
      }}
    >
      {children}
    </PomodoroSettingsContext.Provider>
  );
};
