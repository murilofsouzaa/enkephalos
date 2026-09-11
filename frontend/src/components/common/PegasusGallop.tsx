import type { FC } from 'react';
import { motion } from 'framer-motion';

interface PegasusGallopProps {
  className?: string;
  showTrail?: boolean;
  showDust?: boolean;
}

export const PegasusGallop: FC<PegasusGallopProps> = ({
  className = 'w-full h-full',
  showTrail = true,
  showDust = true,
}) => {
  // Stride cycle keyframes (trot / canter / gallop motion)
  // 1 full cycle represents: Impact -> Propulsion -> Aerial Suspension -> Gathering
  const gallopKeyframes = {
    y: [0, -14, 6, -18, 3, 0],
    x: [0, 8, -4, 11, -2, 0],
    rotate: [-4, 7, -3, 8, -1, -4],
    scaleX: [1, 1.07, 0.94, 1.08, 0.96, 1],
    scaleY: [1, 0.93, 1.06, 0.92, 1.04, 1],
    skewX: [-3, 4, -2, 5, -1, -3],
  };

  // Wing lift cycle synchronized with stride propulsion
  const wingKeyframes = {
    scaleY: [1, 1.16, 0.88, 1.18, 0.92, 1],
  };

  // Wind speed streaks simulating aerodynamic rushing air
  const windStreaks = [
    { top: '25%', left: '10%', delay: 0, duration: 0.38, width: 60 },
    { top: '42%', left: '5%', delay: 0.12, duration: 0.44, width: 85 },
    { top: '60%', left: '12%', delay: 0.22, duration: 0.35, width: 50 },
    { top: '75%', left: '8%', delay: 0.08, duration: 0.4, width: 70 },
  ];

  // Golden stardust / hoof embers streaming back from the hooves
  const embers = [
    { id: 1, top: '78%', left: '35%', delay: 0, scale: 1.2 },
    { id: 2, top: '82%', left: '28%', delay: 0.15, scale: 0.9 },
    { id: 3, top: '68%', left: '20%', delay: 0.28, scale: 1.1 },
    { id: 4, top: '85%', left: '42%', delay: 0.08, scale: 0.8 },
    { id: 5, top: '74%', left: '15%', delay: 0.2, scale: 1.0 },
  ];

  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Wind Streaks Slicing Through Air */}
      {showDust && (
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          {windStreaks.map((streak, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [-10, -120],
                opacity: [0, 0.75, 0],
                scaleX: [0.3, 1.4, 0.1],
              }}
              transition={{
                duration: streak.duration,
                repeat: Infinity,
                delay: streak.delay,
                ease: 'easeOut',
              }}
              style={{
                top: streak.top,
                left: streak.left,
                width: streak.width,
                background: 'linear-gradient(to left, var(--accent-color), var(--accent-hover), transparent)',
              }}
              className="absolute h-[1.5px] rounded-full filter blur-[0.5px]"
            />
          ))}

          {/* Golden Stardust / Hoof Embers */}
          {embers.map((ember) => (
            <motion.div
              key={ember.id}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [-5, -80 - Math.random() * 40],
                y: [0, 15 - Math.random() * 30],
                opacity: [0, 0.9, 0],
                scale: [ember.scale, ember.scale * 1.3, 0],
              }}
              transition={{
                duration: 0.45,
                repeat: Infinity,
                delay: ember.delay,
                ease: 'easeOut',
              }}
              style={{
                top: ember.top,
                left: ember.left,
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent-hover)] shadow-[0_0_8px_var(--accent-color)]"
            />
          ))}
        </div>
      )}

      {/* Ghost Afterimage 2 (Further back) */}
      {showTrail && (
        <motion.div
          animate={gallopKeyframes}
          transition={{
            duration: 0.42,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: -0.12,
          }}
          style={{ transformOrigin: '45% 42%' }}
          className="absolute inset-0 -translate-x-8 translate-y-1.5 opacity-20 filter blur-[3px] pointer-events-none"
        >
          <img
            src="/thin-pegasus.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}

      {/* Ghost Afterimage 1 (Closer back) */}
      {showTrail && (
        <motion.div
          animate={gallopKeyframes}
          transition={{
            duration: 0.42,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: -0.06,
          }}
          style={{ transformOrigin: '45% 42%' }}
          className="absolute inset-0 -translate-x-4 translate-y-0.5 opacity-35 filter blur-[1.5px] pointer-events-none"
        >
          <img
            src="/thin-pegasus.svg"
            alt=""
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}

      {/* Primary Galloping & Flying Pegasus Container */}
      <motion.div
        animate={gallopKeyframes}
        transition={{
          duration: 0.42,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: '45% 42%' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Wing Flapping Lift Layer */}
        <motion.div
          animate={wingKeyframes}
          transition={{
            duration: 0.42,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '45% 42%' }}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src="/thin-pegasus.svg"
            alt="Enkephalos Pegasus Gallop"
            className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(245,158,11,0.65)] drop-shadow-[0_0_35px_rgba(245,158,11,0.35)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
