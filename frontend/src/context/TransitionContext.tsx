import { createContext, useContext, useState, useRef, type ReactNode, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransitionContextType {
  triggerTransition: (targetPath: string) => void;
  isTransitioning: boolean;
  isPegasusFlying?: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isNavigatingRef = useRef(false);
  const navigate = useNavigate();

  const triggerTransition = (targetPath: string) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    // Start single GPU-accelerated wipe across the screen
    setIsTransitioning(true);

    // At midpoint (360ms), screen is 100% covered. Switch route simultaneously.
    setTimeout(() => {
      navigate(targetPath);
      window.scrollTo(0, 0);
    }, 360);

    // At 730ms, the wipe is completely off-screen to the right. Reset state.
    setTimeout(() => {
      setIsTransitioning(false);
      isNavigatingRef.current = false;
    }, 730);
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition, isTransitioning, isPegasusFlying: false }}>
      {children}

      {isTransitioning && (
        <div className="fixed inset-0 z-[99999] pointer-events-auto overflow-hidden">
          {/* Single GPU-accelerated Curtain sweeping across viewport without duplication */}
          <div className="animate-screen-wipe absolute inset-0 bg-[var(--bg-color,#121110)]">
            {/* Leading Edge Stripe (sweeps across during first half to cover screen) */}
            <div 
              className="absolute top-0 right-0 bottom-0 w-[2.5px] bg-[var(--accent-color)] shadow-[0_0_20px_var(--accent-glow)]"
            >
              {/* Soft glow on the inside of the curtain */}
              <div 
                className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none"
                style={{ background: 'linear-gradient(to left, var(--accent-muted), transparent)' }}
              />
            </div>

            {/* Trailing Edge Stripe (sweeps across during second half to reveal new page) */}
            <div 
              className="absolute top-0 left-0 bottom-0 w-[2.5px] bg-[var(--accent-color)] shadow-[0_0_20px_var(--accent-glow)]"
            >
              {/* Soft glow on the inside of the curtain */}
              <div 
                className="absolute top-0 left-0 bottom-0 w-32 pointer-events-none"
                style={{ background: 'linear-gradient(to right, var(--accent-muted), transparent)' }}
              />
            </div>
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
};

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition deve ser usado dentro de um TransitionProvider');
  }
  return context;
}
