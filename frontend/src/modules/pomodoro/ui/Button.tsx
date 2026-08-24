import { Play, Pause, RotateCcw } from 'lucide-react';

const restartSound = new URL('/time-restart.mp3', import.meta.url).href;
const pausedSound = new URL('/timer-paused.mp3', import.meta.url).href;

interface ButtonProps {
    isFirstTime: boolean;
    minutes: number;
    seconds: number;
    isActive: boolean;
    TOTAL_SECONDS: number;
    setIsActive: (isActive: boolean) => void;
    setTimeLeft: (timeLeft: number) => void;
    setIsFirstTime: (isFirstTime: boolean) => void;
}

const Button = ({ isFirstTime, minutes, seconds, setIsActive, setIsFirstTime, setTimeLeft , isActive, TOTAL_SECONDS}: ButtonProps) => {
    
    const initialMinutes = Math.floor(TOTAL_SECONDS / 60);
    const initialSeconds = TOTAL_SECONDS % 60;

    const handleRestartButtonAudio = () =>{
        const audio = new Audio(restartSound);
        audio.play();
    }
    const handlePauseButtonAudio = () =>{
        const audio = new Audio(pausedSound);
        audio.play();
    }

    const handleRestart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        setIsFirstTime(true);
        setTimeLeft(TOTAL_SECONDS);
    };

    return ( 
        <div className="z-10 flex flex-col justify-center items-center">
            <div className="text-white text-9xl font-bold">
                {isFirstTime ? (
                    <span className="font-lexend drop-shadow-md">
                        {initialMinutes.toString().padStart(2, '0')}:{initialSeconds.toString().padStart(2, '0')}
                    </span>
                ) : (
                    <span className="font-lexend drop-shadow-md">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                )}
            </div>
            <div className="flex gap-5 mt-2">
                <button
                    type="button"
                    onClick={handlePauseButtonAudio}
                    className={`${isFirstTime && "hidden"} font-semibold text-white cursor-pointer drop-shadow-md`}
                    >
                    {!isActive ? <Play className="w-auto h-8"/> : <Pause className="w-auto h-8"/>}
                </button>
                <button
                    type="button"
                    className={`${!isFirstTime && "hidden"} font-semibold text-2xl text-white cursor-pointer drop-shadow-md`}
                    >
                    {!isActive && "CLICK TO START"}
                </button>
                <button
                    type="button"
                    className={`${isFirstTime && "hidden"} z-20 font-semibold text-2xl text-white cursor-pointer drop-shadow-md`}
                    onClick={(e) => {
                        handleRestartButtonAudio();
                        handleRestart(e);
                    }}
                >
                    <RotateCcw className="w-auto h-8"/>
                </button>
            </div>
        </div>
     );
};
 
export default Button;