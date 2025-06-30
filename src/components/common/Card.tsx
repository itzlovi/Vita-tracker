import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'glass';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  className = '', 
  onClick,
  variant = 'default'
}) => {
  const getCardClasses = () => {
    const baseClasses = `card ${onClick ? 'cursor-pointer hover:shadow-card-hover' : ''} ${className}`;
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-card`;
      case 'glass':
        return `${baseClasses} glass-effect`;
      default:
        return baseClasses;
    }
  };

  return (
    <motion.div
      className={getCardClasses()}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02, y: -4 } : { y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold text-lg text-white mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-secondary font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary/20 text-primary-300 ml-4">
              {icon}
            </div>
          )}
        </div>
      )}
      <div className="text-primary">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;