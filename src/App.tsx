import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import LogPage from './pages/LogPage';
import HabitsPage from './pages/HabitsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-body">
        <header className="border-b border-border bg-surface sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-green font-display font-bold text-xl">
              <Leaf className="w-6 h-6" />
              NutriSense
            </Link>
            <nav className="flex gap-4 sm:gap-6 text-sm font-medium">
              <Link to="/analyze" className="hover:text-green transition-colors">Analyze</Link>
              <Link to="/log" className="hover:text-green transition-colors">Log</Link>
              <Link to="/habits" className="hover:text-green transition-colors">Habits</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/log" element={<LogPage />} />
            <Route path="/habits" element={<HabitsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
