import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { TransitionProvider } from './context/TransitionContext';
import { ThemeProvider } from './context/ThemeContext';
import { PomodoroSettingsProvider } from './modules/pomodoro/context/PomodoroSettingsContext';
import { GlobalAudioPlayer } from './modules/pomodoro/components/GlobalAudioPlayer';
import './App.css';

const CentralHub = lazy(() => import('./modules/hub/CentralHub'));
const ArticlesList = lazy(() => import('./modules/articles/components/ArticlesList'));
const ArticleDetail = lazy(() => import('./modules/articles/components/ArticleDetail'));
const PomodoroPage = lazy(() => import('./modules/pomodoro/PomodoroPage'));
const StudyPlannerView = lazy(() => import('./modules/study-planner/StudyPlannerView'));

const RouteLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-color,#f59e0b)] border-t-transparent animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <PomodoroSettingsProvider>
          <TransitionProvider>
            <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[var(--accent-muted)] selection:text-[var(--accent-color)] transition-colors duration-300">
              {/* Global Navigation Header */}
              <Navbar />

              {/* Dynamic Route Content */}
              <main className="flex-1">
                <Suspense fallback={<RouteLoading />}>
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

                    {/* Planejador de Revisões & Gráfico da Curva de Hermann Ebbinghaus */}
                    <Route path="/revisoes" element={<StudyPlannerView />} />
                    <Route path="/planner" element={<Navigate to="/revisoes" replace />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Site-wide Floating Mini Audio Player */}
              <GlobalAudioPlayer />
            </div>
          </TransitionProvider>
        </PomodoroSettingsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;