import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  loading?: boolean;
}

const getVariantClasses = (variant: string, loading: boolean): string => {
  const baseClasses = "px-6 py-3 text-white rounded-xl transform transition-all duration-300 shadow-lg font-bold text-base relative ";
  const hoverClasses = loading ? "" : "hover:scale-105 ";
  
  switch (variant) {
    case 'primary':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-purple-300/50';
    case 'secondary':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:shadow-gray-300/50';
    case 'success':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 hover:shadow-green-300/50';
    case 'danger':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-red-300/50';
    case 'warning':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-orange-300/50';
    case 'info':
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 hover:shadow-blue-300/50';
    default:
      return baseClasses + hoverClasses + 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 hover:shadow-gray-300/50';
  }
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  title = '',
  loading = false
}) => {
  const variantClasses = getVariantClasses(variant, loading);
  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      title={title}
      className={`${variantClasses} ${disabledClasses} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        )}
        {children}
      </div>
    </button>
  );
};

export default Button; 