import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  getMockMoodData, 
  getMockWaterData, 
  getMockSleepData,
  getMockMealData,
  getMockWeightData,
  getMockExerciseData,
  getMockJournalData,
  getMockStretchData
} from '../utils/mockData';

// Define types for all health data
export type MoodEntry = {
  date: string;
  mood: 'happy' | 'sad' | 'neutral' | 'energetic' | 'tired' | 'stressed' | 'calm';
  note?: string;
};

export type WaterEntry = {
  date: string;
  amount: number; // in ml
};

export type SleepEntry = {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality?: 1 | 2 | 3 | 4 | 5;
};

export type MealEntry = {
  id: string;
  date: string;
  name: string;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
};

export type WeightEntry = {
  date: string;
  weight: number; // in kg
};

export type ExerciseEntry = {
  id: string;
  name: string;
  duration: number; // in minutes
  completed: boolean;
};

export type JournalEntry = {
  date: string;
  text: string;
  tags: string[];
};

export type StretchEntry = {
  id: string;
  name: string;
  duration: number; // in seconds
  imageUrl: string;
};

// Define the context type
type HealthDataContextType = {
  // Data
  moodEntries: MoodEntry[];
  waterEntries: WaterEntry[];
  sleepEntries: SleepEntry[];
  mealEntries: MealEntry[];
  weightEntries: WeightEntry[];
  exerciseRoutine: ExerciseEntry[];
  journalEntries: JournalEntry[];
  stretchSequence: StretchEntry[];
  
  // Daily Goals
  waterGoal: number;
  
  // Actions
  addMoodEntry: (entry: MoodEntry) => void;
  addWaterEntry: (amount: number) => void;
  addSleepEntry: (entry: SleepEntry) => void;
  addMealEntry: (entry: MealEntry) => void;
  addWeightEntry: (entry: WeightEntry) => void;
  updateExerciseRoutine: (exercises: ExerciseEntry[]) => void;
  toggleExerciseCompleted: (id: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateStretchSequence: (stretches: StretchEntry[]) => void;
};

// Create context with default values
const HealthDataContext = createContext<HealthDataContextType | null>(null);

// Provider component
export const HealthDataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with mock data
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(getMockMoodData());
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>(getMockWaterData());
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(getMockSleepData());
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(getMockMealData());
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(getMockWeightData());
  const [exerciseRoutine, setExerciseRoutine] = useState<ExerciseEntry[]>(getMockExerciseData());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(getMockJournalData());
  const [stretchSequence, setStretchSequence] = useState<StretchEntry[]>(getMockStretchData());
  
  const [waterGoal] = useState<number>(2000); // 2L default goal
  
  // Actions
  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries(prev => [entry, ...prev]);
  };
  
  const addWaterEntry = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setWaterEntries(prev => {
      const todayEntry = prev.find(entry => entry.date === today);
      
      if (todayEntry) {
        return prev.map(entry => 
          entry.date === today 
            ? { ...entry, amount: entry.amount + amount } 
            : entry
        );
      } else {
        return [{ date: today, amount }, ...prev];
      }
    });
  };
  
  const addSleepEntry = (entry: SleepEntry) => {
    setSleepEntries(prev => [entry, ...prev]);
  };
  
  const addMealEntry = (entry: MealEntry) => {
    setMealEntries(prev => [entry, ...prev]);
  };
  
  const addWeightEntry = (entry: WeightEntry) => {
    setWeightEntries(prev => [entry, ...prev]);
  };
  
  const updateExerciseRoutine = (exercises: ExerciseEntry[]) => {
    setExerciseRoutine(exercises);
  };
  
  const toggleExerciseCompleted = (id: string) => {
    setExerciseRoutine(prev => 
      prev.map(exercise => 
        exercise.id === id 
          ? { ...exercise, completed: !exercise.completed } 
          : exercise
      )
    );
  };
  
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
  };
  
  const updateStretchSequence = (stretches: StretchEntry[]) => {
    setStretchSequence(stretches);
  };
  
  // Context value
  const value = {
    moodEntries,
    waterEntries,
    sleepEntries,
    mealEntries,
    weightEntries,
    exerciseRoutine,
    journalEntries,
    stretchSequence,
    waterGoal,
    addMoodEntry,
    addWaterEntry,
    addSleepEntry,
    addMealEntry,
    addWeightEntry,
    updateExerciseRoutine,
    toggleExerciseCompleted,
    addJournalEntry,
    updateStretchSequence,
  };
  
  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook for using the context
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};