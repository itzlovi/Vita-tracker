import { useState, useEffect } from 'react';
import { useHealthData, WeightEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { Weight, Plus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, subDays, isToday, isYesterday } from 'date-fns';
import LineChart from '../components/charts/LineChart';

const WeightTracker = () => {
  const { weightEntries, addWeightEntry } = useHealthData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWeight, setNewWeight] = useState<Partial<WeightEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: ''
  });
  const [weightTrend, setWeightTrend] = useState<'up' | 'down' | 'stable' | null>(null);
  const [weightChange, setWeightChange] = useState<number>(0);
  
  // Prepare sorted weight entries for display
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  useEffect(() => {
    if (weightEntries.length >= 2) {
      // Sort entries by date (newest first)
      const sorted = [...weightEntries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Get the difference between the newest and the second newest entry
      const latest = sorted[0].weight;
      const previous = sorted[1].weight;
      const diff = latest - previous;
      
      setWeightChange(Math.abs(diff));
      
      if (diff > 0.2) {
        setWeightTrend('up');
      } else if (diff < -0.2) {
        setWeightTrend('down');
      } else {
        setWeightTrend('stable');
      }
    } else {
      setWeightTrend(null);
      setWeightChange(0);
    }
  }, [weightEntries]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWeight.date || !newWeight.weight) return;
    
    const weightEntry: WeightEntry = {
      date: newWeight.date,
      weight: parseFloat(newWeight.weight as string)
    };
    
    addWeightEntry(weightEntry);
    setShowAddForm(false);
    setNewWeight({
      date: new Date().toISOString().split('T')[0],
      weight: ''
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };
  
  // Prepare data for the chart (oldest to newest)
  const last30Days = [...weightEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);
  
  const chartData = {
    labels: last30Days.map(entry => format(parseISO(entry.date), 'MMM d')),
    datasets: [
      {
        label: 'Weight (kg)',
        data: last30Days.map(entry => entry.weight),
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8, 145, 178, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Weight Tracker
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Monitor your weight changes over time
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Weight Stats */}
        <Card className="md:col-span-5 lg:col-span-4" variant="glass">
          <div className="flex flex-col items-center py-4">
            <Weight size={36} className="text-accent-400 mb-3" />
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-1">Current Weight</h3>
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-accent-400 mr-2">
                  {sortedEntries.length > 0 ? sortedEntries[0].weight.toFixed(1) : '--'}
                </div>
                <div className="text-lg text-accent-300">kg</div>
              </div>
              
              {weightTrend && (
                <div className={`flex items-center justify-center mt-2 text-sm ${
                  weightTrend === 'up' 
                    ? 'text-red-400' 
                    : weightTrend === 'down' 
                      ? 'text-green-400' 
                      : 'text-yellow-400'
                }`}>
                  {weightTrend === 'up' && <TrendingUp size={16} className="mr-1" />}
                  {weightTrend === 'down' && <TrendingDown size={16} className="mr-1" />}
                  {weightTrend === 'stable' && <span className="text-lg mr-1">\u2194</span>}
                  
                  {weightTrend === 'up' && (
                    <span>Gained {weightChange.toFixed(1)} kg since last entry</span>
                  )}
                  {weightTrend === 'down' && (
                    <span>Lost {weightChange.toFixed(1)} kg since last entry</span>
                  )}
                  {weightTrend === 'stable' && (
                    <span>Weight stable since last entry</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="w-full space-y-3">
              <div className="bg-surface-dark-300 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-sm text-accent-300">First Recorded</div>
                  <div className="font-medium text-white">
                    {weightEntries.length > 0 
                      ? `${weightEntries[weightEntries.length - 1].weight.toFixed(1)} kg`
                      : 'No data'}
                  </div>
                </div>
                <div className="text-sm text-accent-400">
                  {weightEntries.length > 0
                    ? formatDate(weightEntries[weightEntries.length - 1].date)
                    : ''}
                </div>
              </div>
              
              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} />
                <span>Log Weight</span>
              </button>
            </div>
          </div>
        </Card>
        
        {/* Weight Chart */}
        <Card 
          title="Weight Trend" 
          subtitle="Last 30 days"
          className="md:col-span-7 lg:col-span-8"
          variant="glass"
        >
          {weightEntries.length > 1 ? (
            <LineChart data={chartData} height={220} yAxisLabel="kg" />
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-slate-500">Not enough data for a trend</p>
              <p className="text-sm text-slate-400 mt-2">Add at least two weight entries to see a trend</p>
            </div>
          )}
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-slate-800 text-white">Weight Stats</h4>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Average',
                  value: weightEntries.length > 0
                    ? (weightEntries.reduce((sum, entry) => sum + entry.weight, 0) / weightEntries.length).toFixed(1)
                    : '--',
                  color: 'bg-blue-50 text-blue-700'
                },
                {
                  label: 'Lowest',
                  value: weightEntries.length > 0
                    ? Math.min(...weightEntries.map(entry => entry.weight)).toFixed(1)
                    : '--',
                  color: 'bg-green-50 text-green-700'
                },
                {
                  label: 'Highest',
                  value: weightEntries.length > 0
                    ? Math.max(...weightEntries.map(entry => entry.weight)).toFixed(1)
                    : '--',
                  color: 'bg-red-50 text-red-700'
                }
              ].map((stat, index) => (
                <div key={index} className={`p-2 rounded-lg ${stat.color} text-center`}>
                  <div className="text-xs mb-1">{stat.label}</div>
                  <div className="font-semibold">{stat.value} kg</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Weight Log */}
      <Card 
        title="Weight History" 
        subtitle="Your recorded entries"
      >
        {sortedEntries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-slate-500">No weight entries yet</p>
            <p className="text-sm text-slate-400 mt-2">Start logging your weight to track changes</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowAddForm(true)}
            >
              Log First Entry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-2 font-medium text-slate-600">Date</th>
                  <th className="pb-2 font-medium text-slate-600">Weight (kg)</th>
                  <th className="pb-2 font-medium text-slate-600">Change</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry, index) => {
                  const prevEntry = sortedEntries[index + 1];
                  const change = prevEntry ? entry.weight - prevEntry.weight : 0;
                  
                  return (
                    <tr key={entry.date} className="border-b border-slate-100">
                      <td className="py-3">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-slate-400 mr-2" />
                          {formatDate(entry.date)}
                        </div>
                      </td>
                      <td className="py-3 font-medium">{entry.weight.toFixed(1)}</td>
                      <td className="py-3">
                        {prevEntry && (
                          <div className={`flex items-center ${
                            change > 0 
                              ? 'text-red-500' 
                              : change < 0 
                                ? 'text-green-500' 
                                : 'text-slate-500'
                          }`}>
                            {change > 0 && <TrendingUp size={16} className="mr-1" />}
                            {change < 0 && <TrendingDown size={16} className="mr-1" />}
                            {change === 0 && <span>—</span>}
                            {change !== 0 && `${change > 0 ? '+' : ''}${change.toFixed(1)}`}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Add Weight Form */}
      {showAddForm && (
        <Card title="Log Your Weight" className="mt-6">
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
                  value={newWeight.date}
                  onChange={(e) => setNewWeight({ ...newWeight, date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="e.g. 70.5"
                  value={newWeight.weight}
                  onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                  required
                />
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
                Save Weight
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default WeightTracker;