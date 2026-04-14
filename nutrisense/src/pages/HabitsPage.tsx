import { useState, useEffect } from 'react';
import { MealEntry, getMeals } from '../lib/storage';

export default function HabitsPage() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-text-muted">Loading habits data...</div>;
  }

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const data = await getMeals();
      setMeals(data);
      setLoading(false);
    };
    fetchMeals();
  }, []);

  const getWeekScores = () => {
    const days = [];
    const now = new Date();
    // 7 days ending today
    for(let i=6; i>=0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      days.push(d);
    }

    return days.map(day => {
      const dayMeals = meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === day.getTime());
      const avg = dayMeals.length ? dayMeals.reduce((a, b) => a + b.health_score, 0) / dayMeals.length : 0;
      return {
        label: ['S','M','T','W','T','F','S'][day.getDay()],
        avg: Math.round(avg),
        hasLog: dayMeals.length > 0
      };
    });
  };

  const weekScores = getWeekScores();
  const scoredDays = weekScores.filter(d => d.hasLog);
  const weeklyAvg = scoredDays.length ? Math.round(scoredDays.reduce((a, b) => a + b.avg, 0) / scoredDays.length) : 0;

  // Simple streak calculation (consecutive days with logs ending today or yesterday)
  let streak = 0;
  const now = new Date();
  for(let i=0; i<30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    const has = meals.some(m => new Date(m.timestamp).setHours(0,0,0,0) === d.getTime());
    if (has) {
      streak++;
    } else if (i !== 0) {
      // Break if missing log and it's not today.
      break; 
    }
  }

  const bestScore = meals.length ? Math.max(...meals.map(m => m.health_score)) : 0;
  const numLogged = meals.length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Weekly Habits</h1>
        <p className="text-text-muted text-lg">Track your eating patterns over time.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
          <span className="text-text-muted text-sm uppercase tracking-wider mb-2 font-bold">7-Day Average</span>
          <span className={`text-6xl font-display font-bold ${weeklyAvg >= 70 ? 'text-green' : weeklyAvg >= 40 ? 'text-orange' : 'text-red'}`}>{weeklyAvg || '-'}</span>
        </div>
        <div className="flex-1 bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
          <span className="text-text-muted text-sm uppercase tracking-wider mb-2 font-bold">Streak</span>
          <div className="flex items-end gap-1">
            <span className="text-6xl font-display font-bold text-orange">{streak}</span>
            <span className="text-xl text-text-muted pb-2 font-bold">days</span>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Past 7 Days</h2>
        <div className="flex justify-between items-end h-40 pt-4">
          {weekScores.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3 w-8 relative group">
              <span className="text-xs font-bold text-text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">{day.avg || '-'}</span>
              <div 
                className={`w-full rounded-full transition-all duration-500 ${day.hasLog ? (day.avg >= 70 ? 'bg-green' : day.avg >= 40 ? 'bg-orange' : 'bg-red') : 'bg-border'}`}
                style={{ height: day.hasLog ? `${Math.max(day.avg, 10)}%` : '10%' }}
              />
              <span className="text-sm font-bold text-text-muted">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/50 border border-border rounded-xl p-4">
          <span className="text-sm text-text-muted font-bold block mb-1">Best Score</span>
          <span className="text-2xl font-bold text-green">{bestScore || '-'}</span>
        </div>
        <div className="bg-surface/50 border border-border rounded-xl p-4">
          <span className="text-sm text-text-muted font-bold block mb-1">Total Meals</span>
          <span className="text-2xl font-bold text-text-primary">{numLogged} <span className="text-base text-text-muted font-normal">logged</span></span>
        </div>
      </div>

    </div>
  );
}
