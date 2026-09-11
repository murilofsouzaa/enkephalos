import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CentralHub from './modules/hub/CentralHub';
import ArticlesList from './modules/articles/components/ArticlesList';
import ArticleDetail from './modules/articles/components/ArticleDetail';
import PomodoroPage from './modules/pomodoro/PomodoroPage';
import { TransitionProvider } from './context/TransitionContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <TransitionProvider>
          <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--accent-muted)] selection:text-[var(--accent-color)] transition-colors duration-300">
            {/* Global Navigation Header */}
            <Navbar />

          {/* Dynamic Route Content */}
          <main className="flex-1">
            <Routes>
              {/* Central Hub: Minimalist home with two giant animated SVG buttons */}
              <Route path="/" element={<CentralHub />} />

              {/* Estudos Archive: Single-text stream organized by dates with period sidebar */}
              <Route path="/estudos" element={<ArticlesList />} />
              <Route path="/estudos/:slug" element={<ArticleDetail />} />

              {/* Backward compatibility redirects for /artigos */}
              <Route path="/artigos" element={<Navigate to="/estudos" replace />} />
              <Route path="/artigos/:slug" element={<Navigate to="/estudos" replace />} />

              {/* Pomodoro Timer: Integrated focus timer with modes */}
              <Route path="/pomodoro" element={<PomodoroPage />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </TransitionProvider>
    </ThemeProvider>
  </Router>
);
}

export default App;