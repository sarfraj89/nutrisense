import { useState, useEffect, useCallback } from 'react';
import { MealEntry, getMeals, deleteMeal } from '../lib/storage';

export function useMeals() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMeals();
      setMeals(data || []);
      setError(null);
    } catch (e: any) {
      console.error('Failed to fetch meals:', e);
      setError(e.message || 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMeal = async (id: string) => {
    try {
      await deleteMeal(id);
      await fetchMeals();
    } catch (e: any) {
      console.error('Failed to delete meal:', e);
      throw e;
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    loading,
    error,
    refreshMeals: fetchMeals,
    removeMeal
  };
}
