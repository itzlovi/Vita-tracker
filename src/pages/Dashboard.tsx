import { useState, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { 
  Droplets, Moon, Activity, Smile, 
  Weight, Utensils, BarChart, Clock,
  TrendingUp, Target, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import LineChart from '../components/charts/LineChart';

const Dashboard = () => {
  const { 
    moodEntries, 
    waterEntries, 
    sleepEntries, 
    mealEntries,
    weightEntries,
    waterGoal
  } = useHealthData();
  
  const [todayWaterAmount, setTodayWaterAmount] = useState(0);
  const [todayMoodEntry, setTodayMoodEntry] = useState<string | null>(null);
  const [lastSleepEntry, setLastSleepEntry] = useState<{duration: number, quality?: number} | null>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [steps, setSteps] = useState(0);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's water intake
    const todayWater = waterEntries.find(entry => entry.date === today);
    setTodayWaterAmount(todayWater?.amount || 0);
    
    // Get today's mood
    const todayMood = moodEntries.find(entry => entry.date === today);
    setTodayMoodEntry(todayMood?.mood || null);
    
    // Get last sleep entry
    if (sleepEntries.length > 0) {
      setLastSleepEntry(sleepEntries[0]);
    }
    
    // Calculate today's calories
    const todayMeals = mealEntries.filter(entry => entry.date === today);
    const calories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    setTodayCalories(calories);
    
    // Get latest weight
    if (weightEntries.length > 0) {
      setLatestWeight(weightEntries[0].weight);
    }
    
    // Generate random step count for demo
    setSteps(Math.floor(Math.random() * 4000) + 6000);
  }, [moodEntries, waterEntries, sleepEntries, mealEntries, weightEntries]);
  
  // Prepare sleep data for chart
  const sleepChartData = {
    labels: sleepEntries.slice(0, 7).map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse(),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: sleepEntries.slice(0, 7).map(entry => entry.duration / 60).reverse(),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
  
  // Get emoji for mood display
  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'neutral': return '😐';
      case 'energetic': return '😃';
      case 'tired': return '😴';
      case 'stressed': return '😓';
      case 'calm': return '😌';
      default: return '❓';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-secondary text-lg font-medium">
            Here's your health overview for today
          </p>
        </motion.div>
      </header>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Water Intake */}
        <Card 
          title="Water Intake" 
          subtitle="Today's hydration"
          icon={<Droplets size={24} />}
          variant="glass"
        >
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-accent-400">{todayWaterAmount}</span>
                <span className="text-lg text-secondary ml-1">ml</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted">Goal: {waterGoal}ml</div>
                <div className="text-xs text-accent-300 font-medium">
                  {((todayWaterAmount / waterGoal) * 100).toFixed(0)}% complete
                </div>
              </div>
            </div>
            <ProgressBar 
              value={todayWaterAmount} 
              max={waterGoal} 
              variant="glow"
              color="bg-gradient-to-r from-accent-400 to-accent-600"
            />
          </div>
        </Card>
        
        {/* Mood */}
        <Card 
          title="Today's Mood" 
          subtitle="How are you feeling?"
          icon={<Smile size={24} />}
          variant="glass"
        >
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-6xl mb-3">{getMoodEmoji(todayMoodEntry)}</span>
            <p className="text-primary-300 capitalize font-medium text-lg">
              {todayMoodEntry || 'Not tracked'}
            </p>
          </div>
        </Card>
        
        {/* Sleep */}
        <Card 
          title="Last Sleep" 
          subtitle="Rest quality"
          icon={<Moon size={24} />}
          variant="glass"
        >
          {lastSleepEntry ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-1">
                  {Math.floor(lastSleepEntry.duration / 60)}h {lastSleepEntry.duration % 60}m
                </div>
                <div className="flex items-center justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${
                        i < (lastSleepEntry.quality || 0) ? 'text-yellow-400' : 'text-slate-600'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted py-4">No sleep data yet</p>
          )}
        </Card>
        
        {/* Weight */}
        <Card 
          title="Current Weight" 
          subtitle="Latest recorded"
          icon={<Weight size={24} />}
          variant="glass"
        >
          {latestWeight ? (
            <div className="text-center">
              <span className="text-3xl font-bold text-secondary-400">{latestWeight.toFixed(1)}</span>
              <span className="text-secondary-400 ml-2 text-lg">kg</span>
              <div className="mt-2 flex items-center justify-center text-sm text-green-400">
                <TrendingUp size={16} className="mr-1" />
                <span>On track</span>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted py-4">No data yet</p>
          )}
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sleep Trend Chart */}
        <Card title="Sleep Trends" subtitle="Last 7 days" className="lg:col-span-2" variant="glass">
          <div className="h-64">
            <LineChart 
              data={sleepChartData} 
              height={240} 
              yAxisLabel="Hours"
            />
          </div>
        </Card>
        
        {/* Daily Activity Summary */}
        <Card title="Today's Activity" subtitle="Your progress" variant="glass">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-dark-300 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-accent-400 to-accent-600 flex items-center justify-center mr-3">
                  <Activity size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Steps</div>
                  <div className="text-sm text-muted">Daily goal: 10,000</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-accent-400">{steps.toLocaleString()}</div>
                <div className="text-xs text-accent-300">{((steps / 10000) * 100).toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-dark-300 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center mr-3">
                  <Utensils size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Calories</div>
                  <div className="text-sm text-muted">Consumed today</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-400">{todayCalories}</div>
                <div className="text-xs text-primary-300">kcal</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-dark-300 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-secondary-400 to-secondary-600 flex items-center justify-center mr-3">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">Energy</div>
                  <div className="text-sm text-muted">Activity score</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-secondary-400">{Math.floor(Math.random() * 30) + 70}</div>
                <div className="text-xs text-secondary-300">/100</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Insights & Recommendations */}
      <Card 
        title="Health Insights" 
        subtitle="Personalized recommendations" 
        variant="gradient"
        className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Hydration Goal</h3>
              <p className="text-secondary text-sm leading-relaxed">
                You're {((todayWaterAmount / waterGoal) * 100).toFixed(0)}% towards your daily water goal. 
                Keep it up for optimal health!
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
              <Moon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Sleep Quality</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Your average sleep quality is excellent. Maintain your bedtime routine for continued success.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Progress Trend</h3>
              <p className="text-secondary text-sm leading-relaxed">
                Your wellness metrics show consistent improvement over the past week. Great work!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;