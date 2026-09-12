import type {
  TimerPhotoOption,
  BackgroundOption,
  AmbientOption,
  SongOption,
  PomodoroSettings,
} from './types';

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

export const DEFAULT_SETTINGS: PomodoroSettings = {
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
  selectedBackground: null,
  backgroundBlur: 0,
  ballSize: 480,
  selectedSongUrl: null,
  musicVolume: 40,
  selectedAmbientUrl: null,
  ambientVolume: 50,
  selectedTimerPhoto: null,
  isSecretPhotosUnlocked: false,
};

export const STORAGE_KEY = 'enkephalos_pomodoro_settings_v2';
