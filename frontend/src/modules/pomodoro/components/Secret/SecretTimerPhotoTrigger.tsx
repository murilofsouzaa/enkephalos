import { useState, useRef, useEffect, type FC } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { usePomodoroSettings } from '../../hooks/usePomodoroSettings';

export const SecretTimerPhotoTrigger: FC = () => {
  const { isSecretPhotosUnlocked, setIsSecretPhotosUnlocked, setIsSettingsOpen } = usePomodoroSettings();
  const [isRevealed, setIsRevealed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide the secret trigger after 5 seconds of inactivity on touch/mobile
  useEffect(() => {
    if (isRevealed) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsRevealed(false);
      }, 5000);
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isRevealed]);

  const showFeedbackToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    // 1st interaction: If not revealed yet, reveal it
    if (!isRevealed) {
      setIsRevealed(true);
      return;
    }

    // 2nd interaction: If already revealed, unlock secret photo setting in sidebar
    if (!isSecretPhotosUnlocked) {
      setIsSecretPhotosUnlocked(true);
      showFeedbackToast('Cantinho da Nuna desbloqueado! Abrindo opções...');
      setTimeout(() => {
        setIsSettingsOpen(true);
      }, 500);
    } else {
      // If already unlocked, open sidebar directly to photo section
      showFeedbackToast('Opção de fotos da Nuna ativa no menu lateral! ❤️');
      setTimeout(() => {
        setIsSettingsOpen(true);
      }, 300);
    }
  };

  return (
    <>
      {/* Gentle toast notification */}
      {toastMessage && (
        <div className="fixed bottom-16 left-4 z-50 bg-black/85 text-pink-200 border border-pink-500/40 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-['Lexend',sans-serif] animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-xs">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0 animate-pulse" />
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Secret trigger area in bottom-left corner */}
      <div
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={() => setIsRevealed(false)}
        onClick={handleInteraction}
        title={isRevealed ? (isSecretPhotosUnlocked ? "Abrir fotos da Nuna ❤️" : "Clique para desbloquear fotos no timer ✨") : undefined}
        className="fixed bottom-2 left-2 z-40 p-3 select-none cursor-pointer flex items-end justify-start group touch-manipulation"
      >
        <div
          className={`relative transition-all duration-300 ease-out flex items-center justify-center ${
            isRevealed
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-1 pointer-events-auto'
          }`}
        >
          {/* Subtle pulse aura */}
          <div className="absolute inset-0 rounded-full bg-pink-500/25 blur-md animate-ping pointer-events-none" />

          {/* Cute secret button */}
          <div
            className={`relative w-10 h-10 rounded-full bg-black/80 hover:bg-black/95 border ${
              isSecretPhotosUnlocked ? 'border-pink-400 shadow-pink-500/30' : 'border-pink-500/40 hover:border-pink-400'
            } flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95`}
          >
            <Heart
              className={`w-5 h-5 text-pink-400 transition-colors ${
                isSecretPhotosUnlocked ? 'fill-pink-500 animate-pulse' : 'fill-pink-500/60'
              }`}
            />
            <Sparkles
              className="w-2.5 h-2.5 text-amber-300 absolute -top-0.5 -right-0.5 animate-spin"
              style={{ animationDuration: '5s' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SecretTimerPhotoTrigger;
