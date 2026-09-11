import { createContext, useContext, useState, useEffect, useRef, type ReactNode, type FC } from 'react';

export interface LiquidColors {
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
}

export interface SongOption {
  id: string;
  title: string;
  category: string;
  url: string;
}

export interface BackgroundOption {
  id: string;
  title: string;
  url: string;
}

export interface AmbientOption {
  id: string;
  title: string;
  description: string;
  url: string | null;
}

export const AVAILABLE_BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'tlou-ellie',
    title: 'The Last of Us Part II (Ellie 4K)',
    url: '/backgrounds/the-last-of-us-part-ii-ellie-playstation-4-2020-games-3840x2160-1880.jpg',
  },
  {
    id: 'lib1',
    title: 'Biblioteca / Library',
    url: '/backgrounds/lib1.jpg',
  },
  {
    id: 'back1',
    title: 'Castelo Limgrave (4K)',
    url: '/backgrounds/back1.jpg',
  },
  {
    id: 'back2',
    title: 'Limgrave (4K)',
    url: '/backgrounds/back2.jpg',
  },
  {
    id: 'back3',
    title: 'Raya Lucaria (4K)',
    url: '/backgrounds/back3.jpeg',
  },
];

export const RAIN_AUDIO_URL = '/ambient/rain.mp3';

export const AVAILABLE_AMBIENTS: AmbientOption[] = [
  {
    id: 'rain',
    title: 'Chuva',
    description: 'Chuva relaxante e contínua',
    url: '/ambient/rain.mp3',
  },
];

export const AVAILABLE_SONGS: SongOption[] = [
  {
    id: 'lofi-dreamland',
    title: 'In Dreamland',
    category: 'Lofi',
    url: "/songs/lofi/[no copyright music] 'In Dreamland ' background music.mp3",
  },
  {
    id: 'lofi-2am',
    title: '2:00 AM Cute',
    category: 'Lofi',
    url: "/songs/lofi/[no copyright music] '2_00 AM' cute background music.mp3",
  },
  {
    id: 'lofi-break',
    title: 'Little Break',
    category: 'Lofi',
    url: "/songs/lofi/[no copyright music] 'little break' lofi background music.mp3",
  },
  {
    id: 'oneheart-apathy',
    title: 'Apathy',
    category: 'Øneheart',
    url: '/songs/oneheart/øneheart - apathy.mp3',
  },
  {
    id: 'oneheart-nostalgia',
    title: 'Nostalgia',
    category: 'Øneheart',
    url: '/songs/oneheart/øneheart - nostalgia.mp3',
  },
  {
    id: 'oneheart-feeling',
    title: 'This Feeling',
    category: 'Øneheart',
    url: '/songs/oneheart/øneheart - this feeling.mp3',
  },
  {
    id: 'oneheart-next-to-you',
    title: 'Next to You',
    category: 'Øneheart',
    url: '/songs/oneheart/Øneheart - next to you.mp3',
  },
  {
    id: 'oneheart-apathy-slowed',
    title: 'Apathy (Slowed)',
    category: 'Øneheart',
    url: '/songs/oneheart/øneheart - apathy (slowed).mp3',
  },
  {
    id: 'oneheart-her-eyes',
    title: 'Her Eyes',
    category: 'Øneheart',
    url: '/songs/oneheart/øneheart - her eyes.mp3',
  },
];

export const COLOR_PRESETS = [
  { label: 'Ciano', value: '#06b6d4' },
  { label: 'Azul Elétrico', value: '#2563eb' },
  { label: 'Esmeralda', value: '#10b981' },
  { label: 'Âmbar', value: '#f59e0b' },
  { label: 'Coral', value: '#f43f5e' },
  { label: 'Violeta', value: '#a855f7' },
  { label: 'Índigo', value: '#6366f1' },
  { label: 'Turquesa', value: '#14b8a6' },
  { label: 'Grafite', value: '#475569' },
  { label: 'Dourado', value: '#eab308' },
];

const DEFAULT_SETTINGS = {
  liquidColors: {
    pomodoro: '#06b6d4',
    shortBreak: '#10b981',
    longBreak: '#3b82f6',
  },
  isLiquidAnimated: true,
  buttonSoundsEnabled: true,
  selectedBackground: null as string | null,
  ballSize: 480,
  selectedSongUrl: null as string | null,
  musicVolume: 40,
  selectedAmbientUrl: null as string | null,
  ambientVolume: 50,
};

const STORAGE_KEY = 'enkephalos_pomodoro_settings_v2';

interface PomodoroSettingsContextType {
  liquidColors: LiquidColors;
  setLiquidColor: (mode: 'pomodoro' | 'shortBreak' | 'longBreak', color: string) => void;
  isLiquidAnimated: boolean;
  setIsLiquidAnimated: (animated: boolean) => void;
  buttonSoundsEnabled: boolean;
  setButtonSoundsEnabled: (enabled: boolean) => void;
  selectedBackground: string | null;
  setSelectedBackground: (bg: string | null) => void;
  ballSize: number;
  setBallSize: (size: number) => void;
  selectedSongUrl: string | null;
  setSelectedSongUrl: (url: string | null) => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  toggleMusicPlaying: () => void;
  selectedAmbientUrl: string | null;
  setSelectedAmbientUrl: (url: string | null) => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;
  isAmbientPlaying: boolean;
  setIsAmbientPlaying: (playing: boolean) => void;
  toggleAmbientPlaying: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  playButtonSound: (audioSrc: string) => void;
  resetSettings: () => void;
}

const PomodoroSettingsContext = createContext<PomodoroSettingsContextType | undefined>(undefined);

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
      if (isMusicPlaying) {
        setIsMusicPlaying(false);
      }
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
      if (isAmbientPlaying) {
        setIsAmbientPlaying(false);
      }
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

  const setIsLiquidAnimated = (isLiquidAnimated: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, isLiquidAnimated }));
  };

  const setButtonSoundsEnabled = (buttonSoundsEnabled: boolean) => {
    setSettings((prev: typeof settings) => ({ ...prev, buttonSoundsEnabled }));
  };

  const setSelectedBackground = (selectedBackground: string | null) => {
    setSettings((prev: typeof settings) => ({ ...prev, selectedBackground }));
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

  const playButtonSound = (audioSrc: string) => {
    if (!settings.buttonSoundsEnabled) return;
    try {
      const audio = new Audio(audioSrc);
      audio.currentTime = 0;
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {
      // ignore
    }
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
        isLiquidAnimated: settings.isLiquidAnimated,
        setIsLiquidAnimated,
        buttonSoundsEnabled: settings.buttonSoundsEnabled,
        setButtonSoundsEnabled,
        selectedBackground: settings.selectedBackground,
        setSelectedBackground,
        ballSize: settings.ballSize,
        setBallSize,
        selectedSongUrl: settings.selectedSongUrl,
        setSelectedSongUrl,
        musicVolume: settings.musicVolume,
        setMusicVolume,
        isMusicPlaying,
        setIsMusicPlaying,
        toggleMusicPlaying,
        selectedAmbientUrl: settings.selectedAmbientUrl,
        setSelectedAmbientUrl,
        ambientVolume: settings.ambientVolume,
        setAmbientVolume,
        isAmbientPlaying,
        setIsAmbientPlaying,
        toggleAmbientPlaying,
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

export const usePomodoroSettings = () => {
  const context = useContext(PomodoroSettingsContext);
  if (!context) {
    throw new Error('usePomodoroSettings must be used within a PomodoroSettingsProvider');
  }
  return context;
};
