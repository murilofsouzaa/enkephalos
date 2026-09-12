import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
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
    isRealMode?: boolean;
    mode?: 'pomodoro' | 'shortBreak' | 'longBreak';
}

const Button = ({ isFirstTime, minutes, seconds, setIsActive, setIsFirstTime, setTimeLeft , isActive, TOTAL_SECONDS, isRealMode, mode = 'pomodoro'}: ButtonProps) => {
    const { buttonSoundsEnabled, timerDurations, setTimerDuration } = usePomodoroSettings();
    const [isEditingTime, setIsEditingTime] = useState(false);
    const editorRef = useRef<HTMLDivElement | null>(null);
    
    const initialMinutes = Math.floor(TOTAL_SECONDS / 60);
    const initialSeconds = TOTAL_SECONDS % 60;

    // Click anywhere on screen or press Escape to close the editor
    useEffect(() => {
        if (!isEditingTime) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
                setIsEditingTime(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsEditingTime(false);
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }, 10);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditingTime]);

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

    return ( 
        <div className="z-10 flex flex-col justify-center items-center select-none pointer-events-auto max-w-[85%] text-center">
            {isEditingTime && isFirstTime ? (
                <div
                    ref={editorRef}
                    onClick={(e) => e.stopPropagation()}
                    className="z-30 flex flex-col items-center gap-2 bg-black/80 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-1"
                >
                    <div className="flex items-center justify-between w-full gap-3 text-[11px] font-semibold text-[var(--accent-color,#f59e0b)] uppercase tracking-wider">
                        <span>Ajustar Duração</span>
                        <span className="text-[10px] text-white/50 lowercase">
                            {mode === 'pomodoro' ? 'foco' : mode === 'shortBreak' ? 'curta' : 'longa'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => mode && setTimerDuration(mode, Math.max(1, (timerDurations[mode] || initialMinutes) - 1))}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer transition-colors"
                            title="Diminuir 1 minuto"
                        >
                            -
                        </button>

                        <div className="flex items-baseline gap-1">
                            <input
                                type="number"
                                min={1}
                                max={180}
                                value={mode ? timerDurations[mode] : initialMinutes}
                                onChange={(e) => mode && setTimerDuration(mode, Number(e.target.value))}
                                className="w-14 sm:w-16 text-center text-2xl sm:text-3xl font-bold font-['Lexend',sans-serif] bg-transparent text-white focus:outline-none border-b border-[var(--accent-color,#f59e0b)] pb-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                autoFocus
                            />
                            <span className="text-xs text-white/70 font-['Lexend',sans-serif]">min</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => mode && setTimerDuration(mode, Math.min(180, (timerDurations[mode] || initialMinutes) + 1))}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer transition-colors"
                            title="Aumentar 1 minuto"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsEditingTime(false)}
                        className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-bold text-xs hover:scale-105 transition-transform cursor-pointer shadow-md mt-0.5"
                    >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Salvar</span>
                    </button>
                </div>
            ) : (
                <div 
                    onClick={(e) => {
                        if (isFirstTime) {
                            e.stopPropagation();
                            setIsEditingTime(true);
                        }
                    }}
                    className={`timer-digits text-white font-bold leading-none tracking-tight ${isFirstTime ? 'cursor-pointer group/timer' : ''}`}
                    title={isFirstTime ? 'Clique para ajustar o tempo' : undefined}
                >
                    {isFirstTime ? (
                        <span className="font-['Lexend',sans-serif] drop-shadow-md group-hover/timer:text-amber-200 transition-colors">
                            {initialMinutes.toString().padStart(2, '0')}:{initialSeconds.toString().padStart(2, '0')}
                        </span>
                    ) : (
                        <span className="font-['Lexend',sans-serif] drop-shadow-md">
                            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                        </span>
                    )}
                </div>
            )}
            
            {isRealMode ? (
                <div className="flex flex-col items-center gap-1.5 mt-2 sm:mt-3">
                    {isFirstTime ? (
                        <>
                            <button
                                type="button"
                                className="timer-label font-['Raleway',sans-serif] font-bold tracking-widest text-white/90 cursor-pointer drop-shadow-md hover:text-white transition-colors"
                            >
                                CLICK TO START
                            </button>
                            <span className="text-[10px] sm:text-[11px] font-['Lexend',sans-serif] text-amber-300 font-medium tracking-wide drop-shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                Modo Real • Se Parar Reseta
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-200 cursor-pointer drop-shadow-md hover:scale-105 transition-all text-xs sm:text-sm font-semibold"
                                title="Parar e resetar (Modo Real)"
                                onClick={(e) => {
                                    handleRestartButtonAudio();
                                    handleRestart(e);
                                }}
                            >
                                <RotateCcw className="w-4 h-4 text-red-300" />
                                <span>Parar e Resetar</span>
                            </button>
                            <span className="text-[10px] text-white/70 font-mono tracking-wider uppercase">
                                Foco Indivisível • Sem Pausas
                            </span>
                        </>
                    )}
                </div>
            ) : (
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
                            <Play className="timer-icon" />
                        ) : (
                            <Pause className="timer-icon" />
                        )}
                    </button>
                    
                    <button
                        type="button"
                        className={`${!isFirstTime && "hidden"} timer-label font-['Raleway',sans-serif] font-bold tracking-widest text-white/90 cursor-pointer drop-shadow-md hover:text-white transition-colors`}
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
                        <RotateCcw className="timer-icon" />
                    </button>
                </div>
            )}
        </div>
     );
};
 
export default Button;
