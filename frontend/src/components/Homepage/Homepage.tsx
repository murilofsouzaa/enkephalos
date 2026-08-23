import {useState, useEffect} from 'react'

const Homepage = () => {

    const [minutes, setMinutes] = useState<number>(25);
    const [seconds, setSeconds] = useState<number>(59);
    const [isActive, setIsActive] = useState<boolean>(true)

    useEffect(() => {
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
        }, 10)
        return () => clearInterval(timerId);
    }, []);

    return ( 
        <div className="flex justify-center items-center bg-(--bg-color) h-screen">
            <div className="timer-subcontainer flex justify-center items-center bg-(--circle-color) border-10 border-(--timer-stroke) h-150 w-150 rounded-[100%]">
                <div className="text-white text-8xl font-bold">
                    {!isActive ? <span>25:00</span> : <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span> }
                </div>
            </div>
            <button type="button"></button>
        </div>
     );
}
 
export default Homepage;