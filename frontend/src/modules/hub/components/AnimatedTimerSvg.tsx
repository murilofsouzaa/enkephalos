import { useState, useEffect, type FC } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTimerSvgProps {
  isHovered: boolean;
}

export const AnimatedTimerSvg: FC<AnimatedTimerSvgProps> = ({ isHovered }) => {
  // Track continuous seconds initialized from current real-world time
  const [totalSeconds, setTotalSeconds] = useState(() => {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        const d = new Date();
        const currentSeconds = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
        // If tab was idle / sleeping and jumped more than 4s, re-align smoothly
        if (Math.abs(currentSeconds - (prev % 86400)) > 4) {
          return currentSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Real clock hand angular positions (degrees)
  // Second hand: steps 6 degrees per second (360 / 60)
  const secDeg = totalSeconds * 6;
  // Minute hand: advances gradually (6 degrees per minute)
  const minDeg = (totalSeconds / 60) * 6;
  // Hour hand: advances gradually (30 degrees per hour)
  const hrDeg = (totalSeconds / 3600) * 30;

  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 flex items-center justify-center select-none">
      {/* Very subtle ambient glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.12 : 0,
          scale: isHovered ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.35 }}
        className="absolute inset-4 rounded-full bg-[var(--accent-color)] blur-xl pointer-events-none"
      />

      <svg
        viewBox="0 0 160 160"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Stopwatch Push Button */}
        <path
          d="M74 12 H86 V22 H74 Z"
          className="transition-colors duration-300"
          fill={isHovered ? 'var(--accent-color)' : '#686158'}
        />
        <path
          d="M70 8 H90 V12 H70 Z"
          className="transition-colors duration-300"
          fill={isHovered ? 'var(--accent-hover)' : '#8a8174'}
        />
        {/* Angled Lap button right */}
        <path
          d="M116 26 L124 34 L120 38 L112 30 Z"
          className="transition-colors duration-300"
          fill={isHovered ? 'var(--accent-color)' : '#686158'}
        />

        {/* Outer Bezel (radius 60 around 80, 88) */}
        <circle
          cx="80"
          cy="88"
          r="60"
          stroke={isHovered ? 'var(--accent-color)' : '#3d342e'}
          strokeWidth="3.5"
          className="transition-colors duration-300"
          fill="#161311"
        />

        {/* Subtle Inner Track */}
        <circle
          cx="80"
          cy="88"
          r="52"
          stroke={isHovered ? 'var(--accent-muted)' : 'rgba(255, 255, 255, 0.04)'}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="transition-colors duration-300"
        />

        {/* 12 Hour Dial Ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const isCardinal = deg % 90 === 0;
          return (
            <line
              key={deg}
              x1="80"
              y1={isCardinal ? '38' : '42'}
              x2="80"
              y2="46"
              transform={`rotate(${deg} 80 88)`}
              stroke={isHovered ? (isCardinal ? 'var(--accent-hover)' : 'var(--accent-deep)') : isCardinal ? '#78716c' : '#3d342e'}
              strokeWidth={isCardinal ? '2.5' : '1.5'}
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          );
        })}

        {/* 1. Hour Hand (Ponteiro das Horas) */}
        <g
          style={{
            transform: `rotate(${hrDeg}deg)`,
            transformBox: 'view-box',
            transformOrigin: '80px 88px',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Main hour hand bar: from center (80, 88) up to (80, 64) */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="64"
            stroke={isHovered ? 'var(--accent-hover)' : '#e5e5e5'}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
          {/* Hour hand counterbalance */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="94"
            stroke={isHovered ? 'var(--accent-deep)' : '#737373'}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
        </g>

        {/* 2. Minute Hand (Ponteiro dos Minutos) */}
        <g
          style={{
            transform: `rotate(${minDeg}deg)`,
            transformBox: 'view-box',
            transformOrigin: '80px 88px',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Main minute hand bar: from center (80, 88) up to (80, 52) */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="52"
            stroke={isHovered ? 'var(--accent-color)' : '#d4d4d4'}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
          {/* Minute hand counterbalance */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="96"
            stroke={isHovered ? 'var(--accent-deep)' : '#525252'}
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
        </g>

        {/* 3. Second Hand (Ponteiro dos Segundos - Tic-tac mecânico real a cada segundo) */}
        <g
          style={{
            transform: `rotate(${secDeg}deg)`,
            transformBox: 'view-box',
            transformOrigin: '80px 88px',
            transition: 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Slender needle: from center (80, 88) up to (80, 44) */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="44"
            stroke="var(--accent-color)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Accent dot near tip */}
          <circle
            cx="80"
            cy="47"
            r="1.8"
            fill="var(--accent-hover)"
          />
          {/* Counterbalance tail: from center (80, 88) down to (80, 100) */}
          <line
            x1="80"
            y1="88"
            x2="80"
            y2="100"
            stroke="var(--accent-deep)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Counterbalance ring */}
          <circle
            cx="80"
            cy="96"
            r="2"
            fill="var(--accent-deep)"
          />
        </g>

        {/* Center Hub pivot pin */}
        <circle
          cx="80"
          cy="88"
          r="4.5"
          fill={isHovered ? 'var(--accent-hover)' : 'var(--accent-color)'}
          className="transition-colors duration-300"
        />
        <circle
          cx="80"
          cy="88"
          r="1.8"
          fill="#161311"
        />
      </svg>
    </div>
  );
};

export default AnimatedTimerSvg;
