import { useMeals } from '../hooks/useMeals';
import { calculateStreak, getWeeklyStats } from '../lib/health';
import { AlertCircle } from 'lucide-react';

export default function HabitsPage() {
  const { meals, loading, error } = useMeals();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-text-muted animate-pulse">
        Loading habits data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center flex flex-col items-center gap-4 text-red">
        <AlertCircle className="w-12 h-12" />
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  const streak = calculateStreak(meals);
  const weekScores = getWeeklyStats(meals);
  const scoredDays = weekScores.filter(d => d.hasLog);
  const weeklyAvg = scoredDays.length 
    ? Math.round(scoredDays.reduce((a, b) => a + b.avg, 0) / scoredDays.length) 
    : 0;

  const bestScore = meals.length ? Math.max(...meals.map(m => m.health_score)) : 0;
  const numLogged = meals.length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Weekly Habits</h1>
        <p className="text-text-muted text-lg">Track your eating patterns over time.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SummaryCard label="7-Day Average" value={weeklyAvg || '-'} colorClass={weeklyAvg >= 70 ? 'text-green' : weeklyAvg >= 40 ? 'text-orange' : 'text-red'} />
        <SummaryCard label="Streak" value={streak} suffix="days" colorClass="text-orange" />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Past 7 Days</h2>
        <div className="flex justify-between items-end h-40 pt-4">
          {weekScores.map((day, i) => (
            <BarItem key={i} day={day} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Best Score" value={bestScore || '-'} colorClass="text-green" />
        <MetricCard label="Total Meals" value={numLogged} suffix="logged" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, suffix, colorClass }: { label: string; value: string | number; suffix?: string; colorClass: string }) {
  return (
    <div className="flex-1 bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
      <span className="text-text-muted text-sm uppercase tracking-wider mb-2 font-bold">{label}</span>
      <div className="flex items-end gap-1">
        <span className={`text-6xl font-display font-bold ${colorClass}`}>{value}</span>
        {suffix && <span className="text-xl text-text-muted pb-2 font-bold">{suffix}</span>}
      </div>
    </div>
  );
}

function BarItem({ day }: { day: any }) {
  return (
    <div className="flex flex-col items-center gap-3 w-8 relative group">
      <span className="text-xs font-bold text-text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
        {day.avg || '-'}
      </span>
      <div 
        className={`w-full rounded-full transition-all duration-500 ${day.hasLog ? (day.avg >= 70 ? 'bg-green' : day.avg >= 40 ? 'bg-orange' : 'bg-red') : 'bg-border'}`}
        style={{ height: day.hasLog ? `${Math.max(day.avg, 10)}%` : '10%' }}
      />
      <span className="text-sm font-bold text-text-muted">{day.label}</span>
    </div>
  );
}

function MetricCard({ label, value, suffix, colorClass }: { label: string; value: string | number; suffix?: string; colorClass?: string }) {
  return (
    <div className="bg-surface/50 border border-border rounded-xl p-4">
      <span className="text-sm text-text-muted font-bold block mb-1">{label}</span>
      <span className={`text-2xl font-bold ${colorClass || 'text-text-primary'}`}>
        {value} {suffix && <span className="text-base text-text-muted font-normal">{suffix}</span>}
      </span>
    </div>
  );
}
