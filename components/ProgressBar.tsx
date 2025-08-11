'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export default function ProgressBar({ 
  current, 
  total, 
  label, 
  className = '', 
  showPercentage = true,
  animated = true
}: ProgressBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const percentage = Math.min((current / total) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(displayPercentage)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill transition-all duration-1000 ease-out"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">
            {current} / {total} ({Math.round(displayPercentage)}%)
          </span>
        </div>
      )}
    </div>
  );
}