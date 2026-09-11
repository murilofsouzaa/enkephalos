import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '../../context/TransitionContext';
import AnimatedTimerSvg from './components/AnimatedTimerSvg';
import AnimatedBookSvg from './components/AnimatedBookSvg';

export const CentralHub: FC = () => {
  const [hoveredButton, setHoveredButton] = useState<'pomodoro' | 'articles' | null>(null);
  const { triggerTransition, isTransitioning } = usePageTransition();

  const handleNavigate = (path: string) => {
    if (isTransitioning) return;
    triggerTransition(path);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] flex flex-col justify-center items-center px-4 select-none transition-colors duration-300">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center -mt-8">
        
        {/* Two Giant Borderless Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-28 my-auto">
          
          {/* Button 1: Pomodoro */}
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <button
              type="button"
              onClick={() => handleNavigate('/pomodoro')}
              onMouseEnter={() => setHoveredButton('pomodoro')}
              onMouseLeave={() => setHoveredButton(null)}
              className="group border-0 border-none bg-transparent p-0 outline-none flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Animated SVG Timer with Clockwise Needle */}
              <AnimatedTimerSvg isHovered={hoveredButton === 'pomodoro'} />

              {/* Text Underneath */}
              <span className="mt-6 font-['Lexend',sans-serif] text-xl sm:text-2xl font-normal text-[var(--text-muted,#9e9589)] group-hover:text-[var(--accent-color,#f59e0b)] tracking-tight transition-colors duration-300">
                Ir para o Pomodoro
              </span>
            </button>
          </motion.div>

          {/* Button 2: Estudos */}
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <button
              type="button"
              onClick={() => handleNavigate('/estudos')}
              onMouseEnter={() => setHoveredButton('articles')}
              onMouseLeave={() => setHoveredButton(null)}
              className="group border-0 border-none bg-transparent p-0 outline-none flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Animated SVG Book that Unfolds Open on Hover */}
              <AnimatedBookSvg isHovered={hoveredButton === 'articles'} />

              {/* Text Underneath */}
              <span className="mt-6 font-['Lexend',sans-serif] text-xl sm:text-2xl font-normal text-[var(--text-muted,#9e9589)] group-hover:text-[var(--accent-color,#f59e0b)] tracking-tight transition-colors duration-300">
                Ir para estudos
              </span>
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default CentralHub;
