import {useState} from 'react'

export function useTimer(){
    const TOTAL_SECONDS = 30 * 60;
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