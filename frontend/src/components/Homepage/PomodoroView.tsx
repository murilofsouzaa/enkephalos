import { useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import Button from '../../ui/Button';
import timerStart from '/timer-start.mp3'
import pausedSound from '/timer-paused.mp3'
import timerEnded from '/timer-ended.mp3'



const PomodoroView = () => {
    const {
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
    } = useTimer('pomodoro');

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        
        if (isActive && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev: number) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        if(timeLeft == 0){
            const audio = new Audio(timerEnded);
            audio.play();
        }
        
        return () => clearInterval(timerId);
    }, [isActive, timeLeft, setTimeLeft, setIsActive]);


    const handleStartClick = () => {
        const audio = new Audio(timerStart);
        audio.currentTime = 0;
        audio.play();
    };

    const handlePauseButtonAudio = () =>{
        const audio = new Audio(pausedSound);
        audio.play();
    }

    return ( 
        <main className="flex justify-center items-center">
            <div
                onClick={() => {
                    if (isFirstTime) {
                        handleStartClick();
                        setIsFirstTime(false);
                    }else{
                        handlePauseButtonAudio();
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

                <Button 
                    isFirstTime={isFirstTime}
                    setIsFirstTime={setIsFirstTime}
                    minutes={minutes}
                    seconds={seconds}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    setTimeLeft={setTimeLeft}
                    TOTAL_SECONDS={TOTAL_SECONDS}
                />
            </div>
        </main>
     );
};
 
export default PomodoroView;