import React from 'react';

export const Card = ({ className = '', children, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${onClick ? 'hover:shadow-lg cursor-pointer transform hover:-translate-y-1' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children }) => {
  return (
    <div className={`p-5 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = '', children }) => {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children }) => {
  return (
    <div className={`p-5 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};