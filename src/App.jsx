import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GeneratorTab from './pages/GeneratorTab';
import SavedListsTab from './pages/SavedListsTab';
import DatabaseTab from './pages/DatabaseTab';
import MenuTab from './pages/MenuTab';
import BottomMenu from './components/BottomMenu';
import OnboardingTutorial from './components/OnboardingTutorial';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-[100dvh] w-full mx-auto max-w-md bg-brand-light relative shadow-xl overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 no-scrollbar relative w-full h-full">
          <Routes>
            <Route path="/" element={<Navigate to="/ruleta" replace />} />
            <Route path="/ruleta" element={<GeneratorTab />} />
            <Route path="/listas" element={<SavedListsTab />} />
            <Route path="/base" element={<DatabaseTab />} />
            <Route path="/menu" element={<MenuTab />} />
          </Routes>
        </main>
        <BottomMenu />
      </div>
      <OnboardingTutorial />
    </Router>
  );
}

export default App;
