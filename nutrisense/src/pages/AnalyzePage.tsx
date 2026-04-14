import { useState } from 'react';
import { ImageDropzone } from '../components/ImageDropzone';
import { MealResultCard } from '../components/MealResultCard';
import { analyzeFood, AnalysisResult } from '../lib/gemini';
import { Loader2 } from 'lucide-react';

type Goal = 'lose_weight' | 'eat_clean' | 'build_muscle';

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
      const res = await analyzeFood(g, tab === 'text' ? textInput : undefined, tab === 'image' && image ? image : undefined);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Analyze Food</h1>
        <p className="text-text-muted text-lg">Find out exactly what you're eating and get a healthier alternative.</p>
      </div>

      <div className="flex bg-surface rounded-xl p-1 border border-border">
        <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'text' ? 'bg-[#2A2A2A] text-text-primary' : 'text-text-muted hover:text-text-primary'}`} onClick={() => setTab('text')}>Text Description</button>
        <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'image' ? 'bg-[#2A2A2A] text-text-primary' : 'text-text-muted hover:text-text-primary'}`} onClick={() => setTab('image')}>Upload Image</button>
      </div>

      {tab === 'text' ? (
        <textarea
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="e.g. A double cheeseburger with medium fries and a soda"
          className="w-full h-32 bg-surface border border-border rounded-xl p-4 focus:outline-none focus:border-green text-text-primary placeholder:text-border"
        />
      ) : (
        <ImageDropzone onImageSelected={setImage} />
      )}

      <div>
        <label className="block text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Your Goal</label>
        <div className="flex flex-wrap gap-3">
          {['lose_weight', 'eat_clean', 'build_muscle'].map(g => (
            <button
              key={g}
              onClick={() => setGoal(g as Goal)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${goal === g ? 'border-green text-green bg-green/10' : 'border-border text-text-muted hover:border-gray-500 hover:text-text-primary'}`}
            >
              {g === 'lose_weight' ? 'Lose Weight' : g === 'eat_clean' ? 'Eat Clean' : 'Build Muscle'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || (tab === 'text' && !textInput) || (tab === 'image' && !image)}
        className="w-full bg-text-primary text-[#0A0A0A] font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {loading ? 'Analyzing...' : 'Analyze Meal'}
      </button>

      {error && (
        <div className="p-4 bg-red/10 border border-red/30 rounded-xl text-red">
          {error}
        </div>
      )}

      {result && <MealResultCard result={result} />}
    </div>
  );
}
