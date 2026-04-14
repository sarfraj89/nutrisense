import { useState } from 'react';
import { ImageDropzone } from '../components/ImageDropzone';
import { MealResultCard } from '../components/MealResultCard';
import { analyzeFood, AnalysisResult } from '../lib/gemini';
import { Loader2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

type Goal = 'lose_weight' | 'eat_clean' | 'build_muscle';

const GOALS: { id: Goal; label: string }[] = [
  { id: 'lose_weight', label: 'Lose Weight' },
  { id: 'eat_clean', label: 'Eat Clean' },
  { id: 'build_muscle', label: 'Build Muscle' },
];

export default function AnalyzePage() {
  const [tab, setTab] = useState<'text' | 'image'>('text');
  const [goal, setGoal] = useState<Goal>('lose_weight');
  const [textInput, setTextInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const g = goal.replace('_', ' ');
      const res = await analyzeFood(
        g, 
        tab === 'text' ? textInput : undefined, 
        tab === 'image' && image ? image : undefined
      );
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = tab === 'text' ? textInput.trim() : !!image;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Analyze Food</h1>
        <p className="text-text-muted text-lg">Find out exactly what you're eating and get a healthier alternative.</p>
      </header>

      {/* Tab Switcher */}
      <div className="flex bg-surface rounded-xl p-1 border border-border">
        {(['text', 'image'] as const).map((t) => (
          <button
            key={t}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              tab === t ? "bg-[#2A2A2A] text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
            )}
            onClick={() => setTab(t)}
          >
            {t === 'text' ? 'Text Description' : 'Upload Image'}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <section>
        {tab === 'text' ? (
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="e.g. A double cheeseburger with medium fries and a soda"
            className="w-full h-32 bg-surface border border-border rounded-xl p-4 focus:outline-none focus:border-green text-text-primary placeholder:text-border transition-colors animate-in fade-in slide-in-from-top-2"
          />
        ) : (
          <ImageDropzone onImageSelected={setImage} />
        )}
      </section>

      {/* Goal Selector */}
      <section>
        <label className="block text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Your Goal</label>
        <div className="flex flex-wrap gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                goal === g.id 
                  ? "border-green text-green bg-green/10" 
                  : "border-border text-text-muted hover:border-gray-500 hover:text-text-primary"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !isFormValid}
        className="w-full bg-text-primary text-[#0A0A0A] font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {loading ? 'Analyzing...' : 'Analyze Meal'}
      </button>

      {error && (
        <div className="p-4 bg-red/10 border border-red/30 rounded-xl text-red animate-in zoom-in-95">
          {error}
        </div>
      )}

      {result && <MealResultCard result={result} />}
    </div>
  );
}
