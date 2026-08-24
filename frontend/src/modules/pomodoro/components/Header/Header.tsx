import { useMode} from '../../hooks/useMode';

const Header = () => {

    const {setMode} = useMode(); 

    return ( 
        <header className="bg-(--bg-color) flex justify-center items-center h-30 w-auto">
            <ul className="flex gap-10 font-lexend text-white text-2xl">
                <li className="py-2 px-6 border rounded-lg hover:cursor-pointer"><button 
                    onClick={() => setMode("pomodoro")}
                    className="uppercase hover:cursor-pointer"
                    type="button">Pomodoro</button></li>
                <li className="py-2 px-6 border rounded-lg hover:cursor-pointer"><button 
                    onClick={() => setMode("short-break")}
                    className="uppercase hover:cursor-pointer"
                    type="button">Short-Break</button></li>
                <li className="py-2 px-6 border hover:cursor-pointer hover:scale-[1.03] rounded-lg transition-all"><button
                    onClick={() => setMode("long-break")}
                    className="uppercase hover:cursor-pointer "
                    type="button">Long-Break</button></li>
            </ul>
        </header>
     );
}
 
export default Header;