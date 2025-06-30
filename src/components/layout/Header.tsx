import { Menu, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 mr-3"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <motion.h1 
            className="font-bold text-xl text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={title}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h1>
        </div>
        
        {/* Desktop title */}
        <motion.h1 
          className="hidden md:block font-bold text-2xl text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={title}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          {/* Date display */}
          <div className="hidden sm:block bg-surface-dark-300 backdrop-blur-sm text-slate-200 px-4 py-2 text-sm font-medium rounded-xl border border-white/10">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <Settings size={20} />
            </motion.button>
            
            {/* User avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-glow-sm"
            >
              LS
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;