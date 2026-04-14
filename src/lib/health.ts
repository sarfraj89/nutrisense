import { MealEntry } from './storage';

/**
 * Calculates total nutrition values for a given set of meals.
 */
export function calculateTotals(meals: MealEntry[]) {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein_g,
      carbs: acc.carbs + m.carbs_g,
      fat: acc.fat + m.fat_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Filters meals that occurred today.
 */
export function getTodayMeals(meals: MealEntry[]) {
  const today = new Date().setHours(0, 0, 0, 0);
  return meals.filter((m) => new Date(m.timestamp).setHours(0, 0, 0, 0) === today);
}

/**
 * Calculates current health streak (consecutive days with at least one meal log).
 */
export function calculateStreak(meals: MealEntry[]) {
  let streak = 0;
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    
    const hasMealToday = meals.some(
      (m) => new Date(m.timestamp).setHours(0, 0, 0, 0) === d.getTime()
    );
    
    if (hasMealToday) {
      streak++;
    } else if (i !== 0) {
      // If we miss a day (and it's not today yet because today might just be starting), break streak
      break;
    }
  }
  return streak;
}

/**
 * Gets average scores and log status for the last 7 days.
 */
export function getWeeklyStats(meals: MealEntry[]) {
  const days = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  return days.map((day) => {
    const dayMeals = meals.filter(
      (m) => new Date(m.timestamp).setHours(0, 0, 0, 0) === day.getTime()
    );
    const avg = dayMeals.length
      ? dayMeals.reduce((a, b) => a + b.health_score, 0) / dayMeals.length
      : 0;
      
    return {
      label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][day.getDay()],
      avg: Math.round(avg),
      hasLog: dayMeals.length > 0,
    };
  });
}
