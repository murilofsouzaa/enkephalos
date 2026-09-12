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
  Headphones,
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

  // Player contraído por padrão como na imagem
  const [isMinimized, setIsMinimized] = useState(true);
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
      if (ambientVolume === 0) {
        setAmbientVolume(40);
      }
    }
  };

  // Minimized Floating View (Contraído por padrão com borda menos redonda rounded-xl, sem controles de volume)
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--bg-surface,#181513)]/95 border border-[var(--border-subtle,#2d2723)] backdrop-blur-md rounded-xl shadow-xl text-[var(--text-main,#f3f0ea)] font-['Lexend',sans-serif]">
          {/* Headphones Icon & Track Title */}
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-left cursor-pointer group"
            title="Expandir player"
          >
            <Headphones
              className={`w-4 h-4 text-[var(--accent-color,#f59e0b)] shrink-0 ${
                isMusicPlaying ? 'animate-pulse' : 'opacity-80'
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
            className="w-6 h-6 rounded-lg bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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
            title="Expandir player"
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

  // Expanded View (Bordas menos redondas rounded-xl)
  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-5 sm:right-6 z-50 w-auto sm:w-84 max-w-[340px] ml-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[var(--bg-surface,#181513)]/95 border border-[var(--border-subtle,#2d2723)] backdrop-blur-xl rounded-xl p-3.5 shadow-2xl text-[var(--text-main,#f3f0ea)] font-['Lexend',sans-serif] space-y-3">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--accent-muted,rgba(245,158,11,0.12))] text-[var(--accent-color,#f59e0b)] border border-[var(--accent-color,#f59e0b)]/20">
              {songCategory}
            </span>

            {/* Rain Status Pill */}
            {selectedAmbientUrl && (
              <button
                type="button"
                onClick={handleToggleRain}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                title="Desabilitar som de chuva"
              >
                <CloudRain className="w-2.5 h-2.5" />
                <span>Chuva {ambientVolume}%</span>
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
              title="Contrair player"
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
          {/* Headphones Icon Avatar */}
          <div className="relative w-11 h-11 rounded-lg bg-[var(--bg-color,#121110)] border border-[var(--border-subtle,#2d2723)] flex items-center justify-center shrink-0 overflow-hidden">
            <Headphones
              className={`w-5 h-5 text-[var(--accent-color,#f59e0b)] ${
                isMusicPlaying ? 'animate-pulse' : 'opacity-80'
              }`}
            />
          </div>

          {/* Title & Status */}
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

        {/* Rain Controls (Always accessible in player) */}
        <div className="p-2 rounded-lg bg-[var(--bg-color,#121110)]/70 border border-[var(--border-subtle,#2d2723)] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 font-medium">
              <CloudRain className={`w-3.5 h-3.5 ${selectedAmbientUrl ? 'text-blue-400' : 'text-zinc-500'}`} />
              <span className={selectedAmbientUrl ? 'text-[var(--text-main,#f3f0ea)]' : 'text-[var(--text-muted,#9e9589)]'}>
                Som de Chuva
              </span>
              {selectedAmbientUrl && (
                <span className="text-blue-400 font-semibold tabular-nums">
                  {ambientVolume}%
                </span>
              )}
            </div>

            {/* Switch Toggle Button */}
            <button
              type="button"
              onClick={handleToggleRain}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                selectedAmbientUrl
                  ? 'bg-blue-500'
                  : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
              title={selectedAmbientUrl ? 'Desabilitar som de chuva' : 'Habilitar som de chuva'}
              aria-label={selectedAmbientUrl ? 'Desabilitar som de chuva' : 'Habilitar som de chuva'}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                  selectedAmbientUrl ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {selectedAmbientUrl && (
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-full h-1 accent-blue-400 bg-zinc-700 rounded cursor-pointer"
            />
          )}
        </div>

        {/* Music Volume Control */}
        <div className="p-2 rounded-lg bg-[var(--bg-color,#121110)]/70 border border-[var(--border-subtle,#2d2723)] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <button
              type="button"
              onClick={handleToggleMute}
              className="text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title={musicVolume === 0 ? "Ativar som" : "Mutar"}
            >
              {musicVolume === 0 ? (
                <VolumeX className="w-3 h-3 text-zinc-500" />
              ) : (
                <Volume2 className="w-3 h-3 text-[var(--accent-color,#f59e0b)]" />
              )}
              <span>Volume da Música</span>
            </button>
            <span className="text-[var(--accent-color,#f59e0b)] font-semibold tabular-nums">
              {musicVolume}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className="w-full h-1 accent-[var(--accent-color,#f59e0b)] bg-zinc-700 rounded cursor-pointer"
          />
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={prevSong}
            className="p-2 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Música anterior"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={toggleMusicPlaying}
            className="w-9 h-9 rounded-lg bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer"
            title={isMusicPlaying ? 'Pausar' : 'Tocar'}
          >
            {isMusicPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextSong}
            className="p-2 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Próxima música"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>
    </div>
  );
};
