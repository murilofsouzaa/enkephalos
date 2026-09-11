import { type FC } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBookSvgProps {
  isHovered: boolean;
}

export const AnimatedBookSvg: FC<AnimatedBookSvgProps> = ({ isHovered }) => {
  return (
    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none">
      {/* Very subtle ambient glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.12 : 0,
          scale: isHovered ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.35 }}
        className="absolute inset-4 rounded-full bg-[var(--accent-color)] blur-xl pointer-events-none"
      />

      {/* 3D Perspective Stage */}
      <div
        className="relative w-44 h-32 flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {/*
          Centered Assembly:
          When closed (isHovered = false): assembly shifts x = -38px so the closed 76px book is from -38px to +38px (DEAD CENTER).
          When open (isHovered = true): assembly shifts x = 0px so the open 152px book is from -76px to +76px (DEAD CENTER).
        */}
        <motion.div
          className="relative w-0 h-28 flex items-center justify-center"
          animate={{
            x: isHovered ? 0 : -38,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 1, 0.4, 1],
          }}
        >
          {/* Central Book Spine */}
          <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-28 bg-[#241e1a] rounded-sm border border-[#3d332b] z-0" />

          {/* Stationary Right Page (Extends from x=0 to x=+76px) */}
          <div
            className="absolute left-0 top-0 w-[76px] h-28 bg-[#181412] border border-[#3d332b] rounded-r-md shadow-md p-2 flex flex-col justify-between overflow-hidden z-1"
          >
            {/* Page Text Lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-1 bg-[var(--accent-color)]/40 rounded w-11/12" />
              <div className="h-1 bg-[#686158]/40 rounded w-full" />
              <div className="h-1 bg-[#686158]/40 rounded w-4/5" />
              <div className="h-1 bg-[#686158]/40 rounded w-full" />
              <div className="h-1 bg-[#686158]/40 rounded w-3/4" />
            </div>
            <div className="text-[8px] font-mono text-[#78716c] text-right">pag. 1</div>
          </div>

          {/*
            Flipping Front Cover / Left Page Leaf:
            Hinged at x=0 (the spine).
            When closed: rotateY = 0deg, lays flat over the right page (x=0 to x=+76px).
            When open: rotateY = -180deg, swings open to the left (x=-76px to x=0).
          */}
          <motion.div
            animate={{
              rotateY: isHovered ? -180 : 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 1, 0.4, 1],
            }}
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute left-0 top-0 w-[76px] h-28 cursor-pointer z-10"
          >
            {/* FRONT FACE: Book Cover (Visible when closed, rotateY=0) */}
            <div
              className="absolute inset-0 bg-[#1c1815] border-2 border-[#54483e] rounded-r-md shadow-xl flex flex-col items-center justify-between p-2"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Corner gold studs */}
              <div className="w-full flex justify-between px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]/60" />
              </div>

              {/* Cover emblem motif */}
              <div className="flex flex-col items-center justify-center space-y-1 my-auto">
                <div className="w-7 h-7 rounded-full border border-[var(--accent-color)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm border border-[var(--accent-hover)] rotate-45" />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-[var(--accent-color)] uppercase font-semibold">
                  ESTUDOS
                </span>
              </div>

              {/* Bookmark ribbon tip peaking out */}
              <div className="w-2.5 h-3 bg-[var(--accent-color)] rounded-b-sm shadow-sm" />
            </div>

            {/* BACK FACE: Left Page Inside (Revealed when open, rotateY=180) */}
            <div
              className="absolute inset-0 bg-[#181412] border border-[#3d332b] rounded-l-md shadow-md p-2 flex flex-col justify-between overflow-hidden"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="space-y-1.5 pt-1">
                <div className="h-1 bg-[var(--accent-color)]/40 rounded w-10/12" />
                <div className="h-1 bg-[#686158]/40 rounded w-full" />
                <div className="h-1 bg-[#686158]/40 rounded w-4/5" />
                <div className="h-1 bg-[#686158]/40 rounded w-full" />
                <div className="h-1 bg-[#686158]/40 rounded w-2/3" />
              </div>
              <div className="text-[8px] font-mono text-[#78716c]">pag. 0</div>
            </div>
          </motion.div>

          {/* Center Spine Bookmark Ribbon */}
          <motion.div
            animate={{
              height: isHovered ? 34 : 14,
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-0 -translate-x-1/2 w-1.5 bg-[var(--accent-color)] rounded-b z-20 pointer-events-none shadow-sm"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedBookSvg;
