import { useState, useEffect, type FC } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Check,
  Heart,
  ChevronDown,
} from 'lucide-react';
import {
  usePomodoroSettings,
  AVAILABLE_BACKGROUNDS,
  AVAILABLE_SONGS,
  COLOR_PRESETS,
  AVAILABLE_TIMER_PHOTOS,
} from '../../context/PomodoroSettingsContext';

export const PomodoroSettingsDrawer: FC = () => {
  const {
    liquidColors,
    setLiquidColor,
    isLiquidAnimated,
    setIsLiquidAnimated,
    buttonSoundsEnabled,
    setButtonSoundsEnabled,
    isRealPomodoroMode,
    setIsRealPomodoroMode,
    selectedBackground,
    setSelectedBackground,
    backgroundBlur,
    setBackgroundBlur,
    ballSize,
    setBallSize,
    selectedSongUrl,
    setSelectedSongUrl,
    musicVolume,
    setMusicVolume,
    isMusicPlaying,
    toggleMusicPlaying,
    selectedTimerPhoto,
    setSelectedTimerPhoto,
    isSecretPhotosUnlocked,
    isSettingsOpen,
    setIsSettingsOpen,
    resetSettings,
  } = usePomodoroSettings();

  const [activeColorTab, setActiveColorTab] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [isAllBackgroundsExpanded, setIsAllBackgroundsExpanded] = useState(false);
  
  // Track active music category tab ('none' | 'Lofi' | 'Øneheart' | 'Celtic' | 'Jazz')
  const [activeMusicCategory, setActiveMusicCategory] = useState<string>(() => {
    if (!selectedSongUrl) return 'none';
    const song = AVAILABLE_SONGS.find((s) => s.url === selectedSongUrl);
    return song?.category || 'Lofi';
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
        className="fixed right-3 sm:right-6 top-20 sm:top-27 z-30 p-2 sm:p-2.5 rounded-full bg-[var(--bg-surface,#181513)]/90 hover:bg-[var(--bg-surface-hover,#221d19)] text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] border border-[var(--border-subtle,#26211e)] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer group"
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
          
          {/* ================= SECTION 1: 4K BACKGROUND IMAGES ================= */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted,#9e9589)]">
                Plano de Fundo (Wallpapers 4K)
              </h4>
              <span className="text-[10px] text-[var(--accent-color,#f59e0b)] font-['Lexend',sans-serif] font-medium tracking-wide">
                {backgroundBlur === 0 ? 'Sem desfoque' : `Desfoque: ${backgroundBlur}px`}
              </span>
            </div>

            {/* Controle de Grau de Desfoque Alternável */}
            <div className="p-3 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--text-muted,#9e9589)]">
                  Nível de Desfoque
                </span>
                <span className="text-[11px] font-['Lexend',sans-serif] font-semibold text-[var(--accent-color,#f59e0b)]">
                  {backgroundBlur === 0 ? 'Nítido (0px)' : `${backgroundBlur}px`}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={backgroundBlur}
                onChange={(e) => setBackgroundBlur(Number(e.target.value))}
                className="w-full accent-[var(--accent-color,#f59e0b)] cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Nenhum', value: 0 },
                  { label: 'Leve', value: 4 },
                  { label: 'Médio', value: 8 },
                  { label: 'Forte', value: 16 },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setBackgroundBlur(item.value)}
                    className={`py-1 text-[10px] font-medium rounded border transition-colors cursor-pointer text-center ${
                      backgroundBlur === item.value
                        ? 'border-[var(--accent-color,#f59e0b)] bg-[var(--accent-muted,rgba(245,158,11,0.1))] text-[var(--accent-color,#f59e0b)] font-semibold'
                        : 'border-[var(--border-subtle,#26211e)] text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
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

              {/* Background Options from public/backgrounds (first 5 or all if expanded) */}
              {(isAllBackgroundsExpanded ? AVAILABLE_BACKGROUNDS : AVAILABLE_BACKGROUNDS.slice(0, 5)).map((bg) => {
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

            {AVAILABLE_BACKGROUNDS.length > 5 && (
              <button
                type="button"
                onClick={() => setIsAllBackgroundsExpanded(!isAllBackgroundsExpanded)}
                className="w-full mt-2 py-2 px-3 rounded-lg border border-[var(--border-subtle,#26211e)] bg-[var(--bg-surface,#181513)] hover:bg-[var(--bg-surface-hover,#201c19)] text-[11px] font-medium text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f5f0e8)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>
                  {isAllBackgroundsExpanded
                    ? 'Ver menos wallpapers'
                    : `Ver todos os wallpapers (${AVAILABLE_BACKGROUNDS.length})`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isAllBackgroundsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </section>

          {/* ================= SECRET SECTION: FOTOS NO TIMER (NUNA) ================= */}
          {isSecretPhotosUnlocked && (
            <section className="space-y-3 p-3.5 rounded-xl border border-rose-500/40 bg-[var(--bg-surface,#181513)] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-main,#141210)] font-['Lexend',sans-serif]">
                    Para meu amorzinho, Nuna
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted,#6c635a)] leading-tight">
                Substitui o líquido do timer por uma foto especial nossa.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Opção Líquido Normal */}
                <button
                  type="button"
                  onClick={() => setSelectedTimerPhoto(null)}
                  className={`relative h-20 rounded-lg border flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer overflow-hidden ${
                    selectedTimerPhoto === null
                      ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-sm bg-[var(--bg-surface-hover,#f0ebe2)]'
                      : 'border-[var(--border-subtle,#26211e)] hover:border-[var(--text-muted)] bg-[var(--bg-surface,#181513)]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[var(--text-main,#141210)]">
                    Líquido Normal
                  </span>
                  <span className="text-[10px] text-[var(--text-dimmed,#78716c)]">
                    (Sem foto)
                  </span>
                  {selectedTimerPhoto === null && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Fotos Especiais sem texto por cima */}
                {AVAILABLE_TIMER_PHOTOS.map((photo) => {
                  const isSelected = selectedTimerPhoto === photo.url;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedTimerPhoto(photo.url)}
                      title={photo.title}
                      className={`relative h-20 rounded-lg border transition-all cursor-pointer overflow-hidden group ${
                        isSelected
                          ? 'border-rose-500 ring-2 ring-rose-500/50 shadow-md scale-[1.02]'
                          : 'border-[var(--border-subtle,#26211e)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt="Foto especial"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

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
                {ballSize <= 420 ? 'Pequeno' : ballSize <= 550 ? 'Médio' : 'Grande'} • {ballSize}px
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
                onInput={(e) => setBallSize(Number((e.target as HTMLInputElement).value))}
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

            {/* Category Selector Tabs: Silêncio / Lofi / Øneheart / Celtic / Jazz */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 bg-[var(--bg-surface,#171412)] border border-[var(--border-subtle,#26211e)] rounded-lg">
              {[
                { id: 'none', label: 'Silêncio' },
                { id: 'Lofi', label: 'Lofi' },
                { id: 'Øneheart', label: 'Øneheart' },
                { id: 'Celtic', label: 'Celtic' },
                { id: 'Jazz', label: 'Jazz' },
              ].map((cat) => {
                const isActive = (cat.id === 'none' && selectedSongUrl === null && activeMusicCategory === 'none') || (activeMusicCategory === cat.id && cat.id !== 'none');
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (cat.id === 'none') {
                        setSelectedSongUrl(null);
                        setActiveMusicCategory('none');
                      } else {
                        setActiveMusicCategory(cat.id);
                      }
                    }}
                    className={`py-1.5 text-center text-[11px] font-medium rounded-md transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                        : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Song Cards */}
            {activeMusicCategory === 'none' && (
              <div className="p-3 bg-[var(--bg-surface,#171412)]/50 border border-[var(--border-subtle,#26211e)] rounded-lg text-center text-[11px] text-[var(--text-dimmed,#78716c)]">
                Foco em silêncio ativado. Selecione um estilo acima para tocar músicas.
              </div>
            )}

            {activeMusicCategory !== 'none' && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                {AVAILABLE_SONGS.filter((s) => s.category === activeMusicCategory).map((song) => {
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
