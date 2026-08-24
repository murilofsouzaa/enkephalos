import {useState} from 'react'

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break'


export function useTimer(mode:TimerMode = 'pomodoro'){

    const times =  {
        pomodoro: 25 * 60,
        short_break: 5 * 60,
        long_break: 15 * 60
    }

    const TOTAL_SECONDS = times[mode]

    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);
    
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
        waterPercentage
    }
}