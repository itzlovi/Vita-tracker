import { useState, useEffect } from 'react';
import { useHealthData, MoodEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { motion } from 'framer-motion';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

type Mood = 'happy' | 'sad' | 'neutral' | 'energetic' | 'tired' | 'stressed' | 'calm';

const moodOptions: { type: Mood, emoji: string, label: string, color: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-700' },
  { type: 'sad', emoji: '😔', label: 'Sad', color: 'bg-blue-100 text-blue-700' },
  { type: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-slate-100 text-slate-700' },
  { type: 'energetic', emoji: '😃', label: 'Energetic', color: 'bg-yellow-100 text-yellow-700' },
  { type: 'tired', emoji: '😴', label: 'Tired', color: 'bg-purple-100 text-purple-700' },
  { type: 'stressed', emoji: '😓', label: 'Stressed', color: 'bg-red-100 text-red-700' },
  { type: 'calm', emoji: '😌', label: 'Calm', color: 'bg-indigo-100 text-indigo-700' },
];

const MoodTracker = () => {
  const { moodEntries, addMoodEntry } = useHealthData();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  useEffect(() => {
    // Check if there's a mood entry for today
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = moodEntries.find(entry => entry.date === today);
    if (todayEntry) {
      setTodayMood(todayEntry);
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note || '');
    } else {
      setTodayMood(null);
      setSelectedMood(null);
      setNote('');
    }
  }, [moodEntries]);
  
  const handleMoodSelection = (mood: Mood) => {
    setSelectedMood(mood);
  };
  
  const handleSaveMood = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    const moodEntry: MoodEntry = {
      date: today,
      mood: selectedMood,
      note: note.trim() || undefined
    };
    
    addMoodEntry(moodEntry);
  };
  
  const getMoodColor = (mood: Mood | undefined | null) => {
    if (!mood) return 'bg-slate-100';
    const option = moodOptions.find(opt => opt.type === mood);
    return option?.color.split(' ')[0] || 'bg-slate-100';
  };
  
  const getMoodEmoji = (mood: Mood | undefined | null) => {
    if (!mood) return '❓';
    const option = moodOptions.find(opt => opt.type === mood);
    return option?.emoji || '❓';
  };
  
  // Generate days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mood Tracker
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Track your daily mood and see patterns over time
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Mood Section */}
        <Card title="How are you feeling today?" variant="glass">
          <div className="mb-4">
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-4">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.type}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors text-white bg-surface-dark-300 hover:bg-gradient-to-br hover:from-primary-500/40 hover:to-accent-500/40 ${
                    selectedMood === option.type 
                      ? 'bg-gradient-to-br from-primary-500/60 to-accent-500/60 border-primary-400 shadow-card-hover' 
                      : 'border-white/10'
                  }`}
                  onClick={() => handleMoodSelection(option.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs font-medium text-secondary">{option.label}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-medium text-secondary mb-1">
                Add a note (optional)
              </label>
              <textarea
                id="note"
                className="input h-24 resize-none"
                placeholder="What's making you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
            
            <button
              className="btn btn-primary w-full"
              onClick={handleSaveMood}
              disabled={!selectedMood}
            >
              {todayMood ? 'Update Today\'s Mood' : 'Save Today\'s Mood'}
            </button>
          </div>
        </Card>
        
        {/* Calendar View */}
        <Card 
          title={format(currentMonth, 'MMMM yyyy')}
          subtitle="Your mood calendar"
          variant="glass"
        >
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-secondary py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-start-${i}`} className="h-10"></div>
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const moodForDay = moodEntries.find(entry => entry.date === dateStr);
              
              return (
                <div 
                  key={dateStr} 
                  className={`h-10 flex items-center justify-center rounded-full ${
                    isSameDay(day, new Date()) ? 'ring-2 ring-accent-400' : ''
                  }`}
                >
                  <div 
                    className={`w-9 h-9 flex flex-col items-center justify-center rounded-full text-xs font-medium bg-surface-dark-300 text-white ${moodForDay ? 'cursor-help' : ''}`}
                    title={moodForDay ? `${format(day, 'MMM d')}: ${moodForDay.mood}${moodForDay.note ? ` - ${moodForDay.note}` : ''}` : ''}
                  >
                    <span>{format(day, 'd')}</span>
                    {moodForDay && (
                      <span className="text-[10px]">{getMoodEmoji(moodForDay.mood)}</span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
              <div key={`empty-end-${i}`} className="h-10"></div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              className="btn btn-secondary text-sm px-3 py-1"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              Previous
            </button>
            <button 
              className="btn btn-secondary text-sm px-3 py-1"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              Next
            </button>
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card title="Your Mood Patterns" subtitle="Recent trends" variant="glass">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {moodOptions.map((option) => {
              const count = moodEntries.filter(entry => entry.mood === option.type).length;
              return (
                <div 
                  key={option.type}
                  className="p-3 rounded-lg bg-surface-dark-300 border border-white/10 text-white"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{option.emoji}</span>
                    <span className="font-medium text-secondary">{option.label}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {count} {count === 1 ? 'day' : 'days'}
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-secondary mt-4">
            Your most common mood is{' '}
            <span className="font-medium">
              {(() => {
                const moodCounts = moodOptions.map(option => ({
                  type: option.type,
                  count: moodEntries.filter(entry => entry.mood === option.type).length
                }));
                const mostCommon = moodCounts.reduce((prev, current) => 
                  (prev.count > current.count) ? prev : current, { type: 'neutral', count: 0 }
                );
                const option = moodOptions.find(opt => opt.type === mostCommon.type);
                return option ? `${option.label} ${option.emoji}` : 'Neutral 😐';
              })()}
            </span>.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;