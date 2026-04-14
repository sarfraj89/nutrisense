import { Link } from 'react-router-dom';
import { Camera, List, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 sm:pt-24 pb-12 space-y-12">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Smarter choices, <br className="hidden sm:block" />
          <span className="text-green">healthier habits.</span>
        </h1>
        <p className="text-text-muted text-lg sm:text-xl">
          Snap a meal photo or describe what you're eating to get instant nutrition breakdown, a health score, and smarter swap suggestions.
        </p>
        <div className="flex justify-center pt-4">
          <Link 
            to="/analyze" 
            className="group flex items-center justify-center gap-2 bg-green text-[#0A0A0A] px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shrink-0"
          >
            Analyze a Meal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 w-full pt-12 border-t border-border mt-12">
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="w-12 h-12 bg-green/10 text-green rounded-xl flex items-center justify-center mb-4">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Analyze</h3>
          <p className="text-text-muted text-sm">Upload a photo to instantly get nutrition facts and a health score from AI.</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center mb-4">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Log</h3>
          <p className="text-text-muted text-sm">Keep track of your meals, monitor macros, and build a history of your eating habits.</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <div className="w-12 h-12 bg-red/10 text-red rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">Habits</h3>
          <p className="text-text-muted text-sm">Review your weekly health score and view streaks to stay motivated.</p>
        </div>
      </div>
    </div>
  );
}
