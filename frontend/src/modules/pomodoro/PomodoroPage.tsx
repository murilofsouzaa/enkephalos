import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ModeProvider } from './context/ModeContext';
import { usePomodoroSettings } from './context/PomodoroSettingsContext';
import Header from './components/Header/Header';
import Homepage from './components/Homepage/Homepage';
import PomodoroSettingsDrawer from './components/Settings/PomodoroSettingsDrawer';
import SecretTimerPhotoTrigger from './components/Secret/SecretTimerPhotoTrigger';
import { ArrowLeft } from 'lucide-react';

const PomodoroContent: FC = () => {
  const { selectedBackground, backgroundBlur } = usePomodoroSettings();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] flex flex-col justify-start pb-3 px-4 transition-colors duration-300 overflow-x-hidden">
      
      {/* 4K Background Layer - With adjustable blur */}
      {selectedBackground && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src={selectedBackground}
            alt="Wallpaper Pomodoro"
            className="w-full h-full object-cover object-center transform-gpu transition-[filter,transform] duration-300"
            style={{
              filter: backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : 'none',
              transform: backgroundBlur > 0 ? 'scale(1.05)' : 'none',
            }}
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

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 flex flex-col flex-1 justify-start">
        
        {/* Top bar controls */}
        <div className="max-w-4xl mx-auto w-full pt-4 sm:pt-7 pb-1 flex items-center justify-between gap-2 px-1">
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-['Lexend',sans-serif] transition-all px-3 sm:px-3.5 py-1.5 rounded-full shrink-0 ${
              selectedBackground
                ? 'bg-black/45 hover:bg-black/70 text-white hover:text-[var(--accent-color,#f59e0b)] shadow-md backdrop-blur-md'
                : 'bg-[var(--bg-surface,#181513)]/70 hover:bg-[var(--bg-surface)] text-[var(--text-main,#f3f0ea)] hover:text-[var(--accent-color,#f59e0b)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent-color,#f59e0b)] shrink-0" />
            <span className="font-medium tracking-wide hidden sm:inline">Voltar ao Hub Central</span>
            <span className="font-medium tracking-wide sm:hidden">Voltar</span>
          </Link>
        </div>

        {/* Main Pomodoro Block: Mode Selector and Timer comfortably balanced, not too low and not too high */}
        <div className="flex-1 flex flex-col justify-start items-center pt-6 sm:pt-10 gap-3 sm:gap-4 pb-8">
          <Header />
          <Homepage />
        </div>
      </div>

    </div>
  );
};

export const PomodoroPage: FC = () => {
  return (
    <ModeProvider>
      <PomodoroContent />
    </ModeProvider>
  );
};

export default PomodoroPage;
