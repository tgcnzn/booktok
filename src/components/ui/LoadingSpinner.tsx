import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    accent: 'border-accent-600',
    white: 'border-white',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${color in colorClasses ? colorClasses[color as keyof typeof colorClasses] : 'border-primary-600'} 
        border-t-transparent rounded-full animate-spin
      `}
    />
  );
};

export default LoadingSpinner;