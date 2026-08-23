import { useMode} from '../../hooks/useMode';

const Header = () => {

    const {setMode} = useMode(); 
    return ( 
        <header className="bg-(--bg-color) flex justify-center items-center h-30 w-auto">
            <ul className="flex gap-10 text-white text-2xl">
                <li><button 
                    onClick={() => setMode("pomodoro")}
                    className="uppercase"
                    type="button">Pomodoro</button></li>
                <li><button 
                    onClick={() => setMode("short-break")}
                    className="uppercase"
                    type="button">Short-Break</button></li>
                <li><button
                    onClick={() => setMode("long-break")}
                    className="uppercase"
                    type="button">Long-Break</button></li>
            </ul>
        </header>
     );
}
 
export default Header;