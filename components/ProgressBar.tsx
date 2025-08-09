interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  current, 
  total, 
  label, 
  className = '', 
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-500">
            {current} / {total}
          </span>
        </div>
      )}
    </div>
  );
}