import './App.css'
import Homepage from './components/Homepage/Homepage'
import Header from './components/Header/Header'
import { ModeProvider } from './context/ModeContext';


function App() {

  return (
     <ModeProvider>
       <Header></Header>
       <Homepage></Homepage>
     </ModeProvider>
  )
}

export default App