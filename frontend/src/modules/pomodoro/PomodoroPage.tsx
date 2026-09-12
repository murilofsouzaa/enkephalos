import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ModeProvider } from './context/ModeContext';
import { PomodoroSettingsProvider, usePomodoroSettings } from './context/PomodoroSettingsContext';
import Header from './components/Header/Header';
import Homepage from './components/Homepage/Homepage';
import PomodoroSettingsDrawer from './components/Settings/PomodoroSettingsDrawer';
import SecretTimerPhotoTrigger from './components/Secret/SecretTimerPhotoTrigger';
import { ArrowLeft, BookOpen } from 'lucide-react';

const PomodoroContent: FC = () => {
  const { selectedBackground } = usePomodoroSettings();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] flex flex-col justify-start pb-3 px-4 transition-colors duration-300 overflow-x-hidden">
      
      {/* 4K Crisp Background Layer - Hardware accelerated without any blur */}
      {selectedBackground && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={selectedBackground}
            alt="Wallpaper Pomodoro"
            className="w-full h-full object-cover object-center transform-gpu"
          />
          {/* Automatic darkening overlay for optimal contrast, focus and legibility */}
          <div className="absolute inset-0 bg-black/60 transition-opacity duration-300" />
          {/* Subtle top vignette for crystal clear navigation contrast on bright wallpapers */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Floating Settings Drawer Button & Panel */}
      <PomodoroSettingsDrawer />

      {/* Secret Easter Egg Trigger in Bottom-Left Corner */}
      <SecretTimerPhotoTrigger />

      {/* Content wrapper with higher z-index - elevated to fit completely within viewport */}
      <div className="relative z-10 flex flex-col flex-1 justify-start">
        
        {/* Top bar controls */}
        <div className="max-w-4xl mx-auto w-full pt-2 sm:pt-4 pb-1 flex items-center justify-between gap-2">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-['Lexend',sans-serif] transition-all px-2.5 sm:px-3.5 py-1.5 rounded-full shrink-0 ${
              selectedBackground
                ? 'bg-black/45 hover:bg-black/70 text-white hover:text-[var(--accent-color,#f59e0b)] shadow-md backdrop-blur-md'
                : 'bg-[var(--bg-surface,#181513)]/70 hover:bg-[var(--bg-surface)] text-[var(--text-main,#f3f0ea)] hover:text-[var(--accent-color,#f59e0b)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)] shrink-0" />
            <span className="font-medium tracking-wide hidden sm:inline">Voltar ao Hub Central</span>
            <span className="font-medium tracking-wide sm:hidden">Voltar</span>
          </Link>

          <Link
            to="/estudos"
            className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-['Lexend',sans-serif] transition-all px-2.5 sm:px-3.5 py-1.5 rounded-full mr-10 sm:mr-14 shrink-0 ${
              selectedBackground
                ? 'bg-black/45 hover:bg-black/70 text-white hover:text-[var(--accent-color,#f59e0b)] shadow-md backdrop-blur-md'
                : 'bg-[var(--bg-surface,#181513)]/70 hover:bg-[var(--bg-surface)] text-[var(--text-main,#f3f0ea)] hover:text-[var(--accent-color,#f59e0b)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)] shrink-0" />
            <span className="font-medium tracking-wide hidden sm:inline">Consultar Estudos</span>
            <span className="font-medium tracking-wide sm:hidden">Estudos</span>
          </Link>
        </div>

        {/* Mode selector (Pomodoro / Short-Break / Long-Break) - moved down closer to timer */}
        <div className="pt-3 sm:pt-5">
          <Header />
        </div>

        {/* Circular Timer Main View - Kept in place without being pushed down */}
        <div className="flex-1 flex flex-col justify-center items-center py-1 -mt-2 sm:-mt-3">
          <Homepage />
        </div>
      </div>

    </div>
  );
};

export const PomodoroPage: FC = () => {
  return (
    <PomodoroSettingsProvider>
      <ModeProvider>
        <PomodoroContent />
      </ModeProvider>
    </PomodoroSettingsProvider>
  );
};

export default PomodoroPage;
