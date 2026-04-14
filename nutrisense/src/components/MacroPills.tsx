
interface MacroPillsProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroPills({ calories, protein, carbs, fat }: MacroPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="bg-surface border border-border rounded-full px-3 py-1 flex items-center justify-center text-sm">
        <span className="text-text-muted mr-1">Calories</span>
        <span className="font-bold">{calories}</span>
      </div>
      <div className="bg-surface border border-border rounded-full px-3 py-1 flex items-center justify-center text-sm">
        <span className="text-text-muted mr-1">Protein</span>
        <span className="font-bold">{protein}g</span>
      </div>
      <div className="bg-surface border border-border rounded-full px-3 py-1 flex items-center justify-center text-sm">
        <span className="text-text-muted mr-1">Carbs</span>
        <span className="font-bold">{carbs}g</span>
      </div>
      <div className="bg-surface border border-border rounded-full px-3 py-1 flex items-center justify-center text-sm">
        <span className="text-text-muted mr-1">Fat</span>
        <span className="font-bold">{fat}g</span>
      </div>
    </div>
  );
}
