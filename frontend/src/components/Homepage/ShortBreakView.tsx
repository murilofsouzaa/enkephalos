import React, {useState, useEffect} from 'react'
import {Play, Pause, RotateCcw} from 'lucide-react'

const ShortBreakView = () => {
    const [minutes, setMinutes] = useState<number>(4);
    const [seconds, setSeconds] = useState<number>(59);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if(isActive) {
            const timerId = setInterval(() =>{
                setSeconds((prev):number => {
                    if(prev > 0){
                      return prev - 1;  
                    }
                    setMinutes((prev):number => {
                        if(prev > 0){
                            setSeconds(59);
                            return prev - 1;
                        }else{
                            return 0;
                        }
                    })
                    setIsActive((prev) => !prev)
                    return 0;
                    } 
            )
            }, 1000)
            return () => clearInterval(timerId);
        }
    }, [isActive]);

    const handleRestart = (e:React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
        setIsFirstTime(true);
        setMinutes(4)
        setSeconds(59)
    }

    return ( 
        <main className="flex justify-center items-center">
            <div
                onClick={() => {
                    setIsFirstTime(false);
                    setIsActive((prev) => !prev)
                }}
                className="timer-subcontainer flex flex-col justify-center items-center bg-(--short-break-circle-color) border-10 border-(--timer-stroke) 
                h-150 w-150 rounded-[100%] hover:scale-[0.98] hover:cursor-pointer transition-all mt-20">
                <div className="text-white text-9xl font-bold">
                    {isFirstTime ? 
                        <span>05:00</span>
                    :
                        <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
                    }
                </div>
                <div className="flex gap-5">
                    <button
                        type="button"
                        className={`${isFirstTime && "hidden"} font-semibold text-white cursor-pointer`}
                        >{!isActive? <Play className="w-auto h-8"/> : <Pause  className="w-auto h-8"/>}
                    </button>
                    <button
                        type="button"
                        className={`${!isFirstTime && "hidden"} font-semibold text-2xl text-white cursor-pointer`}
                        >{!isActive && "CLICK TO START"}
                    </button>
                    <button
                        type="button"
                        className={`${isFirstTime && "hidden"} z-20 font-semibold text-2xl text-white cursor-pointer`}
                        ><RotateCcw 
                        onClick={handleRestart}
                        className="w-auto h-8"/>
                    </button>
                </div>
            </div>
        </main>
     );
}
 
export default ShortBreakView;