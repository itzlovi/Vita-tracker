import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthDataProvider } from './context/HealthDataContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import WaterIntake from './pages/WaterIntake';
import BreathingExercise from './pages/BreathingExercise';
import MealLog from './pages/MealLog';
import SleepTracker from './pages/SleepTracker';
import FitnessRoutine from './pages/FitnessRoutine';
import StretchSequence from './pages/StretchSequence';
import MentalHealthJournal from './pages/MentalHealthJournal';
import WeightTracker from './pages/WeightTracker';

function App() {
  return (
    <HealthDataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/water" element={<WaterIntake />} />
            <Route path="/breathing" element={<BreathingExercise />} />
            <Route path="/meals" element={<MealLog />} />
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/fitness" element={<FitnessRoutine />} />
            <Route path="/stretch" element={<StretchSequence />} />
            <Route path="/journal" element={<MentalHealthJournal />} />
            <Route path="/weight" element={<WeightTracker />} />
          </Routes>
        </Layout>
      </Router>
    </HealthDataProvider>
  );
}

export default App;