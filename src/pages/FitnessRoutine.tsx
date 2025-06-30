import { useState, useEffect, useRef } from 'react';
import { useHealthData, ExerciseEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { Dumbbell, Plus, Play, Pause, X, Check, Clock, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FitnessRoutine = () => {
  const { exerciseRoutine, updateExerciseRoutine, toggleExerciseCompleted } = useHealthData();
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<ExerciseEntry>>({
    name: '',
    duration: 60
  });
  
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    setExercises(exerciseRoutine);
  }, [exerciseRoutine]);
  
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startTimer = (duration: number) => {
    setTimer(duration * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
    
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsTimerRunning(false);
          clearInterval(timerRef.current!);
          return 0;
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
  
  const resetTimer = () => {
    pauseTimer();
    setTimer(0);
    setActiveExercise(null);
  };
  
  const handleExerciseStart = (id: string, duration: number) => {
    setActiveExercise(id);
    setTimer(duration * 60); // Set timer to duration in seconds, but do not start
    setIsTimerRunning(false); // Ensure timer is not running until Play is pressed
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExercise.name || !newExercise.duration) return;
    
    const exercise: ExerciseEntry = {
      id: `ex-${Date.now()}`,
      name: newExercise.name,
      duration: newExercise.duration,
      completed: false
    };
    
    const updatedExercises = [...exercises, exercise];
    updateExerciseRoutine(updatedExercises);
    setShowAddForm(false);
    setNewExercise({
      name: '',
      duration: 60
    });
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setExercises(items);
    updateExerciseRoutine(items);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          Fitness Routine
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Track and time your workouts
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Timer */}
        <Card className="md:col-span-4" variant="glass">
          <div className="flex flex-col items-center py-4">
            <Dumbbell size={36} className="text-primary-400 mb-3" />
            
            <div className="w-full text-center">
              <h3 className="text-xl font-semibold text-white mb-6">Exercise Timer</h3>
              
              <div className="relative mb-6">
                <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  
                  {/* Progress circle */}
                  {timer > 0 && activeExercise && (
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{
                        strokeDashoffset: 283 * (1 - timer / (exercises.find(ex => ex.id === activeExercise)?.duration || 60) / 60)
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  {/* Timer text */}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    {timer > 0 ? formatTime(timer) : "00:00"}
                  </text>
                  
                  {/* Label text */}
                  <text
                    x="50"
                    y="65"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="#64748b"
                  >
                    {activeExercise ? exercises.find(ex => ex.id === activeExercise)?.name : "Select Exercise"}
                  </text>
                </svg>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
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
                    className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center"
                    onClick={() => {
                      if (activeExercise) {
                        const exercise = exercises.find(ex => ex.id === activeExercise);
                        if (exercise) {
                          if (timer === 0) {
                            startTimer(exercise.duration);
                          } else {
                            setIsTimerRunning(true);
                            if (timerRef.current !== null) {
                              clearInterval(timerRef.current);
                            }
                            timerRef.current = window.setInterval(() => {
                              setTimer((prevTimer) => {
                                if (prevTimer <= 1) {
                                  setIsTimerRunning(false);
                                  clearInterval(timerRef.current!);
                                  return 0;
                                }
                                return prevTimer - 1;
                              });
                            }, 1000);
                          }
                        }
                      }
                    }}
                    disabled={!activeExercise}
                  >
                    <Play size={24} />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-slate-200 text-slate-700 w-12 h-12 rounded-full flex items-center justify-center"
                  onClick={resetTimer}
                  disabled={!activeExercise}
                >
                  <RotateCcw size={20} />
                </motion.button>
              </div>
              
              <div className="text-sm text-slate-500">
                {activeExercise ? (
                  <>
                    {isTimerRunning ? "Keep going!" : timer > 0 ? "Timer paused" : "Ready to start"}
                  </>
                ) : (
                  "Select an exercise to begin"
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Exercise List */}
        <Card 
          title="Your Routine" 
          subtitle={`${exercises.length} exercises in your plan`}
          className="md:col-span-8"
        >
          {exercises.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-slate-500">No exercises in your routine yet</p>
              <p className="text-sm text-slate-400 mt-2">Add exercises to get started</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setShowAddForm(true)}
              >
                Add First Exercise
              </button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <ul
                    className="space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {exercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg border ${
                              activeExercise === exercise.id
                                ? 'bg-primary-700 border-primary-400'
                                : exercise.completed
                                  ? 'bg-green-900 border-green-400'
                                  : 'bg-surface-dark-300 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border mr-3 ${
                                    exercise.completed
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-white/20 text-transparent'
                                  }`}
                                  onClick={() => toggleExerciseCompleted(exercise.id)}
                                >
                                  <Check size={14} />
                                </button>
                                <div>
                                  <h4 className="font-medium text-white">{exercise.name}</h4>
                                  <div className="text-sm text-secondary flex items-center mt-1">
                                    <Clock size={14} className="mr-1" />
                                    {exercise.duration} min
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <button
                                  className={`btn btn-secondary text-sm px-3 py-1 ${
                                    activeExercise === exercise.id ? 'ring-2 ring-primary-400' : ''
                                  }`}
                                  onClick={() => handleExerciseStart(exercise.id, exercise.duration)}
                                >
                                  {activeExercise === exercise.id ? 'Selected' : 'Start'}
                                </button>
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
          
          <div className="mt-4">
            <button
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              <span>Add Exercise</span>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-surface-dark-300 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white">Routine Progress</h3>
              <span className="text-sm text-primary-400 font-medium">
                {exercises.filter(ex => ex.completed).length}/{exercises.length} completed
              </span>
            </div>
            <div className="w-full bg-surface-dark-200 rounded-full h-2.5">
              <div 
                className="bg-primary-500 h-2.5 rounded-full" 
                style={{ width: `${exercises.length > 0 ? (exercises.filter(ex => ex.completed).length / exercises.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Add Exercise Form */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl z-50 p-6 max-w-lg mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">Add Exercise</h3>
                <button
                  className="p-1 rounded-full hover:bg-slate-100"
                  onClick={() => setShowAddForm(false)}
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="exerciseName" className="block text-sm font-medium text-slate-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    id="exerciseName"
                    type="text"
                    className="input"
                    placeholder="e.g. Push-ups"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    className="input"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 1 })}
                    required
                  />
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
                    Add Exercise
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitnessRoutine;