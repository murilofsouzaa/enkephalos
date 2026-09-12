import { createContext, useContext, useState, useEffect, useRef, type ReactNode, type FC } from 'react';

export interface LiquidColors {
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
}

export interface TimerDurations {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
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

export interface TimerPhotoOption {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export const AVAILABLE_TIMER_PHOTOS: TimerPhotoOption[] = [
  {
    id: 'nuna-car',
    title: 'Nuna & Murilo',
    subtitle: 'Momento no carro',
    url: '/backgrounds/timer/nuna/WhatsApp Image 2026-09-11 at 9.13.23 PM (1).jpeg',
  },
  {
    id: 'nuna-mirror',
    title: 'Nuna & Murilo',
    subtitle: 'No espelho',
    url: '/backgrounds/timer/nuna/WhatsApp Image 2026-09-11 at 9.13.23 PM (2).jpeg',
  },
  {
    id: 'nuna-palace',
    title: 'Nuna & Murilo',
    subtitle: 'No palácio',
    url: '/backgrounds/timer/nuna/WhatsApp Image 2026-09-11 at 9.13.23 PM.jpeg',
  },
];

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
  {
    id: 'gotham-4k',
    title: 'Gotham City (4K)',
    url: '/backgrounds/479748-3840x2160-desktop-4k-gotham-city-wallpaper-image.jpg',
  },
  {
    id: 'gotham-1080p',
    title: 'Gotham City (1080p)',
    url: '/backgrounds/479827-1920x1080-desktop-1080p-gotham-city-wallpaper-photo.jpg',
  },
  {
    id: 'gotham1',
    title: 'Gotham City Skyline',
    url: '/backgrounds/gotham1.jpg',
  },
  {
    id: 'fallen-knight',
    title: 'Fallen Knight (Blossom Field)',
    url: '/backgrounds/Fallen knight blossom field.jpeg',
  },
  {
    id: 'knight1',
    title: 'Cavaleiro Negro I',
    url: '/backgrounds/knight1.jpg',
  },
  {
    id: 'knight2',
    title: 'Cavaleiro Negro II',
    url: '/backgrounds/knight2.png',
  },
  {
    id: 'celtic',
    title: 'Celtic Forest',
    url: '/backgrounds/celtic.jpg',
  },
  {
    id: 'forest1',
    title: 'Floresta Mágica',
    url: '/backgrounds/forest1.jpg',
  },
  {
    id: 'fantasy',
    title: 'Fantasy Realm (4K)',
    url: '/backgrounds/fantasy.jpg',
  },
  {
    id: 'fantasy-minecraft',
    title: 'Fantasy Minecraft',
    url: '/backgrounds/fantasyminecraft.jpg',
  },
  {
    id: 'hogwarts',
    title: 'Hogwarts Castle',
    url: '/backgrounds/hoggwarts.jpg',
  },
  {
    id: 'hogwarts-night',
    title: 'Hogwarts at Night (4K)',
    url: '/backgrounds/hoggwartsatnight.png',
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
  // Lofi
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
    id: 'lofi-532pm',
    title: '5:32 PM (The Deli)',
    category: 'Lofi',
    url: '/songs/lofi/The Deli - 5_32PM.mp3',
  },
  {
    id: 'lofi-kudasai',
    title: "The Girl I Haven't Met (Kudasai)",
    category: 'Lofi',
    url: "/songs/lofi/kudasaibeats - the girl i haven't met.mp3",
  },

  // Øneheart
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

  // Celtic
  {
    id: 'celtic-riverdance',
    title: 'Riverdance',
    category: 'Celtic',
    url: '/songs/celtic/01 Riverdance - The Best of Celtic Music.mp3',
  },
  {
    id: 'celtic-love-song',
    title: 'Celtic Love Song',
    category: 'Celtic',
    url: '/songs/celtic/Celtic  Emotional Music - Celtic Love Song.mp3',
  },
  {
    id: 'celtic-daydream',
    title: 'Daydream Melody',
    category: 'Celtic',
    url: '/songs/celtic/Celtic Music - Daydream Melody.mp3',
  },
  {
    id: 'celtic-guardians',
    title: 'Guardians Of The Woods',
    category: 'Celtic',
    url: '/songs/celtic/Celtic Music - Guardians Of The Woods.mp3',
  },
  {
    id: 'celtic-land-free',
    title: 'Land of the Free',
    category: 'Celtic',
    url: '/songs/celtic/Celtic Music - Land of the Free.mp3',
  },

  // Jazz
  {
    id: 'jazz-alive',
    title: 'Alive (Jazz Funk)',
    category: 'Jazz',
    url: '/songs/jazz/Alive - Jazz Funk  Independent Royalty Free Music by Danya Vodovoz.mp3',
  },
  {
    id: 'jazz-fourtwentyone',
    title: 'Fourtwentyone',
    category: 'Jazz',
    url: '/songs/jazz/Fourtwentyone.mp3',
  },
  {
    id: 'jazz-integration',
    title: 'Integration Loops (Pt. 1)',
    category: 'Jazz',
    url: '/songs/jazz/Integration Loops pt1.mp3',
  },
  {
    id: 'jazz-funk-soul',
    title: 'Jazz Funk My Soul',
    category: 'Jazz',
    url: '/songs/jazz/Jazz Funk my Soul.mp3',
  },
];

export const COLOR_PRESETS = [
  { label: 'Verde Água', value: '#06b6d4' },
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
  timerDurations: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  isLiquidAnimated: true,
  buttonSoundsEnabled: true,
  isRealPomodoroMode: false,
  selectedBackground: null as string | null,
  ballSize: 480,
  selectedSongUrl: null as string | null,
  musicVolume: 40,
  selectedAmbientUrl: null as string | null,
  ambientVolume: 50,
  selectedTimerPhoto: null as string | null,
  isSecretPhotosUnlocked: false,
};

const STORAGE_KEY = 'enkephalos_pomodoro_settings_v2';

interface PomodoroSettingsContextType {
  liquidColors: LiquidColors;
  setLiquidColor: (mode: 'pomodoro' | 'shortBreak' | 'longBreak', color: string) => void;
  timerDurations: TimerDurations;
  setTimerDuration: (mode: 'pomodoro' | 'shortBreak' | 'longBreak', minutes: number) => void;
  isLiquidAnimated: boolean;
  setIsLiquidAnimated: (animated: boolean) => void;
  buttonSoundsEnabled: boolean;
  setButtonSoundsEnabled: (enabled: boolean) => void;
  isRealPomodoroMode: boolean;
  setIsRealPomodoroMode: (enabled: boolean) => void;
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
  selectedTimerPhoto: string | null;
  setSelectedTimerPhoto: (url: string | null) => void;
  isSecretPhotosUnlocked: boolean;
  setIsSecretPhotosUnlocked: (unlocked: boolean) => void;
  toggleSecretPhotosUnlocked: () => void;
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

export const usePomodoroSettings = () => {
  const context = useContext(PomodoroSettingsContext);
  if (!context) {
    throw new Error('usePomodoroSettings must be used within a PomodoroSettingsProvider');
  }
  return context;
};
