import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePomodoroSettings } from '../context/PomodoroSettingsContext';

const restartSound = '/time-restart.mp3';
const pausedSound = '/timer-paused.mp3';

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
    const { buttonSoundsEnabled, ballSize } = usePomodoroSettings();
    
    const initialMinutes = Math.floor(TOTAL_SECONDS / 60);
    const initialSeconds = TOTAL_SECONDS % 60;

    const handleRestartButtonAudio = () => {
        if (!buttonSoundsEnabled) return;
        try {
            const audio = new Audio(restartSound);
            audio.currentTime = 0;
            audio.volume = 0.7;
            audio.play().catch(() => {});
        } catch {
            // ignore
        }
    };

    const handlePauseButtonAudio = () => {
        if (!buttonSoundsEnabled) return;
        try {
            const audio = new Audio(pausedSound);
            audio.currentTime = 0;
            audio.volume = 0.7;
            audio.play().catch(() => {});
        } catch {
            // ignore
        }
    };

    const handleRestart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        setIsFirstTime(true);
        setTimeLeft(TOTAL_SECONDS);
    };

    // Responsive font sizing based on ballSize and viewport constraints
    const maxTimerSize = Math.max(48, Math.round((ballSize || 520) * 0.22));
    const maxLabelSize = Math.max(12, Math.round((ballSize || 520) * 0.045));
    const maxIconSize = Math.max(20, Math.round((ballSize || 520) * 0.065));

    return ( 
        <div className="z-10 flex flex-col justify-center items-center select-none pointer-events-auto max-w-[85%] text-center">
            <div 
                className="text-white font-bold leading-none tracking-tight"
                style={{ fontSize: `clamp(2.25rem, min(18vw, 15vh), ${maxTimerSize}px)` }}
            >
                {isFirstTime ? (
                    <span className="font-['Lexend',sans-serif] drop-shadow-md">
                        {initialMinutes.toString().padStart(2, '0')}:{initialSeconds.toString().padStart(2, '0')}
                    </span>
                ) : (
                    <span className="font-['Lexend',sans-serif] drop-shadow-md">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-3 sm:gap-5 mt-2 sm:mt-4">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePauseButtonAudio();
                        setIsActive(!isActive);
                    }}
                    className={`${isFirstTime && "hidden"} font-semibold text-white cursor-pointer drop-shadow-md hover:scale-110 transition-transform`}
                    title={isActive ? "Pausar" : "Continuar"}
                >
                    {!isActive ? (
                        <Play className="w-5 h-5 sm:w-7 sm:h-7" style={{ maxWidth: `${maxIconSize}px`, maxHeight: `${maxIconSize}px` }} />
                    ) : (
                        <Pause className="w-5 h-5 sm:w-7 sm:h-7" style={{ maxWidth: `${maxIconSize}px`, maxHeight: `${maxIconSize}px` }} />
                    )}
                </button>
                
                <button
                    type="button"
                    style={{ fontSize: `clamp(0.65rem, min(3.8vw, 3.2vh), ${maxLabelSize}px)` }}
                    className={`${!isFirstTime && "hidden"} font-['Raleway',sans-serif] font-bold tracking-widest text-white/90 cursor-pointer drop-shadow-md hover:text-white transition-colors`}
                >
                    {!isActive && "CLICK TO START"}
                </button>

                <button
                    type="button"
                    className={`${isFirstTime && "hidden"} z-20 font-semibold text-white cursor-pointer drop-shadow-md hover:scale-110 transition-transform`}
                    title="Reiniciar timer"
                    onClick={(e) => {
                        handleRestartButtonAudio();
                        handleRestart(e);
                    }}
                >
                    <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" style={{ maxWidth: `${maxIconSize}px`, maxHeight: `${maxIconSize}px` }} />
                </button>
            </div>
        </div>
     );
};
 
export default Button;
