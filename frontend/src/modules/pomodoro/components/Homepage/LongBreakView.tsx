import { useEffect } from 'react';
import Button from '../../ui/Button';
import { useTimer } from '../../hooks/useTimer';
import { usePomodoroSettings } from '../../context/PomodoroSettingsContext';
import { getTimerDimensions } from '../../utils/timerResponsive';

const timerStart = '/timer-start.mp3';
const pausedSound = '/timer-paused.mp3';
const timerEnded = '/timer-ended.mp3';

const LongBreakView = () => {
    const {
        TOTAL_SECONDS,
        isActive,
        setIsActive,
        isFirstTime,
        setIsFirstTime,
        timeLeft,
        setTimeLeft,
        minutes,
        seconds,
        waterPercentage,
    } = useTimer('long_break');

    const {
        liquidColors,
        isLiquidAnimated,
        buttonSoundsEnabled,
        ballSize,
        selectedTimerPhoto,
    } = usePomodoroSettings();

    const timerDimensions = getTimerDimensions(ballSize);

    useEffect(() => {
        let timerId: ReturnType<typeof setInterval>;
        
        if (isActive && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prev: number) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        if (timeLeft === 0) {
            try {
                const audio = new Audio(timerEnded);
                audio.volume = 0.8;
                audio.play().catch(() => {});
            } catch {
                // ignore
            }
        }
        
        return () => clearInterval(timerId as unknown as number);
    }, [isActive, timeLeft, setTimeLeft, setIsActive]);

    const handleStartClick = () => {
        if (!buttonSoundsEnabled) return;
        try {
            const audio = new Audio(timerStart);
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

    const liquidColor = liquidColors.longBreak || '#3b82f6';

    return ( 
        <main className="flex justify-center items-center py-1">
            <div
                onClick={() => {
                    if (isFirstTime) {
                        handleStartClick();
                        setIsFirstTime(false);
                    } else {
                        handlePauseButtonAudio();
                    }
                    setIsActive((prev) => !prev);
                }}
                style={{
                    ...timerDimensions.ballStyle,
                    ...timerDimensions.timerFontSizeStyle,
                    ...timerDimensions.labelFontSizeStyle,
                    ...timerDimensions.iconSizeStyle,
                }}
                className="timer-ball aspect-square relative overflow-hidden timer-subcontainer flex flex-col justify-center items-center bg-[var(--bg-color,#121110)] border-[8px] sm:border-[10px] border-[var(--timer-stroke,#eedfc8)] rounded-full hover:scale-[0.99] hover:cursor-pointer transition-all shadow-2xl"
            >
                {/* Background inside ball: Photo or Liquid */}
                {selectedTimerPhoto ? (
                    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
                        <img 
                            src={selectedTimerPhoto} 
                            alt="Foto do Timer" 
                            className="w-full h-full object-cover object-center transform-gpu"
                        />
                        {/* Soft tint overlay so timer digits and text remain 100% crisp and readable */}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]" />
                    </div>
                ) : (
                    <div 
                        className="absolute left-0 w-full h-full z-0 transition-all duration-1000 ease-linear pointer-events-none"
                        style={{ top: `${100 - waterPercentage}%` }}
                    >
                        {isLiquidAnimated ? (
                            <>
                                <div 
                                    className="absolute top-0 left-[-50%] w-[200%] h-[200%] opacity-55 rounded-[45%] animate-[spin_10s_linear_infinite]"
                                    style={{ backgroundColor: liquidColor }}
                                />  
                                <div 
                                    className="absolute top-[2%] left-[-50%] w-[200%] h-[200%] rounded-[40%] animate-[spin_7s_linear_infinite]"
                                    style={{ backgroundColor: liquidColor }}
                                />
                            </>
                        ) : (
                            <div 
                                className="absolute inset-0 w-full h-full"
                                style={{ 
                                    backgroundColor: liquidColor,
                                    boxShadow: 'inset 0 6px 20px rgba(255, 255, 255, 0.25)',
                                }}
                            >
                                <div className="w-full h-1 bg-white/35 shadow-sm" />
                            </div>
                        )}
                    </div>
                )}

                <Button 
                    isFirstTime={isFirstTime}
                    setIsFirstTime={setIsFirstTime}
                    minutes={minutes}
                    seconds={seconds}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    setTimeLeft={setTimeLeft}
                    TOTAL_SECONDS={TOTAL_SECONDS}
                    mode="longBreak"
                />
            </div>
        </main>
    );
};
 
export default LongBreakView;
