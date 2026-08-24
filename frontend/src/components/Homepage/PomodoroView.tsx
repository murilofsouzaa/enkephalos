import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import clickSound from '../../../public/floraphonic-analog-appliance-button-3-185278.mp3'

const PomodoroView = () => {
    const TOTAL_SECONDS = 25 * 60;
    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const waterPercentage = isFirstTime ? 100 : (timeLeft / TOTAL_SECONDS) * 100;

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        
        return () => clearInterval(timerId);
    }, [isActive, timeLeft]);
    
    const handleRestart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        setIsFirstTime(true);
        setTimeLeft(TOTAL_SECONDS);
    };

    const handleClick = () =>{
        const audio = new Audio(clickSound);
        audio.currentTime = 0;
        audio.play()
    }

    return ( 
        <main className="flex justify-center items-center">
            <div
                onClick={() => {
                    handleClick();

                    if (isFirstTime) {
                        setIsFirstTime(false);
                    }
                    setIsActive((prev) => !prev);
                }}
                className="relative overflow-hidden timer-subcontainer flex flex-col justify-center items-center bg-(--bg-color) border-10 border-(--timer-stroke) 
                h-150 w-150 rounded-[100%] hover:scale-[0.98] hover:cursor-pointer transition-all mt-20"
            >
                <div 
                    className="absolute left-0 w-full h-full z-0 transition-all duration-1000 ease-linear"
                    style={{ top: `${100 - waterPercentage}%` }}>
                    <div className="absolute top-0 left-[-50%] w-[200%] h-[200%] bg-(--pomodoro-circle-color) opacity-50 rounded-[45%] animate-[spin_10s_linear_infinite]"></div>
                    
                    <div className="absolute top-[2%] left-[-50%] w-[200%] h-[200%] bg-(--pomodoro-circle-color) rounded-[40%] animate-[spin_7s_linear_infinite]"></div>
                </div>

                
            </div>
        </main>
     );
};
 
export default PomodoroView;