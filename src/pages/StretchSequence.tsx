import { useState, useEffect, useRef } from 'react';
import { useHealthData, StretchEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { StretchVertical as Stretch, Plus, Play, Pause, SkipForward, RotateCcw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const StretchSequence = () => {
  const { stretchSequence, updateStretchSequence } = useHealthData();
  const [stretches, setStretches] = useState<StretchEntry[]>([]);
  const [currentStretchIndex, setCurrentStretchIndex] = useState<number>(-1);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    setStretches(stretchSequence);
  }, [stretchSequence]);
  
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startTimer = (duration: number) => {
    setTimer(duration);
    setIsTimerRunning(true);
    
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // Timer finished, move to next stretch
          if (currentStretchIndex < stretches.length - 1) {
            setCurrentStretchIndex(currentStretchIndex + 1);
            return stretches[currentStretchIndex + 1].duration;
          } else {
            // End of sequence
            setIsTimerRunning(false);
            setCurrentStretchIndex(-1);
            clearInterval(timerRef.current!);
            return 0;
          }
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetSequence = () => {
    pauseTimer();
    setTimer(0);
    setCurrentStretchIndex(-1);
  };
  
  const startSequence = () => {
    if (stretches.length === 0) return;
    
    setCurrentStretchIndex(0);
    startTimer(stretches[0].duration);
  };
  
  const skipToNext = () => {
    if (currentStretchIndex < stretches.length - 1) {
      setCurrentStretchIndex(currentStretchIndex + 1);
      startTimer(stretches[currentStretchIndex + 1].duration);
    } else {
      resetSequence();
    }
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stretches);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStretches(items);
    updateStretchSequence(items);
  };
  
  const currentStretch = currentStretchIndex >= 0 ? stretches[currentStretchIndex] : null;
  
  // Calculate total duration of the sequence
  const totalDuration = stretches.reduce((total, stretch) => total + stretch.duration, 0);
  
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stretch Sequence
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Customize and follow your stretching routine
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Current Stretch */}
        <Card className="md:col-span-5" variant="glass">
          <div className="flex flex-col items-center py-4">
            <Stretch size={36} className="text-green-400 mb-3" />
            
            <div className="w-full text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Current Stretch</h3>
              
              <div className="mb-4 relative h-64 overflow-hidden rounded-lg">
                {currentStretch ? (
                  <img 
                    src={currentStretch.imageUrl} 
                    alt={currentStretch.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-surface-dark-200/80 rounded-xl flex flex-col items-center justify-center h-56 relative">
                    <p className="text-secondary">Select a stretch to begin</p>
                  </div>
                )}
                
                {currentStretch && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="w-full p-4 text-white">
                      <h4 className="font-semibold text-lg">{currentStretch.name}</h4>
                      <p className="text-white/80 text-sm">Hold for {currentStretch.duration} seconds</p>
                    </div>
                  </div>
                )}
                
                {currentStretch && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 backdrop-blur-sm">
                    <span className="font-mono font-bold">{timer}s</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center"
                  onClick={resetSequence}
                  disabled={currentStretchIndex === -1}
                >
                  <RotateCcw size={18} />
                </motion.button>
                
                {isTimerRunning ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center"
                    onClick={pauseTimer}
                  >
                    <Pause size={24} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center"
                    onClick={currentStretchIndex === -1 ? startSequence : () => startTimer(timer || currentStretch?.duration || 0)}
                  >
                    <Play size={24} />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center"
                  onClick={skipToNext}
                  disabled={currentStretchIndex === -1 || currentStretchIndex === stretches.length - 1}
                >
                  <SkipForward size={18} />
                </motion.button>
              </div>
              
              <div className="text-sm text-slate-500">
                {currentStretchIndex === -1 ? (
                  "Press play to start your routine"
                ) : (
                  <>
                    Stretch {currentStretchIndex + 1} of {stretches.length}
                  </>
                )}
              </div>
              
              <div className="mt-4">
                {currentStretchIndex > -1 && (
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${((currentStretchIndex) / stretches.length) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Stretch List */}
        <Card 
          title="Your Sequence" 
          subtitle={stretches.length > 0 ? `${stretches.length} stretches • ${Math.floor(totalDuration / 60)}:${(totalDuration % 60).toString().padStart(2, '0')} total` : 'Create your routine'}
          className="md:col-span-7"
        >
          {stretches.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-slate-500">No stretches in your sequence yet</p>
              <p className="text-sm text-slate-400 mt-2">Get started with the default sequence</p>
              <button
                className="btn btn-primary mt-4"
              >
                Use Default Sequence
              </button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stretches">
                {(provided) => (
                  <ul
                    className="space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {stretches.map((stretch, index) => (
                      <Draggable key={stretch.id} draggableId={stretch.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border ${
                              currentStretchIndex === index
                                ? 'bg-green-900 border-green-400'
                                : 'bg-surface-dark-300 border-white/10'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                <img 
                                  src={stretch.imageUrl} 
                                  alt={stretch.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{stretch.name}</h4>
                                <div className="text-sm text-secondary flex items-center mt-1">
                                  <Clock size={14} className="mr-1" />
                                  {stretch.duration} seconds
                                </div>
                              </div>
                              
                              <div className="ml-2 text-sm font-medium text-secondary">
                                #{index + 1}
                              </div>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          <div className="mt-4 text-sm text-slate-500">
            <p>Drag and drop to reorder your sequence</p>
          </div>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card title="Stretching Benefits" subtitle="Why regular stretching is important">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Improves Flexibility</h3>
              <p className="text-sm text-secondary">
                Regular stretching helps improve flexibility and range of motion in your joints.
              </p>
            </div>
            
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Prevents Injuries</h3>
              <p className="text-sm text-secondary">
                Proper stretching before and after exercise can help prevent injuries by warming up muscles.
              </p>
            </div>
            
            <div className="bg-surface-dark-300 p-4 rounded-lg">
              <h3 className="font-medium text-white mb-2">Reduces Muscle Tension</h3>
              <p className="text-sm text-secondary">
                Stretching helps reduce muscle tension and can alleviate stress and anxiety.
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-surface-dark-300 rounded-lg">
            <h3 className="font-medium text-white mb-2">Pro Tip</h3>
            <p className="text-sm text-secondary">
              Hold each stretch for at least 30 seconds for optimal benefits. Breathe deeply and relax into each position.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StretchSequence;