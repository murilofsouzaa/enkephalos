import { type FC } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCurveSvgProps {
  isHovered: boolean;
}

export const AnimatedCurveSvg: FC<AnimatedCurveSvgProps> = ({ isHovered }) => {
  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none">
      {/* Ambient Glow on Hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.15 : 0,
          scale: isHovered ? 1.08 : 0.95,
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
        {/* Background Circle */}
        <circle
          cx="80"
          cy="80"
          r="62"
          stroke={isHovered ? 'var(--accent-color)' : '#3d342e'}
          strokeWidth="3"
          className="transition-colors duration-300"
          fill="#161311"
        />

        {/* Inner Subtle Grid Lines */}
        <line
          x1="32"
          y1="80"
          x2="128"
          y2="80"
          stroke={isHovered ? 'var(--accent-muted)' : 'rgba(255, 255, 255, 0.05)'}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="transition-colors duration-300"
        />
        <line
          x1="32"
          y1="108"
          x2="128"
          y2="108"
          stroke={isHovered ? 'var(--accent-muted)' : 'rgba(255, 255, 255, 0.05)'}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="transition-colors duration-300"
        />
        <line
          x1="80"
          y1="32"
          x2="80"
          y2="128"
          stroke={isHovered ? 'var(--accent-muted)' : 'rgba(255, 255, 255, 0.05)'}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="transition-colors duration-300"
        />

        {/* 80% Threshold Dashed Line */}
        <line
          x1="34"
          y1="85"
          x2="126"
          y2="85"
          stroke={isHovered ? '#eab308' : '#78716c'}
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity={isHovered ? 0.8 : 0.4}
          className="transition-all duration-300"
        />

        {/* Ghost Decay Curve 1 */}
        <path
          d="M 68 85 Q 92 118 118 124"
          stroke="#9ca3af"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          opacity={isHovered ? 0.6 : 0.25}
          className="transition-all duration-300"
        />

        {/* Curve 1: Initial Decay from (36, 50) to (68, 85) */}
        <motion.path
          d="M 36 50 Q 52 78 68 85"
          stroke={isHovered ? 'var(--accent-color)' : '#d4d4d4'}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="transition-colors duration-300"
        />

        {/* Review Reinforcement Jump 1: Vertical line from (68, 85) back to (68, 50) */}
        <line
          x1="68"
          y1="85"
          x2="68"
          y2="50"
          stroke={isHovered ? 'var(--accent-color)' : '#a3a3a3'}
          strokeWidth="2"
          strokeDasharray="3 2"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />

        {/* Curve 2: Second Segment Decaying slower from (68, 50) to (104, 80) */}
        <motion.path
          d="M 68 50 Q 86 70 104 80"
          stroke={isHovered ? 'var(--accent-hover)' : '#e5e5e5'}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="transition-colors duration-300"
        />

        {/* Review Reinforcement Jump 2: Vertical line from (104, 80) back to (104, 50) */}
        <line
          x1="104"
          y1="80"
          x2="104"
          y2="50"
          stroke={isHovered ? 'var(--accent-color)' : '#a3a3a3'}
          strokeWidth="2"
          strokeDasharray="3 2"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />

        {/* Curve 3: Third Segment Decaying even slower from (104, 50) to (126, 68) */}
        <motion.path
          d="M 104 50 Q 116 60 126 68"
          stroke={isHovered ? 'var(--accent-hover)' : '#e5e5e5'}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="transition-colors duration-300"
        />

        {/* Top Annotation Indicators / Small Glowing Nodes */}
        <circle
          cx="36"
          cy="50"
          r="3"
          fill={isHovered ? '#ea580c' : 'var(--accent-color)'}
          className="transition-colors duration-300"
        />
        <circle
          cx="68"
          cy="50"
          r="3"
          fill={isHovered ? '#ea580c' : 'var(--accent-hover)'}
          className="transition-colors duration-300"
        />
        <circle
          cx="104"
          cy="50"
          r="3"
          fill={isHovered ? '#ea580c' : 'var(--accent-hover)'}
          className="transition-colors duration-300"
        />

        {/* Little downward arrow at top in orange */}
        <motion.path
          d="M 68 36 L 68 44 M 65 41 L 68 44 L 71 41"
          stroke="#ea580c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            y: isHovered ? [0, 2, 0] : 0,
          }}
          transition={{
            repeat: isHovered ? Infinity : 0,
            duration: 1.2,
          }}
        />
      </svg>
    </div>
  );
};

export default AnimatedCurveSvg;
