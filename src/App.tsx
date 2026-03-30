import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkoutOverview from './pages/WorkoutOverview';
import WorkoutPlayer from './pages/WorkoutPlayer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/treino/:id" element={<WorkoutOverview />} />
      <Route path="/treino/:id/play" element={<WorkoutPlayer />} />
    </Routes>
  );
}

export default App;
