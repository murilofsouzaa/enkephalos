import { useMode} from '../../hooks/useMode';
import type {IMode} from '../../context/ModeContext'

const Header = () => {

    const {setMode} = useMode(); 
    return ( 
        <header>
            <ul>
                <li><button 
                    onClick={() => setMode("pomodoro")}
                    type="button">Pomodoro</button></li>
                <li><button 
                    onClick={() => setMode("short-break")}
                    type="button">Short-Break</button></li>
                <li><button
                    onClick={() => setMode("long-break")}
                    type="button">Long-Break</button></li>
            </ul>
        </header>
     );
}
 
export default Header;