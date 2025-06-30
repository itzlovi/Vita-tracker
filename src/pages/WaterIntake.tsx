import { useState, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { Droplets, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import LineChart from '../components/charts/LineChart';

const WaterIntake = () => {
  const { waterEntries, waterGoal, addWaterEntry } = useHealthData();
  const [todayAmount, setTodayAmount] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(250); // Default 250ml
  const [waterAnimation, setWaterAnimation] = useState(false);
  
  useEffect(() => {
    // Get today's water amount
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = waterEntries.find(entry => entry.date === today);
    setTodayAmount(todayEntry?.amount || 0);
  }, [waterEntries]);
  
  const handleAddWater = () => {
    addWaterEntry(selectedAmount);
    setWaterAnimation(true);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setWaterAnimation(false);
    }, 1500);
  };
  
  // Prepare chart data
  const last7Days = waterEntries.slice(0, 7).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const chartData = {
    labels: last7Days.map(entry => format(parseISO(entry.date), 'EEE')),
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: last7Days.map(entry => entry.amount),
        borderColor: '#0c98e9',
        backgroundColor: 'rgba(12, 152, 233, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Daily Goal',
        data: last7Days.map(() => waterGoal),
        borderColor: 'rgba(120, 120, 120, 0.5)',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };
  
  // Cup sizes
  const cupSizes = [
    { amount: 50, label: '50ml', height: 'h-4' },
    { amount: 125, label: '125ml', height: 'h-6' },
    { amount: 250, label: '250ml', height: 'h-8' },
    { amount: 500, label: '500ml', height: 'h-10' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Water Intake Tracker
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stay hydrated for optimal health
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Today's Progress */}
        <Card 
          title="Today's Water Intake" 
          icon={<Droplets size={20} className="text-accent-400" />} 
          className="md:col-span-5" 
          variant="glass"
        >
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-6 h-40 w-40">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-accent-400 rounded-b-2xl transition-all"
                initial={{ height: '0%' }}
                animate={{ height: `${Math.min(100, (todayAmount / waterGoal) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <AnimatePresence>
                {waterAnimation && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <span className="text-white text-2xl font-bold">+{selectedAmount}ml</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute inset-0 border-4 border-accent-300 rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-10 border-b-4 border-accent-300 rounded-t-2xl" />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-accent-400 mb-1">{todayAmount}ml</div>
              <div className="text-accent-300">{((todayAmount / waterGoal) * 100).toFixed(0)}% of daily goal</div>
              <ProgressBar 
                value={todayAmount} 
                max={waterGoal} 
                color="bg-gradient-to-r from-accent-400 to-accent-600" 
                className="mt-2 w-64" 
                variant="glow"
              />
            </div>
            
            <div className="text-sm text-secondary mb-3">Select serving size:</div>
            <div className="flex items-end space-x-3 mb-4">
              {cupSizes.map((cup) => (
                <motion.button
                  key={cup.amount}
                  className={`w-12 ${cup.height} rounded-t-lg border-2 border-b-0 flex items-center justify-center text-white bg-surface-dark-300 hover:bg-gradient-to-br hover:from-accent-400/40 hover:to-accent-600/40 ${
                    selectedAmount === cup.amount
                      ? 'bg-gradient-to-br from-accent-400/60 to-accent-600/60 border-accent-400 shadow-card-hover' 
                      : 'border-white/10'
                  }`}
                  onClick={() => setSelectedAmount(cup.amount)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-[10px] font-medium">{cup.label}</div>
                </motion.button>
              ))}
            </div>
            
            <button
              onClick={handleAddWater}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Add Water</span>
            </button>
          </div>
        </Card>
        
        {/* Weekly Progress */}
        <Card 
          title="Weekly Progress" 
          subtitle="Last 7 days"
          className="md:col-span-7"
          variant="glass"
        >
          <LineChart data={chartData} height={220} yAxisLabel="ml" />
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-surface-dark-300 rounded-lg p-3 text-center">
              <div className="text-sm text-accent-300 mb-1">Daily Average</div>
              <div className="text-xl font-semibold text-accent-400">
                {last7Days.length > 0 
                  ? Math.round(last7Days.reduce((sum, entry) => sum + entry.amount, 0) / last7Days.length) 
                  : 0}ml
              </div>
            </div>
            
            <div className="bg-surface-dark-300 rounded-lg p-3 text-center">
              <div className="text-sm text-green-300 mb-1">Goal Reached</div>
              <div className="text-xl font-semibold text-green-400">
                {last7Days.filter(entry => entry.amount >= waterGoal).length}/{last7Days.length} days
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card title="Water Intake Tips" variant="glass">
          <ul className="space-y-2 text-secondary">
            <li className="flex items-start">
              <div className="bg-accent-400/20 rounded-full p-1 mt-0.5 mr-2">
                <Droplets size={16} className="text-accent-400" />
              </div>
              <p>Drink a glass of water as soon as you wake up to rehydrate after sleep.</p>
            </li>
            <li className="flex items-start">
              <div className="bg-accent-400/20 rounded-full p-1 mt-0.5 mr-2">
                <Droplets size={16} className="text-accent-400" />
              </div>
              <p>Carry a reusable water bottle with you throughout the day.</p>
            </li>
            <li className="flex items-start">
              <div className="bg-accent-400/20 rounded-full p-1 mt-0.5 mr-2">
                <Droplets size={16} className="text-accent-400" />
              </div>
              <p>Set reminders to drink water every hour during the day.</p>
            </li>
            <li className="flex items-start">
              <div className="bg-accent-400/20 rounded-full p-1 mt-0.5 mr-2">
                <Droplets size={16} className="text-accent-400" />
              </div>
              <p>Eat water-rich fruits and vegetables like cucumber, watermelon, and strawberries.</p>
            </li>
            <li className="flex items-start">
              <div className="bg-accent-400/20 rounded-full p-1 mt-0.5 mr-2">
                <Droplets size={16} className="text-accent-400" />
              </div>
              <p>Drink a glass of water before each meal to help with digestion.</p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default WaterIntake;