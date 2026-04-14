import { useState, useEffect } from 'react';
import { MealEntry, getMeals, deleteMeal } from '../lib/storage';
import { Trash2 } from 'lucide-react';
import { MacroPills } from '../components/MacroPills';

export default function LogPage() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-text-muted">Loading your meal data...</div>;
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

  const handleDelete = async (id: string) => {
    await deleteMeal(id);
    const data = await getMeals();
    setMeals(data);
  };

  const today = new Date().setHours(0,0,0,0);
  const todayMeals = meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === today);

  const totalCals = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalPro = todayMeals.reduce((acc, m) => acc + m.protein_g, 0);
  const totalCarbs = todayMeals.reduce((acc, m) => acc + m.carbs_g, 0);
  const totalFat = todayMeals.reduce((acc, m) => acc + m.fat_g, 0);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Meal Log</h1>
        <p className="text-text-muted text-lg">History of your analyzed meals.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Today's Totals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col"><span className="text-2xl font-bold text-text-primary">{totalCals}</span><span className="text-sm text-text-muted">kcal</span></div>
          <div className="flex flex-col"><span className="text-2xl font-bold text-text-primary">{totalPro}g</span><span className="text-sm text-text-muted">Protein</span></div>
          <div className="flex flex-col"><span className="text-2xl font-bold text-text-primary">{totalCarbs}g</span><span className="text-sm text-text-muted">Carbs</span></div>
          <div className="flex flex-col"><span className="text-2xl font-bold text-text-primary">{totalFat}g</span><span className="text-sm text-text-muted">Fat</span></div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {meals.length === 0 ? (
          <div className="py-20 text-center text-text-muted border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
            <p>No meals logged yet.</p>
          </div>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="bg-surface/50 border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${meal.health_score >= 70 ? 'bg-green/10 text-green' : meal.health_score >= 40 ? 'bg-orange/10 text-orange' : 'bg-red/10 text-red'}`}>
                    Score: {meal.health_score}
                  </span>
                </div>
                <div className="text-sm text-text-muted mb-3">
                  {new Date(meal.timestamp).toLocaleString(undefined, {
                    month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                  })}
                </div>
                <MacroPills calories={meal.calories} protein={meal.protein_g} carbs={meal.carbs_g} fat={meal.fat_g} />
              </div>
              <button onClick={() => handleDelete(meal.id)} className="p-2 text-text-muted hover:text-red hover:bg-red/10 rounded-lg transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
