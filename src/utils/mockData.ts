import { 
  MoodEntry, 
  WaterEntry, 
  SleepEntry,
  MealEntry,
  WeightEntry,
  ExerciseEntry,
  JournalEntry,
  StretchEntry
} from '../context/HealthDataContext';

// Helper to generate dates in the past
const getDateXDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock Mood Data
export const getMockMoodData = (): MoodEntry[] => {
  const moods: ('happy' | 'sad' | 'neutral' | 'energetic' | 'tired' | 'stressed' | 'calm')[] = [
    'happy', 'neutral', 'happy', 'energetic', 'tired', 'neutral', 'calm',
    'stressed', 'happy', 'sad', 'neutral', 'energetic', 'tired', 'calm'
  ];
  
  return Array.from({ length: 14 }, (_, i) => ({
    date: getDateXDaysAgo(i),
    mood: moods[i],
    note: i % 3 === 0 ? 'Had a great day!' : undefined
  }));
};

// Mock Water Data
export const getMockWaterData = (): WaterEntry[] => {
  return Array.from({ length: 14 }, (_, i) => ({
    date: getDateXDaysAgo(i),
    amount: Math.floor(Math.random() * 1000) + 1000 // Between 1000ml and 2000ml
  }));
};

// Mock Sleep Data
export const getMockSleepData = (): SleepEntry[] => {
  return Array.from({ length: 14 }, (_, i) => {
    // Random sleep duration between 6-9 hours (in minutes)
    const durationMinutes = (Math.floor(Math.random() * 3) + 6) * 60 + Math.floor(Math.random() * 60);
    
    // Sleep start time around 10-11 PM
    const hour = 22 + Math.floor(Math.random() * 2);
    const minute = Math.floor(Math.random() * 60);
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Calculate end time
    const startMinutes = hour * 60 + minute;
    const endMinutes = (startMinutes + durationMinutes) % (24 * 60);
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return {
      date: getDateXDaysAgo(i),
      startTime,
      endTime,
      duration: durationMinutes,
      quality: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5
    };
  });
};

// Mock Meal Data
export const getMockMealData = (): MealEntry[] => {
  const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const breakfastOptions = ['Oatmeal', 'Eggs & Toast', 'Yogurt & Granola', 'Smoothie Bowl'];
  const lunchOptions = ['Salad', 'Sandwich', 'Soup & Bread', 'Leftovers'];
  const dinnerOptions = ['Chicken & Veggies', 'Pasta', 'Stir Fry', 'Fish & Rice'];
  const snackOptions = ['Apple', 'Nuts', 'Protein Bar', 'Chips'];
  
  let meals: MealEntry[] = [];
  
  // Generate 3-4 meals per day for the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = getDateXDaysAgo(i);
    const mealsPerDay = Math.floor(Math.random() * 2) + 3; // 3 or 4 meals
    
    for (let j = 0; j < mealsPerDay; j++) {
      const type = mealTypes[Math.min(j, 3)];
      let name = '';
      let calories = 0;
      
      switch (type) {
        case 'breakfast':
          name = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)];
          calories = Math.floor(Math.random() * 300) + 300; // 300-600 calories
          break;
        case 'lunch':
          name = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
          calories = Math.floor(Math.random() * 400) + 400; // 400-800 calories
          break;
        case 'dinner':
          name = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
          calories = Math.floor(Math.random() * 500) + 500; // 500-1000 calories
          break;
        case 'snack':
          name = snackOptions[Math.floor(Math.random() * snackOptions.length)];
          calories = Math.floor(Math.random() * 200) + 100; // 100-300 calories
          break;
      }
      
      meals.push({
        id: `meal-${i}-${j}`,
        date,
        name,
        calories,
        type,
        time: `${(type === 'breakfast' ? 8 : type === 'lunch' ? 12 : type === 'dinner' ? 18 : 15).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }
  }
  
  return meals;
};

// Mock Weight Data
export const getMockWeightData = (): WeightEntry[] => {
  // Start with a base weight around 70kg and add slight variations
  const baseWeight = 70;
  
  return Array.from({ length: 30 }, (_, i) => ({
    date: getDateXDaysAgo(i),
    weight: baseWeight + (Math.random() * 2 - 1) // +/- 1kg variation
  }));
};

// Mock Exercise Data
export const getMockExerciseData = (): ExerciseEntry[] => {
  return [
    { id: 'ex1', name: 'Push-ups', duration: 5, completed: false },
    { id: 'ex2', name: 'Plank', duration: 1, completed: false },
    { id: 'ex3', name: 'Squats', duration: 5, completed: false },
    { id: 'ex4', name: 'Jumping Jacks', duration: 3, completed: false },
    { id: 'ex5', name: 'Lunges', duration: 5, completed: false },
    { id: 'ex6', name: 'Mountain Climbers', duration: 2, completed: false },
  ];
};

// Mock Journal Data
export const getMockJournalData = (): JournalEntry[] => {
  const entries = [
    {
      date: getDateXDaysAgo(0),
      text: "Feeling great today! Had a productive morning workout and meal prepped for the week.",
      tags: ['productive', 'energetic', 'happy']
    },
    {
      date: getDateXDaysAgo(1),
      text: "Work was stressful, but I managed to take short breaks and practice deep breathing.",
      tags: ['stressed', 'managing', 'breathing']
    },
    {
      date: getDateXDaysAgo(3),
      text: "Had trouble sleeping last night. Need to cut back on screen time before bed.",
      tags: ['tired', 'sleep', 'screen time']
    },
    {
      date: getDateXDaysAgo(5),
      text: "Went for a long walk in the park. Nature always helps clear my mind.",
      tags: ['relaxed', 'nature', 'walking']
    },
    {
      date: getDateXDaysAgo(7),
      text: "Feeling a bit down today. Weather is gloomy which doesn't help.",
      tags: ['sad', 'low energy', 'weather']
    }
  ];
  
  return entries;
};

// Mock Stretch Data
export const getMockStretchData = (): StretchEntry[] => {
  return [
    {
      id: 'stretch1',
      name: 'Neck Stretch',
      duration: 30,
      imageUrl: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'stretch2',
      name: 'Shoulder Stretch',
      duration: 30,
      imageUrl: 'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'stretch3',
      name: 'Side Bend',
      duration: 30,
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'stretch4',
      name: 'Hamstring Stretch',
      duration: 45,
      imageUrl: 'https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'stretch5',
      name: 'Quad Stretch',
      duration: 45,
      imageUrl: 'https://images.pexels.com/photos/4386432/pexels-photo-4386432.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'stretch6',
      name: 'Lower Back Stretch',
      duration: 30,
      imageUrl: 'https://images.pexels.com/photos/6111611/pexels-photo-6111611.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];
};