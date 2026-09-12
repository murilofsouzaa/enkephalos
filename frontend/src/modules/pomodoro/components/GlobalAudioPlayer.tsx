import { useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  ChevronDown,
  ChevronUp,
  Timer,
  CloudRain,
  Disc3,
} from 'lucide-react';
import {
  usePomodoroSettings,
  AVAILABLE_SONGS,
  RAIN_AUDIO_URL,
} from '../context/PomodoroSettingsContext';

export const GlobalAudioPlayer: FC = () => {
  const {
    selectedSongUrl,
    setSelectedSongUrl,
    isMusicPlaying,
    toggleMusicPlaying,
    musicVolume,
    setMusicVolume,
    nextSong,
    prevSong,
    selectedAmbientUrl,
    setSelectedAmbientUrl,
    ambientVolume,
    setAmbientVolume,
  } = usePomodoroSettings();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showRainControls, setShowRainControls] = useState(false);
  const [prevMusicVolume, setPrevMusicVolume] = useState(musicVolume || 40);

  const location = useLocation();
  const navigate = useNavigate();

  // If no song is selected, don't show the music mini-player
  if (!selectedSongUrl) {
    return null;
  }

  const currentSong = AVAILABLE_SONGS.find((s) => s.url === selectedSongUrl);
  const songTitle = currentSong?.title || 'Música de Foco';
  const songCategory = currentSong?.category || 'Música';
  const isPomodoroRoute = location.pathname === '/pomodoro';

  const handleToggleMute = () => {
    if (musicVolume > 0) {
      setPrevMusicVolume(musicVolume);
      setMusicVolume(0);
    } else {
      setMusicVolume(prevMusicVolume || 40);
    }
  };

  const handleToggleRain = () => {
    if (selectedAmbientUrl) {
      setSelectedAmbientUrl(null);
    } else {
      setSelectedAmbientUrl(RAIN_AUDIO_URL);
    }
  };

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-surface,#181513)]/95 border border-[var(--border-subtle,#2d2723)] backdrop-blur-md rounded-full shadow-xl text-[var(--text-main,#f3f0ea)] font-['Lexend',sans-serif]">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-left cursor-pointer group"
            title="Expandir player"
          >
            <Disc3
              className={`w-4 h-4 text-[var(--accent-color,#f59e0b)] shrink-0 ${
                isMusicPlaying ? 'animate-spin [animation-duration:3s]' : ''
              }`}
            />
            <span className="text-xs font-medium max-w-[120px] sm:max-w-[160px] truncate group-hover:text-[var(--accent-color,#f59e0b)] transition-colors">
              {songTitle}
            </span>
          </button>

          <div className="h-3.5 w-px bg-[var(--border-subtle,#2d2723)]" />

          {/* Quick Play/Pause */}
          <button
            type="button"
            onClick={toggleMusicPlaying}
            className="w-6 h-6 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={isMusicPlaying ? 'Pausar' : 'Tocar'}
          >
            {isMusicPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </button>

          {/* Expand */}
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] transition-colors cursor-pointer"
            title="Expandir mini player"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Close / Stop */}
          <button
            type="button"
            onClick={() => setSelectedSongUrl(null)}
            className="p-1 text-[var(--text-muted,#9e9589)] hover:text-rose-400 transition-colors cursor-pointer"
            title="Fechar música"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded Mini Player Card
  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-5 sm:right-6 z-50 w-auto sm:w-84 max-w-[340px] ml-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[var(--bg-surface,#181513)]/95 border border-[var(--border-subtle,#2d2723)] backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl text-[var(--text-main,#f3f0ea)] font-['Lexend',sans-serif] space-y-3">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-muted,rgba(245,158,11,0.12))] text-[var(--accent-color,#f59e0b)] border border-[var(--accent-color,#f59e0b)]/20">
              {songCategory}
            </span>

            {/* Quick Rain Status Pill */}
            {selectedAmbientUrl && (
              <button
                type="button"
                onClick={() => setShowRainControls(!showRainControls)}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                title="Ajustar som de chuva"
              >
                <CloudRain className="w-2.5 h-2.5" />
                <span>Chuva</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Link to Pomodoro if elsewhere */}
            {!isPomodoroRoute && (
              <button
                type="button"
                onClick={() => navigate('/pomodoro')}
                className="p-1.5 text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] transition-colors rounded-md hover:bg-white/5 cursor-pointer"
                title="Abrir Pomodoro Timer"
              >
                <Timer className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] transition-colors rounded-md hover:bg-white/5 cursor-pointer"
              title="Minimizar"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Close / Stop */}
            <button
              type="button"
              onClick={() => setSelectedSongUrl(null)}
              className="p-1.5 text-[var(--text-muted,#9e9589)] hover:text-rose-400 transition-colors rounded-md hover:bg-white/5 cursor-pointer"
              title="Parar música"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle Track Info */}
        <div className="flex items-center gap-3">
          {/* Vinyl / Equalizer Avatar */}
          <div className="relative w-11 h-11 rounded-xl bg-[var(--bg-color,#121110)] border border-[var(--border-subtle,#2d2723)] flex items-center justify-center shrink-0 overflow-hidden group">
            <Disc3
              className={`w-6 h-6 text-[var(--accent-color,#f59e0b)] ${
                isMusicPlaying ? 'animate-spin [animation-duration:4s]' : 'opacity-80'
              }`}
            />
            {isMusicPlaying && (
              <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-main,#f3f0ea)] truncate leading-tight">
              {songTitle}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isMusicPlaying ? (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-2.5 bg-[var(--accent-color,#f59e0b)] rounded-full animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-[var(--accent-color,#f59e0b)] rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="w-0.5 h-2 bg-[var(--accent-color,#f59e0b)] rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              )}
              <span className="text-[10px] text-[var(--text-muted,#9e9589)] truncate">
                {isMusicPlaying ? 'Tocando no site inteiro' : 'Pausado'}
              </span>
            </div>
          </div>
        </div>

        {/* Rain Controls Flyout (if active and toggled) */}
        {showRainControls && selectedAmbientUrl && (
          <div className="p-2 rounded-xl bg-[var(--bg-color,#121110)]/70 border border-blue-500/20 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-blue-300 font-medium flex items-center gap-1">
                <CloudRain className="w-3 h-3" /> Volume Chuva
              </span>
              <span className="text-blue-400 font-semibold">{ambientVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-full h-1 accent-blue-400 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Bottom Playback & Volume Row */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevSong}
              className="p-1.5 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Música anterior"
            >
              <SkipBack className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              type="button"
              onClick={toggleMusicPlaying}
              className="w-8 h-8 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer"
              title={isMusicPlaying ? 'Pausar' : 'Tocar'}
            >
              {isMusicPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextSong}
              className="p-1.5 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Próxima música"
            >
              <SkipForward className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Rain Quick Toggle */}
            <button
              type="button"
              onClick={handleToggleRain}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ml-1 ${
                selectedAmbientUrl
                  ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                  : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-white/5'
              }`}
              title={selectedAmbientUrl ? 'Desligar som de chuva' : 'Ligar som de chuva'}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 flex-1 max-w-[110px]">
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-1 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] transition-colors cursor-pointer shrink-0"
              title={musicVolume === 0 ? 'Desmutar' : 'Mutar'}
            >
              {musicVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full h-1 accent-[var(--accent-color,#f59e0b)] bg-zinc-700 rounded-lg cursor-pointer"
              title={`Volume: ${musicVolume}%`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
