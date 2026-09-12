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

export interface PomodoroSettings {
  liquidColors: LiquidColors;
  timerDurations: TimerDurations;
  isLiquidAnimated: boolean;
  buttonSoundsEnabled: boolean;
  isRealPomodoroMode: boolean;
  selectedBackground: string | null;
  backgroundBlur: number;
  ballSize: number;
  selectedSongUrl: string | null;
  musicVolume: number;
  selectedAmbientUrl: string | null;
  ambientVolume: number;
  selectedTimerPhoto: string | null;
  isSecretPhotosUnlocked: boolean;
}

export interface PomodoroSettingsContextType {
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
  backgroundBlur: number;
  setBackgroundBlur: (blur: number) => void;
  ballSize: number;
  setBallSize: (size: number) => void;
  selectedSongUrl: string | null;
  setSelectedSongUrl: (url: string | null) => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  toggleMusicPlaying: () => void;
  nextSong: () => void;
  prevSong: () => void;
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
