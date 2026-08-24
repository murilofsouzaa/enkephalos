const Button = () => {
    return ( 
        <div className="z-10 flex flex-col justify-center items-center">
            <div className="text-white text-9xl font-bold">
                {isFirstTime ? 
                    <span className="font-lexend drop-shadow-md">25:00</span>
                :
                    <span className="font-lexend drop-shadow-md">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
                }
            </div>
            <div className="flex gap-5 mt-2">
                <button
                    type="button"
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
                    onClick={handleRestart}
                >
                    <RotateCcw className="w-auto h-8"/>
                </button>
            </div>
        </div>
     );
}
 
export default Button;