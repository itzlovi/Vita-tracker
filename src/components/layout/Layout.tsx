import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BarChart2, Droplets, Wind, Utensils, Moon, Dumbbell, StretchVertical as Stretch, BookHeart, Weight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';

type NavItem = {
  to: string;
  label: string;
  icon: JSX.Element;
  description: string;
};

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} />, description: 'Overview & insights' },
  { to: '/mood', label: 'Mood', icon: <BarChart2 size={20} />, description: 'Track emotions' },
  { to: '/water', label: 'Water', icon: <Droplets size={20} />, description: 'Hydration goals' },
  { to: '/breathing', label: 'Breathing', icon: <Wind size={20} />, description: 'Mindful exercises' },
  { to: '/meals', label: 'Meals', icon: <Utensils size={20} />, description: 'Nutrition tracking' },
  { to: '/sleep', label: 'Sleep', icon: <Moon size={20} />, description: 'Rest patterns' },
  { to: '/fitness', label: 'Fitness', icon: <Dumbbell size={20} />, description: 'Workout routines' },
  { to: '/stretch', label: 'Stretch', icon: <Stretch size={20} />, description: 'Flexibility sessions' },
  { to: '/journal', label: 'Journal', icon: <BookHeart size={20} />, description: 'Mental wellness' },
  { to: '/weight', label: 'Weight', icon: <Weight size={20} />, description: 'Body tracking' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  
  useEffect(() => {
    // Find the current page label based on path
    const currentNav = navItems.find(item => item.to === location.pathname);
    setCurrentPage(currentNav?.label || 'VitaTrack');
    
    // Close mobile nav when route changes
    setIsMobileNavOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-midnight">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/10 glass-effect">
        <div className="p-6 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-glow bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent mb-2">
              VitaTrack
            </h1>
            <p className="text-sm text-secondary font-medium">Your wellness companion</p>
          </motion.div>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={item.to}
                  className={`nav-item ${
                    location.pathname === item.to ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <motion.div 
            className="p-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl border border-white/10 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">✨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Premium Tips</p>
                <p className="text-xs text-slate-300">Unlock insights</p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Your wellness journey is getting better every day! Keep tracking for personalized insights.
            </p>
          </motion.div>
        </div>
      </aside>
      
      {/* Mobile header and content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title={currentPage} 
          onMenuClick={() => setIsMobileNavOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
        
        {/* Enhanced Mobile bottom navigation */}
        <nav className="md:hidden glass-effect border-t border-white/10 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center p-3 transition-all duration-300 rounded-lg ${
                  location.pathname === item.to
                    ? 'text-primary-300 bg-primary-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-lg ${
                  location.pathname === item.to ? 'bg-primary-500/30' : ''
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      {/* Enhanced Mobile slide-in navigation */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileNavOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-80 glass-effect z-50 border-l border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="font-bold text-xl text-white">Navigation</h2>
                  <p className="text-sm text-secondary">Choose your destination</p>
                </div>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="p-6">
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        className={`nav-item ${
                          location.pathname === item.to ? 'active' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-slate-400">{item.description}</div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;