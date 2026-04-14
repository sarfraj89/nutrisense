# ⚙️ WORKFLOW.md — Build Order for NutriSense

> Follow this exactly. Each phase is a commit checkpoint.

---

## Phase 0 — Project Setup (15 min)

```bash
npx create-next-app@latest nutrisense --typescript --tailwind --app --eslint
cd nutrisense
npx shadcn@latest init
npx shadcn@latest add button card input badge skeleton tabs
npm install @anthropic-ai/sdk
```

**.env.local**
```
ANTHROPIC_API_KEY=your_key_here
```

**Commit:** `chore: project scaffold`

---

## Phase 1 — Core Layout + Design System (20 min)

### 1.1 Global styles (`app/globals.css`)
- Set dark background `#0A0A0A`
- Import Clash Display from Fontshare CDN
- Import DM Sans from Google Fonts
- Define CSS vars: `--green: #22C55E`, `--orange: #F97316`, `--surface: #141414`, `--border: #2A2A2A`

### 1.2 Root layout (`app/layout.tsx`)
- Set dark theme class on `<html>`
- Add top nav: Logo (NutriSense) + nav links (Analyze / Log / Habits)
- Mobile-responsive hamburger

### 1.3 Landing page (`app/page.tsx`)
- Hero: Big headline + subtext + "Analyze a Meal" CTA button
- 3 feature cards below: Analyze · Log · Habit Score
- Keep it one-screen on desktop

**Commit:** `feat: layout and design system`

---

## Phase 2 — AI Analyzer (Core Feature) (40 min)

### 2.1 API Route (`app/api/analyze/route.ts`)

```typescript
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  const { description, imageBase64, goal } = await req.json()
  
  const client = new Anthropic()
  
  const content = imageBase64
    ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
       { type: 'text', text: buildPrompt(description, goal) }]
    : [{ type: 'text', text: buildPrompt(description, goal) }]

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{ role: 'user', content }]
  })

  const raw = msg.content[0].text
  const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
  return Response.json(json)
}

function buildPrompt(description: string, goal: string) {
  return `You are a nutrition expert. User goal: ${goal || 'eat healthy'}.
The user ate: ${description || 'the food in this image'}.
Return ONLY valid JSON with no extra text:
{
  "name": "food name",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "health_score": number (0-100),
  "health_verdict": "one sentence verdict",
  "healthier_swap": "specific alternative food",
  "swap_reason": "why it's better"
}`
}
```

### 2.2 Analyze Page (`app/analyze/page.tsx`)

**UI sections:**
1. **Input Area** — Toggle between Text tab and Image tab
   - Text: `<textarea>` → "What did you eat?"
   - Image: drag-drop zone with `FileReader` → preview thumbnail
2. **Goal Selector** — 3 pill buttons: Lose Weight · Eat Clean · Build Muscle (persisted to localStorage)
3. **Analyze Button** — loading spinner while API call in flight
4. **Results Card** (slides up after response):
   - Big health score circle (colored: green >70, orange 40-70, red <40)
   - Macro pills: Calories · Protein · Carbs · Fat
   - Health verdict text
   - Swap suggestion box (highlighted in orange)
   - "Log this Meal" button

**Commit:** `feat: analyzer page + AI API route`

---

## Phase 3 — Meal Log (20 min)

### 3.1 Storage utility (`lib/storage.ts`)

```typescript
export interface MealEntry {
  id: string
  timestamp: number
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  health_score: number
}

export const saveMeal = (meal: MealEntry) => {
  const existing = getMeals()
  localStorage.setItem('meals', JSON.stringify([meal, ...existing]))
}

export const getMeals = (): MealEntry[] => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('meals') || '[]')
}
```

### 3.2 Log Page (`app/log/page.tsx`)
- Today's totals bar: Calories / Protein / Carbs / Fat
- List of meal cards (name, time, health score badge, macros)
- Delete button per entry
- Empty state illustration if no meals logged

**Commit:** `feat: meal log with localStorage`

---

## Phase 4 — Weekly Habits (15 min)

### 4.1 Habits Page (`app/habits/page.tsx`)
- Weekly average health score (big number)
- 7-day bar showing daily avg score (simple CSS bars, no chart lib)
- Habit streak: "X days in a row you logged meals"
- 3 simple insight callouts (best day, worst day, most logged food)

**Commit:** `feat: weekly habits page`

---

## Phase 5 — Polish + Deploy (20 min)

### 5.1 Animations
- Add `transition-all duration-300` on results card reveal
- Subtle `animate-pulse` on loading state
- Health score circle: CSS `stroke-dasharray` animated fill

### 5.2 Mobile QA
- Test all pages on mobile viewport
- Fix any overflow / padding issues

### 5.3 Deploy
```bash
git push origin main
# Connect repo to Vercel → set ANTHROPIC_API_KEY env var → Deploy
```

**Commit:** `feat: polish + production ready`

---

## Total Estimated Time: ~2 hours

| Phase | Time |
|---|---|
| 0 — Setup | 15 min |
| 1 — Layout | 20 min |
| 2 — Analyzer (core) | 40 min |
| 3 — Meal Log | 20 min |
| 4 — Habits | 15 min |
| 5 — Polish + Deploy | 20 min |