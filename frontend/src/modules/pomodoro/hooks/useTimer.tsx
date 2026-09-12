import { useState } from 'react';
import { usePomodoroSettings } from './usePomodoroSettings';

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break';

export function useTimer(mode: TimerMode = 'pomodoro') {
    const { timerDurations } = usePomodoroSettings();

    const durationMinutes =
        mode === 'pomodoro'
            ? timerDurations.pomodoro
            : mode === 'short_break'
            ? timerDurations.shortBreak
            : timerDurations.longBreak;

    const TOTAL_SECONDS = Math.max(1, durationMinutes) * 60;

    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
    const [prevTotalSeconds, setPrevTotalSeconds] = useState<number>(TOTAL_SECONDS);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);

    if (prevTotalSeconds !== TOTAL_SECONDS) {
        setPrevTotalSeconds(TOTAL_SECONDS);
        if (isFirstTime) {
            setTimeLeft(TOTAL_SECONDS);
        }
    }
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const waterPercentage = isFirstTime ? 100 : (timeLeft / TOTAL_SECONDS) * 100;

    return {
        TOTAL_SECONDS,
        timeLeft,
        setTimeLeft,
        isFirstTime,
        setIsFirstTime,
        isActive,
        setIsActive,
        minutes,
        seconds,
        waterPercentage,
    };
}
