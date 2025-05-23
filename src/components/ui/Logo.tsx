import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 30,
  };

  return (
    <div className="flex items-center">
      <BookOpen 
        size={iconSizes[size]} 
        className="text-primary-700 mr-2" 
      />
      <span className={`font-semibold ${sizeClasses[size]} text-gray-900`}>
        Literary<span className="text-primary-700">Contest</span>
      </span>
    </div>
  );
};

export default Logo;