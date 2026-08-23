import {useMode} from '../../hooks/useMode'
import PomodoroView from './PomodoroView';
import ShortBreakView from './ShortBreakView';
import LongBreakView from './LongBreakView';

const Homepage = () => {

    const {mode} = useMode()

    const renderTimer = () =>{
        switch(mode){
            case "pomodoro":
                return <PomodoroView />
            case "short-break":
                return <ShortBreakView />
            case "long-break":
                return <LongBreakView />
        }
    }

    return ( 
        <main className="flex justify-center items-center">
            {renderTimer()}
        </main>
     );
}
 
export default Homepage;