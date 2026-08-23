import {useState, useEffect} from 'react'
import {Play, Pause} from 'lucide-react'

const Homepage = () => {

    const [minutes, setMinutes] = useState<number>(25);
    const [seconds, setSeconds] = useState<number>(59);
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if(isActive) {
            const timerId = setInterval(() =>{
                setSeconds((prev):number => {
                    if(prev > 0){
                      return prev - 1;  
                    }else{
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
                } 
            )
            }, 1000)
            return () => clearInterval(timerId);
        }
    }, [isActive]);

    return ( 
        <main className="flex justify-center items-center bg-(--bg-color) h-screen">
            <button
                type="button"
                onClick={() => {
                    setIsFirstTime(false);
                    setIsActive((prev) => !prev)
                }}
                className="timer-subcontainer flex flex-col justify-center items-center bg-(--circle-color) border-10 border-(--timer-stroke) 
                h-150 w-150 rounded-[100%] hover:scale-[0.98] hover:cursor-pointer transition-all">
                <div className="text-white text-9xl font-bold">
                    {isFirstTime ? 
                        <span>25:00</span>
                    :
                        <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
                    }
                </div>
            <button 
                type="button"
                className={`${isFirstTime && "hidden"} font-semibold text-white py-2 px-8 cursor-pointer`}
                >{!isActive? <Play className="w-auto h-8"/> : <Pause  className="w-auto h-8"/>}
            </button>
            <button 
                type="button"
                className={`${!isFirstTime && "hidden"} font-semibold text-2xl text-white py-2 px-8 cursor-pointer`}
                >{!isActive && "CLICK TO START"}
            </button>
            </button>
        </main>
     );
}
 
export default Homepage;