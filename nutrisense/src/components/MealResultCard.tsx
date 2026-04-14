import { useState, useEffect } from 'react';
import { HealthScoreCircle } from './HealthScoreCircle';
import { MacroPills } from './MacroPills';
import { Leaf } from 'lucide-react';
import { AnalysisResult } from '../lib/gemini';
import { saveMeal } from '../lib/storage';

interface MealResultCardProps {
  result: AnalysisResult;
}

export function MealResultCard({ result }: MealResultCardProps) {
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // trigger animation
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, [result]);

  const handleSave = async () => {
    try {
      await saveMeal({
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
      alert("Failed to save meal to database.");
    }
  };

  return (
    <div className={`transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} bg-surface/50 border border-border rounded-2xl p-6`}>
      <h2 className="font-display text-2xl font-bold mb-6">{result.name}</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-6">
        <HealthScoreCircle score={result.health_score} />
        
        <div className="flex-1 flex flex-col gap-4 w-full">
          <MacroPills 
            calories={result.calories} 
            protein={result.protein_g}
            carbs={result.carbs_g}
            fat={result.fat_g}
          />
          <p className="text-text-primary text-lg">{result.health_verdict}</p>
        </div>
      </div>

      {result.healthier_swap && (
        <div className="border border-orange/30 bg-orange/5 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-orange font-bold mb-2">
            <Leaf className="w-5 h-5" />
            <span>Healthier Swap Option</span>
          </div>
          <h3 className="font-bold text-orange mb-1">{result.healthier_swap}</h3>
          <p className="text-sm text-text-muted">{result.swap_reason}</p>
        </div>
      )}

      <button 
        onClick={handleSave} 
        disabled={saved}
        className={`w-full py-3 rounded-xl font-bold transition-colors ${saved ? 'bg-green/20 text-green cursor-not-allowed' : 'bg-green text-[#0A0A0A] hover:bg-green/90'}`}
      >
        {saved ? "Meal Logged!" : "Log this Meal"}
      </button>
    </div>
  );
}
