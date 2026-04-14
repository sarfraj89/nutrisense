import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export function HealthScoreCircle({ score }: { score: number }) {
  const [offset, setOffset] = useState(251); // 2 * pi * r (r=40)
  
  const circumference = 2 * Math.PI * 40;
  
  let colorClass = "text-red"; // <40
  if (score >= 70) colorClass = "text-green";
  else if (score >= 40) colorClass = "text-orange";

  useEffect(() => {
    // Animate stroke
    const progress = score / 100;
    const dashoffset = circumference * (1 - progress);
    
    // Add small delay to trigger animation after mount
    const timeout = setTimeout(() => {
      setOffset(dashoffset);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="text-border"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("animate-score-fill drop-shadow-md", colorClass)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl leading-none">{score}</span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider mt-1">Score</span>
      </div>
    </div>
  );
}
