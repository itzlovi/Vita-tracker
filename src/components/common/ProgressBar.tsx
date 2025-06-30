import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = 'bg-gradient-primary', 
  height = 12,
  showLabel = false,
  animate = true,
  className = '',
  variant = 'default'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getProgressClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'progress-bar-fill bg-gradient-primary';
      case 'glow':
        return `progress-bar-fill ${color} shadow-glow-md`;
      default:
        return `progress-bar-fill ${color}`;
    }
  };
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-white font-medium">{value} / {max}</span>
          <span className="text-secondary font-medium">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div 
        className="progress-bar"
        style={{ height: `${height}px` }}
      >
        <motion.div 
          className={getProgressClasses()}
          initial={{ width: animate ? 0 : `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: animate ? 0.2 : 0
          }}
        />
      </div>
      
      {/* Progress indicator */}
      {percentage > 0 && (
        <motion.div
          className="flex justify-end mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-primary-300 font-medium">
            {percentage >= 100 ? '🎉 Goal achieved!' : `${(100 - percentage).toFixed(0)}% to go`}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;