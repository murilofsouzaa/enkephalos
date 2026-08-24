import './App.css'
import Homepage from './modules/pomodoro/components/Homepage/Homepage'
import Header from './modules/pomodoro/components/Header/Header'
import { ModeProvider } from './modules/pomodoro/context/ModeContext';


function App() {

  return (
     <ModeProvider>
       <Header></Header>
       <Homepage></Homepage>
     </ModeProvider>
  )
}

export default App