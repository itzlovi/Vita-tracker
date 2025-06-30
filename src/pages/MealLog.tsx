import { useState, useEffect } from 'react';
import { useHealthData, MealEntry } from '../context/HealthDataContext';
import Card from '../components/common/Card';
import { Utensils, Plus, Search, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const MealLog = () => {
  const { mealEntries, addMealEntry } = useHealthData();
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [todayCalories, setTodayCalories] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<MealEntry>>({
    name: '',
    calories: 0,
    type: 'breakfast',
    time: format(new Date(), 'HH:mm')
  });
  
  useEffect(() => {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Filter meals for today
    const meals = mealEntries.filter(entry => entry.date === today);
    setTodayMeals(meals);
    
    // Calculate total calories
    const calories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    setTodayCalories(calories);
  }, [mealEntries]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const meal: MealEntry = {
      id: `meal-${Date.now()}`,
      date: today,
      name: newMeal.name || '',
      calories: newMeal.calories || 0,
      type: newMeal.type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      time: newMeal.time || format(new Date(), 'HH:mm')
    };
    
    addMealEntry(meal);
    setShowAddForm(false);
    setNewMeal({
      name: '',
      calories: 0,
      type: 'breakfast',
      time: format(new Date(), 'HH:mm')
    });
  };
  
  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800';
      case 'lunch':
        return 'bg-green-100 text-green-800';
      case 'dinner':
        return 'bg-indigo-100 text-indigo-800';
      case 'snack':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
          Meal Log
        </motion.h1>
        <motion.p 
          className="text-secondary text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Track your food intake and calories
        </motion.p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Today's Summary */}
        <Card className="md:col-span-4" variant="glass">
          <div className="flex flex-col items-center py-4">
            <Utensils size={36} className="text-accent-400 mb-3" />
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-1">Today's Calories</h3>
              <p className="text-3xl font-bold text-accent-400 mb-2">{todayCalories}</p>
              <p className="text-sm text-secondary">
                {todayCalories < 1500 
                  ? 'Below recommended intake'
                  : todayCalories > 2500
                    ? 'Above recommended intake'
                    : 'Within recommended range'
                }
              </p>
            </div>
            
            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-secondary">Meal Breakdown</span>
                <span className="text-sm text-muted">Calories</span>
              </div>
              
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                const meals = todayMeals.filter(meal => meal.type === type);
                const typeCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
                
                return (
                  <div key={type} className="flex justify-between items-center py-2 border-b border-white/10">
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        type === 'breakfast' ? 'bg-yellow-400' : 
                        type === 'lunch' ? 'bg-green-400' : 
                        type === 'dinner' ? 'bg-indigo-400' : 
                        'bg-orange-400'
                      }`}></span>
                      <span className="capitalize text-secondary">{type}</span>
                      <span className="text-muted text-xs ml-2">({meals.length} items)</span>
                    </div>
                    <span className="font-medium text-white">{typeCalories}</span>
                  </div>
                );
              })}
            </div>
            
            <button
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              <span>Add Meal</span>
            </button>
          </div>
        </Card>
        
        {/* Today's Meals */}
        <Card 
          title="Today's Meals" 
          subtitle={`${todayMeals.length} entries`}
          className="md:col-span-8"
          variant="glass"
        >
          {todayMeals.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-slate-500">No meals logged today</p>
              <p className="text-sm text-slate-400 mt-2">Add your first meal to get started</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setShowAddForm(true)}
              >
                Add First Meal
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayMeals.map((meal) => (
                <motion.div 
                  key={meal.id}
                  className="py-3 px-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium rounded-full px-2 py-1 ${getMealTypeColor(meal.type)}`}>
                          {meal.type}
                        </span>
                        <span className="text-slate-500 text-sm ml-2">{meal.time}</span>
                      </div>
                      <h4 className="font-medium mt-1">{meal.name}</h4>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold mr-3">{meal.calories} cal</span>
                      <div className="flex space-x-1">
                        <button className="p-1 rounded-full hover:bg-slate-100">
                          <Edit2 size={14} className="text-slate-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-slate-100">
                          <Trash2 size={14} className="text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Meal Suggestions */}
      <div className="mt-6">
        <Card title="Meal Suggestions" subtitle="Based on your nutrition needs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-2">
            {[
              {
                name: 'Avocado Toast',
                calories: 350,
                image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=300',
                type: 'breakfast'
              },
              {
                name: 'Greek Salad Bowl',
                calories: 420,
                image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=300',
                type: 'lunch'
              },
              {
                name: 'Grilled Salmon',
                calories: 580,
                image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=300',
                type: 'dinner'
              }
            ].map((suggestion, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <span className={`text-xs font-medium rounded-full px-2 py-1 ${getMealTypeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </span>
                  <h4 className="font-medium mt-2">{suggestion.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">{suggestion.calories} calories</span>
                    <button
                      className="text-xs text-primary-600 font-medium"
                      onClick={() => {
                        setNewMeal({
                          name: suggestion.name,
                          calories: suggestion.calories,
                          type: suggestion.type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                          time: format(new Date(), 'HH:mm')
                        });
                        setShowAddForm(true);
                      }}
                    >
                      Add to Log
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Add Meal Modal */}
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
                <h3 className="text-xl font-semibold text-slate-800">Add Meal</h3>
                <button
                  className="p-1 rounded-full hover:bg-slate-100"
                  onClick={() => setShowAddForm(false)}
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="mealType" className="block text-sm font-medium text-slate-700 mb-1">
                    Meal Type
                  </label>
                  <select
                    id="mealType"
                    className="input"
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value as any })}
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="mealName" className="block text-sm font-medium text-slate-700 mb-1">
                    Meal Name
                  </label>
                  <input
                    id="mealName"
                    type="text"
                    className="input"
                    placeholder="e.g. Greek Yogurt with Berries"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="calories" className="block text-sm font-medium text-slate-700 mb-1">
                      Calories
                    </label>
                    <input
                      id="calories"
                      type="number"
                      className="input"
                      placeholder="e.g. 350"
                      min="0"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      className="input"
                      value={newMeal.time}
                      onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Save Meal
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealLog;