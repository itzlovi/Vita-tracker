import { useState, useEffect, useRef } from 'react';
import Card from '../components/common/Card';
import { Wind, Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingState = 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest';

const BreathingExercise = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [breathingState, setBreathingState] = useState<BreathingState>('idle');
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<{
    name: string;
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
    color: string;
  }>({
    name: '4-7-8 Breathing',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: 'bg-indigo-400',
  });
  
  const intervalRef = useRef<number | null>(null);
  
  const breathingPatterns = [
    {
      name: '4-7-8 Breathing',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      color: 'bg-indigo-400',
    },
    {
      name: 'Box Breathing',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      color: 'bg-blue-400',
    },
    {
      name: 'Calm Breathing',
      inhale: 5,
      hold1: 2,
      exhale: 5,
      hold2: 0,
      color: 'bg-green-400',
    },
  ];
  
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isRunning) {
      startBreathing();
    } else {
      stopBreathing();
    }
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, selectedPattern]);
  
  const startBreathing = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    
    // Set initial state
    setBreathingState('inhale');
    setCountdown(selectedPattern.inhale);
    
    intervalRef.current = window.setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          setBreathingState((prevState) => {
            switch (prevState) {
              case 'inhale':
                return selectedPattern.hold1 > 0 ? 'hold' : 'exhale';
              case 'hold':
                return 'exhale';
              case 'exhale':
                return selectedPattern.hold2 > 0 ? 'rest' : 'inhale';
              case 'rest':
                setCycles((prev) => prev + 1);
                return 'inhale';
              default:
                return 'inhale';
            }
          });
          
          // Return the new countdown based on the new state
          return (prevState: BreathingState) => {
            switch (prevState) {
              case 'inhale':
                return selectedPattern.hold1 > 0 ? selectedPattern.hold1 : selectedPattern.exhale;
              case 'hold':
                return selectedPattern.exhale;
              case 'exhale':
                return selectedPattern.hold2 > 0 ? selectedPattern.hold2 : selectedPattern.inhale;
              case 'rest':
                setCycles((prev) => prev + 1);
                return selectedPattern.inhale;
              default:
                return selectedPattern.inhale;
            }
          };
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  const stopBreathing = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBreathingState('idle');
    setCountdown(0);
  };
  
  const resetExercise = () => {
    setIsRunning(false);
    stopBreathing();
    setCycles(0);
  };
  
  const getBreathingInstructions = () => {
    switch (breathingState) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'rest':
        return 'Rest';
      default:
        return 'Get ready';
    }
  };
  
  const getCircleSize = () => {
    switch (breathingState) {
      case 'inhale':
        return { scale: 1 };
      case 'hold':
        return { scale: 1 };
      case 'exhale':
        return { scale: 0.8 };
      case 'rest':
        return { scale: 0.8 };
      default:
        return { scale: 0.9 };
    }
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
          Breathing Exercise
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Take a moment to breathe and relax
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Breathing Animation */}
        <Card className="md:col-span-2" variant="glass">
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              animate={getCircleSize()}
              transition={{
                duration: breathingState === 'inhale' 
                  ? selectedPattern.inhale 
                  : breathingState === 'exhale' 
                    ? selectedPattern.exhale 
                    : 0.5,
                ease: breathingState === 'inhale' 
                  ? 'easeIn' 
                  : breathingState === 'exhale' 
                    ? 'easeOut' 
                    : 'linear',
              }}
              className={`rounded-full flex items-center justify-center mb-8 
                ${breathingState === 'idle' 
                  ? 'bg-primary-700' 
                  : selectedPattern.color} transition-colors`}
              style={{ width: '280px', height: '280px' }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {isRunning ? countdown : ''}
                </div>
                <div className={`text-lg font-medium 
                  ${isRunning ? 'text-white' : 'text-accent-200'}
                `}>
                  {isRunning ? getBreathingInstructions() : 'Press start'}
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center justify-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-slate-800 text-white w-14 h-14 rounded-full flex items-center justify-center"
                onClick={resetExercise}
              >
                <SkipBack size={24} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause size={30} /> : <Play size={30} />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-slate-200 text-slate-700 w-14 h-14 rounded-full flex items-center justify-center"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </motion.button>
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-sm text-slate-500 mb-1">Total cycles completed</div>
              <div className="text-2xl font-semibold text-slate-800">{cycles}</div>
            </div>
          </div>
        </Card>
        
        {/* Breathing Patterns */}
        <Card title="Breathing Patterns">
          <div className="space-y-3">
            {breathingPatterns.map((pattern) => (
              <motion.button
                key={pattern.name}
                className={`w-full p-3 rounded-lg flex flex-col items-start transition-colors ${
                  selectedPattern.name === pattern.name
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
                onClick={() => setSelectedPattern(pattern)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-slate-800">{pattern.name}</span>
                  <Wind size={18} className="text-primary-500" />
                </div>
                
                <div className="flex mt-2 items-center space-x-1">
                  <div className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                    In: {pattern.inhale}s
                  </div>
                  {pattern.hold1 > 0 && (
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Hold: {pattern.hold1}s
                    </div>
                  )}
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    Out: {pattern.exhale}s
                  </div>
                  {pattern.hold2 > 0 && (
                    <div className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      Rest: {pattern.hold2}s
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Benefits of Deep Breathing</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Reduces stress and anxiety</li>
              <li>• Improves focus and concentration</li>
              <li>• Lowers blood pressure</li>
              <li>• Enhances sleep quality</li>
              <li>• Boosts immune system</li>
            </ul>
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card title="How to Practice" subtitle="Get the most from your breathing exercises">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Find a Quiet Space</h3>
              <p className="text-sm text-slate-600">
                Choose a comfortable place where you won't be disturbed. Sit or lie down in a relaxed position.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Focus Your Mind</h3>
              <p className="text-sm text-slate-600">
                Close your eyes and clear your mind. Focus only on your breathing pattern and the sensations in your body.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Be Consistent</h3>
              <p className="text-sm text-slate-600">
                Practice for 5-10 minutes daily. Regular breathing exercises yield the most benefits for your health.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BreathingExercise;