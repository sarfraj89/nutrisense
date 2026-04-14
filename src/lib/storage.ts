import { AnalysisResult } from './gemini';
import { supabase } from './supabase';

export interface MealEntry extends AnalysisResult {
  id: string;
  timestamp: number;
}

export const saveMeal = async (meal: MealEntry): Promise<void> => {
  const { error } = await supabase
    .from('meals')
    .insert([
      {
        id: meal.id,
        timestamp: meal.timestamp,
        name: meal.name,
        calories: meal.calories,
        protein_g: meal.protein_g,
        carbs_g: meal.carbs_g,
        fat_g: meal.fat_g,
        health_score: meal.health_score,
        health_verdict: meal.health_verdict,
        healthier_swap: meal.healthier_swap,
        swap_reason: meal.swap_reason
      }
    ]);
  
  if (error) {
    console.error('Error saving meal:', error.message);
    throw new Error(error.message);
  }
};

export const getMeals = async (): Promise<MealEntry[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching meals:', error.message);
    return [];
  }

  return data as MealEntry[];
};

export const deleteMeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting meal:', error.message);
    throw new Error(error.message);
  }
};
