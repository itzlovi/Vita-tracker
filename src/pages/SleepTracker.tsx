import { useState, useEffect } from 'react';
import { useHealthData, SleepEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { Moon, Plus, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import LineChart from '../components/charts/LineChart';

const SleepTracker = () => {
  const { sleepEntries, addSleepEntry } = useHealthData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSleep, setNewSleep] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '22:00',
    endTime: '06:30',
    quality: 4
  });
  
  // Calculate sleep duration based on start and end times
  useEffect(() => {
    if (newSleep.startTime && newSleep.endTime) {
      const startDate = new Date();
      const endDate = new Date();
      
      const [startHour, startMinute] = newSleep.startTime.split(':').map(Number);
      const [endHour, endMinute] = newSleep.endTime.split(':').map(Number);
      
      startDate.setHours(startHour, startMinute, 0);
      endDate.setHours(endHour, endMinute, 0);
      
      // If end time is earlier than start time, it means sleep went past midnight
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      const duration = differenceInMinutes(endDate, startDate);
      setNewSleep(prev => ({ ...prev, duration }));
    }
  }, [newSleep.startTime, newSleep.endTime]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSleep.date || !newSleep.startTime || !newSleep.endTime || !newSleep.duration) return;
    
    const sleepEntry: SleepEntry = {
      date: newSleep.date,
      startTime: newSleep.startTime,
      endTime: newSleep.endTime,
      duration: newSleep.duration,
      quality: newSleep.quality as 1 | 2 | 3 | 4 | 5
    };
    
    addSleepEntry(sleepEntry);
    setShowAddForm(false);
    setNewSleep({
      date: new Date().toISOString().split('T')[0],
      startTime: '22:00',
      endTime: '06:30',
      quality: 4
    });
  };
  
  // Format sleep duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Prepare chart data
  const last7Days = sleepEntries.slice(0, 7).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const chartData = {
    labels: last7Days.map(entry => format(parseISO(entry.date), 'EEE')),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: last7Days.map(entry => entry.duration / 60),
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgb(250, 230, 255)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Recommended (8h)',
        data: last7Days.map(() => 8),
        borderColor: 'rgba(120, 120, 120, 0.5)',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };
  
  // Calculate weekly average
  const weeklyAverage = last7Days.length > 0
    ? last7Days.reduce((sum, entry) => sum + entry.duration, 0) / last7Days.length / 60
    : 0;
  
  // Calculate sleep quality average
  const qualityAverage = last7Days.length > 0
    ? last7Days.reduce((sum, entry) => sum + (entry.quality || 3), 0) / last7Days.length
    : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sleep Tracker
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Monitor your sleep patterns for better rest
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Sleep Stats */}
        <Card className="md:col-span-4" variant="glass">
          <div className="flex flex-col items-center py-4">
            <Moon size={36} className="text-primary-400 mb-3" />
            
            <div className="w-full">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-1">Sleep Stats</h3>
                <p className="text-sm text-secondary">Last 7 days</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-surface-dark-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Clock size={18} className="text-primary-400 mr-2" />
                      <span className="text-sm font-medium text-secondary">Average Duration</span>
                    </div>
                    <span className="text-sm text-muted">per night</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-400">
                    {weeklyAverage.toFixed(1)} hours
                  </div>
                  <div className="text-xs mt-1 text-primary-300">
                    {weeklyAverage >= 7
                      ? 'Good sleep duration'
                      : weeklyAverage >= 6
                        ? 'Slightly below recommended'
                        : 'Insufficient sleep'
                    }
                  </div>
                </div>
                
                <div className="p-4 bg-surface-dark-300 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Activity size={18} className="text-secondary-400 mr-2" />
                      <span className="text-sm font-medium text-secondary">Sleep Quality</span>
                    </div>
                    <span className="text-sm text-muted">average rating</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-secondary-400 mr-2">
                      {qualityAverage.toFixed(1)}
                    </div>
                    <div className="text-secondary-300">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < Math.round(qualityAverage) ? '\u2605' : '\u2606'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} />
                <span>Log Sleep</span>
              </button>
            </div>
          </div>
        </Card>
        
        {/* Sleep Chart */}
        <Card 
          title="Sleep Trends" 
          subtitle="Last 7 days"
          className="md:col-span-8"
          variant="glass"
        >
          <LineChart data={chartData} height={220} yAxisLabel="Hours" />
          
          <div className="mt-6">
            <h4 className="font-medium text-slate-800 mb-2 text-white">Recent Sleep Log</h4>
            <div className="space-y-2">
              {last7Days.slice(0, 3).map((entry, index) => (
                <div 
                  key={index}
                  className="p-3 bg-surface-dark-300 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{format(parseISO(entry.date), 'EEEE, MMM d')}</div>
                    <div className="text-xs text-secondary mt-1">
                      {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-400">{formatDuration(entry.duration)}</div>
                    <div className="text-xs text-secondary mt-1">
                      Quality: {entry.quality ? '★'.repeat(entry.quality) : 'Not rated'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Log Sleep Form */}
      {showAddForm && (
        <Card title="Log Your Sleep">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="input"
                  value={newSleep.date}
                  onChange={(e) => setNewSleep({ ...newSleep, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1">
                    Bedtime
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    className="input"
                    value={newSleep.startTime}
                    onChange={(e) => setNewSleep({ ...newSleep, startTime: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-1">
                    Wake Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    className="input"
                    value={newSleep.endTime}
                    onChange={(e) => setNewSleep({ ...newSleep, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sleep Duration
              </label>
              <div className="p-3 bg-purple-50 rounded-lg text-purple-800 font-medium">
                {newSleep.duration ? formatDuration(newSleep.duration) : 'Calculate duration'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sleep Quality
              </label>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <span className="text-sm text-slate-600">Poor</span>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`text-2xl focus:outline-none ${
                        (newSleep.quality || 0) >= rating ? 'text-yellow-500' : 'text-slate-300'
                      }`}
                      onClick={() => setNewSleep({ ...newSleep, quality: rating as 1 | 2 | 3 | 4 | 5 })}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm text-slate-600">Excellent</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                className="btn btn-secondary flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                Save Sleep Log
              </button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="mt-6">
        <Card title="Sleep Tips" subtitle="Improve your sleep quality">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Consistent Schedule</h3>
              <p className="text-sm text-secondary">
                Go to bed and wake up at the same time each day, even on weekends, to regulate your body's internal clock.
              </p>
            </div>
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Bedroom Environment</h3>
              <p className="text-sm text-secondary">
                Keep your bedroom dark, quiet, and cool. Consider using earplugs, eye shades, or white noise machines.
              </p>
            </div>
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Limit Screen Time</h3>
              <p className="text-sm text-secondary">
                Avoid screens at least 1 hour before bedtime as blue light can disrupt your circadian rhythm.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SleepTracker;