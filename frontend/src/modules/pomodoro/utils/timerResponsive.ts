import type React from 'react';

export interface TimerDimensions {
  ballStyle: React.CSSProperties;
  timerFontSizeStyle: React.CSSProperties;
  labelFontSizeStyle: React.CSSProperties;
  iconSizeStyle: React.CSSProperties;
}

/**
 * Calculates responsive sizing for the Pomodoro timer.
 * 
 * - On desktop (>= 640px): uses direct pixel values from ballSize (320px to 640px).
 * - On mobile (< 640px): proportionally scales the ball between 52vw (compact) and 88vw (wide),
 *   allowing "Pequeno", "Médio", "Grande" and slider adjustments to visibly change the timer
 *   size without overflowing small phone viewports.
 */
export function getTimerDimensions(ballSize: number): TimerDimensions {
  const size = Math.max(320, Math.min(640, ballSize || 480));
  // Normalized ratio: 0 (at 320px) to 1 (at 640px)
  const ratio = (size - 320) / (640 - 320);

  // Mobile diameter in vw: scales smoothly from 52vw to 88vw
  // Pequeno (380px) -> ~58.8vw
  // Médio (500px)   -> ~72.3vw
  // Grande (600px)  -> ~83.5vw
  const mobileBallVw = +(52 + ratio * 36).toFixed(2);

  const desktopBallPx = size;
  const desktopTimerPx = Math.max(48, Math.round(size * 0.22));
  const desktopLabelPx = Math.max(12, Math.round(size * 0.045));
  const desktopIconPx = Math.max(20, Math.round(size * 0.065));

  // Mobile typography and icons scale in exact proportion to the ball
  const mobileTimerVw = +(mobileBallVw * 0.22).toFixed(2);
  const mobileLabelVw = +(mobileBallVw * 0.045).toFixed(2);
  const mobileIconVw = +(mobileBallVw * 0.065).toFixed(2);

  return {
    ballStyle: {
      '--ball-size-mobile': `min(${mobileBallVw}vw, calc(100vh - 14.5rem))`,
      '--ball-size-desktop': `min(calc(100vw - 4rem), calc(100vh - 14.5rem), ${desktopBallPx}px)`,
    } as React.CSSProperties,

    timerFontSizeStyle: {
      '--timer-font-mobile': `min(${mobileTimerVw}vw, 14vh)`,
      '--timer-font-desktop': `min(15vh, ${desktopTimerPx}px)`,
    } as React.CSSProperties,

    labelFontSizeStyle: {
      '--label-font-mobile': `min(${mobileLabelVw}vw, 3.2vh)`,
      '--label-font-desktop': `${desktopLabelPx}px`,
    } as React.CSSProperties,

    iconSizeStyle: {
      '--icon-size-mobile': `${mobileIconVw}vw`,
      '--icon-size-desktop': `${desktopIconPx}px`,
    } as React.CSSProperties,
  };
}
