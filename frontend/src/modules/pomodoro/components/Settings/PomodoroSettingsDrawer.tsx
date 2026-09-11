import { useState, useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
} from 'lucide-react';
import {
  usePomodoroSettings,
  AVAILABLE_BACKGROUNDS,
  RAIN_AUDIO_URL,
  AVAILABLE_SONGS,
  COLOR_PRESETS,
} from '../../context/PomodoroSettingsContext';

export const PomodoroSettingsDrawer: FC = () => {
  const {
    liquidColors,
    setLiquidColor,
    timerDurations,
    setTimerDuration,
    isLiquidAnimated,
    setIsLiquidAnimated,
    buttonSoundsEnabled,
    setButtonSoundsEnabled,
    isRealPomodoroMode,
    setIsRealPomodoroMode,
    selectedBackground,
    setSelectedBackground,
    ballSize,
    setBallSize,
    selectedSongUrl,
    setSelectedSongUrl,
    musicVolume,
    setMusicVolume,
    isMusicPlaying,
    toggleMusicPlaying,
    selectedAmbientUrl,
    setSelectedAmbientUrl,
    ambientVolume,
    setAmbientVolume,
    isAmbientPlaying,
    toggleAmbientPlaying,
    isSettingsOpen,
    setIsSettingsOpen,
    resetSettings,
  } = usePomodoroSettings();

  const [activeColorTab, setActiveColorTab] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  
  // Track active music category tab ('none' | 'Lofi' | 'Øneheart')
  const [activeMusicCategory, setActiveMusicCategory] = useState<'none' | 'Lofi' | 'Øneheart'>(() => {
    if (!selectedSongUrl) return 'none';
    const song = AVAILABLE_SONGS.find((s) => s.url === selectedSongUrl);
    return (song?.category as 'Lofi' | 'Øneheart') || 'Lofi';
  });

  const currentSong = AVAILABLE_SONGS.find((s) => s.url === selectedSongUrl);

  // Close drawer on Escape key
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  return (
    <>
      {/* Settings Floating Trigger Button on the Right Side */}
      <button
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        className="fixed right-3 sm:right-6 top-18 sm:top-24 z-30 p-2 sm:p-2.5 rounded-full bg-[var(--bg-surface,#181513)]/90 hover:bg-[var(--bg-surface-hover,#221d19)] text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] border border-[var(--border-subtle,#26211e)] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer group"
        title="Configurações do Pomodoro"
        aria-label="Abrir configurações"
      >
        <Settings className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-90" />
      </button>

      {/* Portal overlay and drawer to document.body so it covers the entire screen, header and all */}
      {createPortal(
        <>
          {/* Backdrop overlay - darkens with blur covering whole viewport including sticky header */}
          {isSettingsOpen && (
            <div
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9990] transition-all duration-300 animate-in fade-in"
              style={{ willChange: 'opacity, backdrop-filter' }}
            />
          )}

          {/* Drawer Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] z-[9999] shadow-2xl border-l border-[var(--border-subtle,#26211e)] flex flex-col transform transition-all duration-300 ease-in-out ${
              isSettingsOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'
            }`}
          >
        {/* Drawer Header - Clean typography without icon clutter */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle,#26211e)] bg-[var(--bg-surface,#171412)]/70">
          <div>
            <h3 className="font-['Raleway',sans-serif] text-sm font-bold tracking-wider uppercase text-[var(--text-main,#f3f0ea)]">
              Configurações
            </h3>
            <p className="text-[11px] font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)]">
              Pomodoro, ambiente e preferências
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-md text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221d19)] transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Main Scroll Body with Sleek Custom Scrollbar (NO inner sub-scrollbars) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 custom-scrollbar text-xs font-['Lexend',sans-serif]">
          
          {/* ================= SECTION 0: DURAÇÃO DOS TIMERS ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)]" />
                Duração dos Timers
              </h4>
              <span className="text-[10px] text-[var(--text-dimmed,#78716c)]">
                Em minutos
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Pomodoro */}
              <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: liquidColors.pomodoro }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-[var(--text-main,#f3f0ea)]">
                        Pomodoro (Foco)
                      </span>
                      <p className="text-[10px] text-[var(--text-dimmed,#78716c)]">Tempo de trabalho contínuo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[var(--bg-surface-hover,#221d19)] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle,#26211e)]">
                    <button
                      type="button"
                      onClick={() => setTimerDuration('pomodoro', timerDurations.pomodoro - 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Diminuir 1 minuto"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={timerDurations.pomodoro}
                      onChange={(e) => setTimerDuration('pomodoro', Number(e.target.value))}
                      className="w-9 text-center text-xs font-['Lexend',sans-serif] font-bold bg-transparent text-[var(--accent-color,#f59e0b)] focus:outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-dimmed,#78716c)] pr-0.5">m</span>
                    <button
                      type="button"
                      onClick={() => setTimerDuration('pomodoro', timerDurations.pomodoro + 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Aumentar 1 minuto"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] text-[var(--text-dimmed,#78716c)] mr-0.5">Atalhos:</span>
                  {[15, 20, 25, 30, 45, 50, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTimerDuration('pomodoro', m)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-['Lexend',sans-serif] font-medium cursor-pointer transition-colors ${
                        timerDurations.pomodoro === m
                          ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-bold shadow-xs'
                          : 'bg-[var(--bg-surface-hover,#221d19)] text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Pausa Curta */}
              <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: liquidColors.shortBreak }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-[var(--text-main,#f3f0ea)]">
                        Pausa Curta
                      </span>
                      <p className="text-[10px] text-[var(--text-dimmed,#78716c)]">Descanso entre sessões</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[var(--bg-surface-hover,#221d19)] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle,#26211e)]">
                    <button
                      type="button"
                      onClick={() => setTimerDuration('shortBreak', timerDurations.shortBreak - 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Diminuir 1 minuto"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={timerDurations.shortBreak}
                      onChange={(e) => setTimerDuration('shortBreak', Number(e.target.value))}
                      className="w-9 text-center text-xs font-['Lexend',sans-serif] font-bold bg-transparent text-[var(--accent-color,#f59e0b)] focus:outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-dimmed,#78716c)] pr-0.5">m</span>
                    <button
                      type="button"
                      onClick={() => setTimerDuration('shortBreak', timerDurations.shortBreak + 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Aumentar 1 minuto"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] text-[var(--text-dimmed,#78716c)] mr-0.5">Atalhos:</span>
                  {[3, 5, 8, 10, 15].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTimerDuration('shortBreak', m)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-['Lexend',sans-serif] font-medium cursor-pointer transition-colors ${
                        timerDurations.shortBreak === m
                          ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-bold shadow-xs'
                          : 'bg-[var(--bg-surface-hover,#221d19)] text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Pausa Longa */}
              <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs"
                      style={{ backgroundColor: liquidColors.longBreak }}
                    />
                    <div>
                      <span className="text-xs font-semibold text-[var(--text-main,#f3f0ea)]">
                        Pausa Longa
                      </span>
                      <p className="text-[10px] text-[var(--text-dimmed,#78716c)]">Descanso prolongado</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[var(--bg-surface-hover,#221d19)] px-1.5 py-0.5 rounded-md border border-[var(--border-subtle,#26211e)]">
                    <button
                      type="button"
                      onClick={() => setTimerDuration('longBreak', timerDurations.longBreak - 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Diminuir 1 minuto"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={timerDurations.longBreak}
                      onChange={(e) => setTimerDuration('longBreak', Number(e.target.value))}
                      className="w-9 text-center text-xs font-['Lexend',sans-serif] font-bold bg-transparent text-[var(--accent-color,#f59e0b)] focus:outline-none"
                    />
                    <span className="text-[10px] text-[var(--text-dimmed,#78716c)] pr-0.5">m</span>
                    <button
                      type="button"
                      onClick={() => setTimerDuration('longBreak', timerDurations.longBreak + 1)}
                      className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/10 rounded cursor-pointer font-bold text-sm"
                      title="Aumentar 1 minuto"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] text-[var(--text-dimmed,#78716c)] mr-0.5">Atalhos:</span>
                  {[10, 15, 20, 25, 30].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTimerDuration('longBreak', m)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-['Lexend',sans-serif] font-medium cursor-pointer transition-colors ${
                        timerDurations.longBreak === m
                          ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-bold shadow-xs'
                          : 'bg-[var(--bg-surface-hover,#221d19)] text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 1: SOM DE CHUVA ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Som de Chuva
              </h4>
              {selectedAmbientUrl && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-muted,rgba(245,158,11,0.1))] text-[var(--accent-color,#f59e0b)] font-['Lexend',sans-serif] font-medium tracking-wide">
                  {isAmbientPlaying ? 'Tocando' : 'Pausado'}
                </span>
              )}
            </div>

            {/* Rain Toggle Card */}
            <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <p className="text-xs font-medium text-[var(--text-main,#f3f0ea)]">
                  Chuva para Concentração
                </p>
                <p className="text-[11px] text-[var(--text-dimmed,#78716c)]">
                  {selectedAmbientUrl && isAmbientPlaying
                    ? 'Áudio de chuva ambiente ativo'
                    : 'Som de chuva desativado'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {selectedAmbientUrl && (
                  <button
                    type="button"
                    onClick={toggleAmbientPlaying}
                    className="w-7 h-7 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    title={isAmbientPlaying ? 'Pausar Chuva' : 'Tocar Chuva'}
                  >
                    {isAmbientPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (selectedAmbientUrl) {
                      setSelectedAmbientUrl(null);
                    } else {
                      setSelectedAmbientUrl(RAIN_AUDIO_URL);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    selectedAmbientUrl ? 'bg-[var(--accent-color,#f59e0b)]' : 'bg-[var(--border-subtle,#2d2723)]'
                  }`}
                  title={selectedAmbientUrl ? 'Desativar som de chuva' : 'Ativar som de chuva'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedAmbientUrl ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Rain Volume Slider */}
            {selectedAmbientUrl && (
              <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[var(--text-muted,#9e9589)]">Volume da Chuva</span>
                  <span className="font-['Lexend',sans-serif] font-semibold text-[10px] text-[var(--accent-color,#f59e0b)]">
                    {ambientVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  className="w-full accent-[var(--accent-color,#f59e0b)] cursor-pointer"
                />
              </div>
            )}
          </section>

          {/* ================= SECTION 2: 4K BACKGROUND IMAGES ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Plano de Fundo (Wallpapers 4K)
              </h4>
              <span className="text-[10px] text-[var(--accent-color,#f59e0b)] font-['Lexend',sans-serif] font-medium tracking-wide">
                Sem desfoque
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Default Theme Background Option */}
              <button
                type="button"
                onClick={() => setSelectedBackground(null)}
                className={`relative h-18 rounded-lg border flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer overflow-hidden ${
                  selectedBackground === null
                    ? 'border-[var(--accent-color,#f59e0b)] ring-1 ring-[var(--accent-color,#f59e0b)]/40 shadow-sm'
                    : 'border-[var(--border-subtle,#26211e)] hover:border-[var(--text-muted)]'
                } bg-[var(--bg-surface,#181513)]`}
              >
                <span className="text-[11px] font-medium text-[var(--text-muted,#9e9589)]">
                  Padrão do Tema
                </span>
                {selectedBackground === null && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Background Options from public/backgrounds */}
              {AVAILABLE_BACKGROUNDS.map((bg) => {
                const isSelected = selectedBackground === bg.url;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBackground(bg.url)}
                    className={`relative h-18 rounded-lg border transition-all cursor-pointer overflow-hidden group ${
                      isSelected
                        ? 'border-[var(--accent-color,#f59e0b)] ring-1 ring-[var(--accent-color,#f59e0b)]/40 shadow-sm'
                        : 'border-[var(--border-subtle,#26211e)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <img
                      src={bg.url}
                      alt={bg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-white drop-shadow truncate text-left px-1">
                      {bg.title}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================= SECTION 3: LIQUID COLORS PER MODE ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Cores do Líquido
              </h4>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg">
              <button
                type="button"
                onClick={() => setActiveColorTab('pomodoro')}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeColorTab === 'pomodoro'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: liquidColors.pomodoro }}
                />
                Pomodoro
              </button>

              <button
                type="button"
                onClick={() => setActiveColorTab('shortBreak')}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeColorTab === 'shortBreak'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: liquidColors.shortBreak }}
                />
                Curta
              </button>

              <button
                type="button"
                onClick={() => setActiveColorTab('longBreak')}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeColorTab === 'longBreak'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: liquidColors.longBreak }}
                />
                Longa
              </button>
            </div>

            {/* Presets and Custom Picker for active tab */}
            <div className="p-3 bg-[var(--bg-surface,#171412)]/70 border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-dimmed,#78716c)]">
                <span>Paletas Rápidas</span>
                <span className="font-['Lexend',sans-serif] text-[10px] uppercase font-semibold text-[var(--text-muted,#9e9589)]">{liquidColors[activeColorTab]}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = liquidColors[activeColorTab].toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setLiquidColor(activeColorTab, preset.value)}
                      title={preset.label}
                      style={{ backgroundColor: preset.value }}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer flex items-center justify-center border ${
                        isSelected ? 'border-white ring-1 ring-[var(--accent-color)] shadow-sm scale-105' : 'border-black/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}

                {/* Native Custom Color Input */}
                <label
                  title="Cor Personalizada"
                  className="w-6 h-6 rounded-full border border-dashed border-[var(--text-muted,#9e9589)]/60 hover:border-[var(--accent-color)] flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden group"
                >
                  <input
                    type="color"
                    value={liquidColors[activeColorTab]}
                    onChange={(e) => setLiquidColor(activeColorTab, e.target.value)}
                    className="absolute -top-4 -left-4 w-16 h-16 opacity-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-[var(--text-muted,#9e9589)] group-hover:text-[var(--accent-color)]">+</span>
                </label>
              </div>
            </div>
          </section>

          {/* ================= SECTION 4: COMPORTAMENTO ================= */}
          <section className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
              Comportamento
            </h4>

            <div className="space-y-2">
              {/* Toggle Modo Pomodoro Real (Sem Pausas • Se Parar Reseta) */}
              <div className={`p-3 rounded-lg border transition-colors ${
                isRealPomodoroMode 
                  ? 'bg-[var(--accent-muted,rgba(245,158,11,0.1))] border-[var(--accent-color,#f59e0b)]/50 shadow-sm' 
                  : 'bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-main,#f3f0ea)]">
                        Modo Pomodoro Real
                      </span>
                      {isRealPomodoroMode && (
                        <span className="text-[9px] font-['Lexend',sans-serif] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-dimmed,#78716c)] leading-tight">
                      Sem pausas. Se parar ou interromper, o timer reseta para o início.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRealPomodoroMode(!isRealPomodoroMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                      isRealPomodoroMode ? 'bg-[var(--accent-color,#f59e0b)]' : 'bg-[var(--border-subtle,#2d2723)]'
                    }`}
                    title={isRealPomodoroMode ? 'Desativar modo pomodoro real' : 'Ativar modo pomodoro real'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isRealPomodoroMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Toggle Liquid Animation */}
              <div className="flex items-center justify-between p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-[var(--text-main,#f3f0ea)]">
                    Animação do Líquido
                  </span>
                  <p className="text-[11px] text-[var(--text-dimmed,#78716c)]">
                    {isLiquidAnimated ? 'Ondas em movimento' : 'Líquido estático e suave'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLiquidAnimated(!isLiquidAnimated)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isLiquidAnimated ? 'bg-[var(--accent-color,#f59e0b)]' : 'bg-[var(--border-subtle,#2d2723)]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isLiquidAnimated ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle Button Sounds */}
              <div className="flex items-center justify-between p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-[var(--text-main,#f3f0ea)]">
                    Sons dos Botões
                  </span>
                  <p className="text-[11px] text-[var(--text-dimmed,#78716c)]">
                    {buttonSoundsEnabled ? 'Áudio de clique ativado' : 'Sem som ao clicar'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setButtonSoundsEnabled(!buttonSoundsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    buttonSoundsEnabled ? 'bg-[var(--accent-color,#f59e0b)]' : 'bg-[var(--border-subtle,#2d2723)]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      buttonSoundsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: BALL SIZE ADJUSTMENT ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Tamanho do Timer
              </h4>
              <span className="text-[11px] font-['Lexend',sans-serif] font-semibold text-[var(--accent-color,#f59e0b)]">
                {ballSize}px
              </span>
            </div>

            <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2.5">
              <input
                type="range"
                min="320"
                max="640"
                step="10"
                value={ballSize}
                onChange={(e) => setBallSize(Number(e.target.value))}
                className="w-full accent-[var(--accent-color,#f59e0b)] cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Pequeno', size: 380 },
                  { label: 'Médio', size: 500 },
                  { label: 'Grande', size: 600 },
                ].map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setBallSize(item.size)}
                    className={`py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                      ballSize === item.size
                        ? 'border-[var(--accent-color,#f59e0b)] bg-[var(--accent-muted,rgba(245,158,11,0.1))] text-[var(--accent-color,#f59e0b)] font-semibold'
                        : 'border-[var(--border-subtle,#26211e)] text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 6: SONGS & LOFI (NO INNER SCROLLBAR) ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Músicas de Foco (Songs)
              </h4>
              {selectedSongUrl && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-muted,rgba(245,158,11,0.1))] text-[var(--accent-color,#f59e0b)] font-['Lexend',sans-serif] font-medium tracking-wide">
                  {isMusicPlaying ? 'Tocando' : 'Pausada'}
                </span>
              )}
            </div>

            {/* Volume Control */}
            <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted,#9e9589)]">Volume da Música</span>
                <span className="font-['Lexend',sans-serif] font-semibold text-[10px] text-[var(--accent-color,#f59e0b)]">
                  {musicVolume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full accent-[var(--accent-color,#f59e0b)] cursor-pointer"
              />
            </div>

            {/* Active Song Control Bar */}
            {selectedSongUrl && currentSong && (
              <div className="p-3 bg-[var(--accent-muted,rgba(245,158,11,0.08))] border border-[var(--accent-color,#f59e0b)]/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate mr-2">
                  <button
                    type="button"
                    onClick={toggleMusicPlaying}
                    className="w-6 h-6 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  >
                    {isMusicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </button>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[var(--text-main,#f3f0ea)] truncate">
                      {currentSong.title}
                    </p>
                    <p className="text-[10px] text-[var(--accent-color,#f59e0b)]">
                      {currentSong.category}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSongUrl(null);
                    setActiveMusicCategory('none');
                  }}
                  className="text-[10px] font-medium text-[var(--text-dimmed,#78716c)] hover:text-red-400 transition-colors cursor-pointer shrink-0"
                >
                  Desligar
                </button>
              </div>
            )}

            {/* Category Selector Tabs: Sem Música / Lofi / Øneheart */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setSelectedSongUrl(null);
                  setActiveMusicCategory('none');
                }}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  selectedSongUrl === null && activeMusicCategory === 'none'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                Sem Música
              </button>

              <button
                type="button"
                onClick={() => setActiveMusicCategory('Lofi')}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  activeMusicCategory === 'Lofi'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                Lofi
              </button>

              <button
                type="button"
                onClick={() => setActiveMusicCategory('Øneheart')}
                className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  activeMusicCategory === 'Øneheart'
                    ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                    : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                }`}
              >
                Øneheart
              </button>
            </div>

            {/* Song Cards - Flow directly in the drawer without ANY nested scrollbar */}
            {activeMusicCategory === 'none' && (
              <div className="p-3 bg-[var(--bg-surface,#171412)]/50 border border-[var(--border-subtle,#26211e)] rounded-lg text-center text-[11px] text-[var(--text-dimmed,#78716c)]">
                Foco em silêncio ativado. Selecione Lofi ou Øneheart para tocar músicas.
              </div>
            )}

            {activeMusicCategory === 'Lofi' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                {AVAILABLE_SONGS.filter((s) => s.category === 'Lofi').map((song) => {
                  const isSelected = selectedSongUrl === song.url;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => setSelectedSongUrl(song.url)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color,#f59e0b)] bg-[var(--accent-muted,rgba(245,158,11,0.12))] shadow-sm'
                          : 'border-[var(--border-subtle,#26211e)] bg-[var(--bg-surface,#171412)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-surface-hover,#1f1b18)]'
                      }`}
                    >
                      <span className="truncate pr-2 font-medium">{song.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {activeMusicCategory === 'Øneheart' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-in fade-in duration-150">
                {AVAILABLE_SONGS.filter((s) => s.category === 'Øneheart').map((song) => {
                  const isSelected = selectedSongUrl === song.url;
                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => setSelectedSongUrl(song.url)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color,#f59e0b)] bg-[var(--accent-muted,rgba(245,158,11,0.12))] shadow-sm'
                          : 'border-[var(--border-subtle,#26211e)] bg-[var(--bg-surface,#171412)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-surface-hover,#1f1b18)]'
                      }`}
                    >
                      <span className="truncate pr-1 text-[11px] font-medium">{song.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* Drawer Footer with Reset Button */}
        <div className="p-4 border-t border-[var(--border-subtle,#26211e)] bg-[var(--bg-surface,#171412)]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs text-[var(--text-dimmed,#78716c)] hover:text-[var(--text-main,#f3f0ea)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar padrões</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-1.5 rounded-md bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] text-xs font-semibold hover:bg-[var(--accent-hover,#fbbf24)] transition-colors cursor-pointer shadow-sm"
          >
            Concluir
          </button>
        </div>

      </div>
        </>,
        document.body
      )}
    </>
  );
};

export default PomodoroSettingsDrawer;
