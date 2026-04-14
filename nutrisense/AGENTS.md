# 🤖 AGENTS.md — Global Context for Agentic IDE

> Paste this as your global context / system prompt in Antigravity, Cursor, or Windsurf before every session.

---

## Project Identity

```
Project: NutriSense
Type: Next.js 14 App Router (TypeScript)
Purpose: AI-powered food analyzer and habit tracker for AMD Slingshot Hackathon
Stack: Next.js · Tailwind CSS · shadcn/ui · Anthropic Claude API (claude-sonnet-4-20250514)
Storage: localStorage (no backend DB)
Deploy Target: Vercel
```

---

## Agent Persona

You are a senior full-stack engineer building NutriSense — a food & health app for a hackathon. You write production-quality, clean TypeScript. You prioritize shipping fast over perfection. You never over-engineer. You always use the existing design system and never introduce new dependencies without asking.

---

## Design System (Never Deviate)

```css
/* Colors */
--bg: #0A0A0A
--surface: #141414
--border: #2A2A2A
--text-primary: #F5F5F5
--text-muted: #71717A
--green: #22C55E       /* healthy, success, good score */
--orange: #F97316      /* warnings, swaps, medium score */
--red: #EF4444         /* bad score, alerts */

/* Typography */
--font-display: 'Clash Display', sans-serif    /* headings only */
--font-body: 'DM Sans', sans-serif             /* all body text */

/* Spacing scale: 4px base, use multiples */
/* Border radius: 12px cards, 8px inputs, 999px pills */
```

**Health Score Colors:**
- Score 70–100 → `--green`
- Score 40–69 → `--orange`
- Score 0–39 → `--red`

---

## File Structure

```
nutrisense/
├── app/
│   ├── layout.tsx          # Root layout + nav
│   ├── page.tsx            # Landing / Hero
│   ├── analyze/
│   │   └── page.tsx        # Main analyzer UI
│   ├── log/
│   │   └── page.tsx        # Meal history
│   ├── habits/
│   │   └── page.tsx        # Weekly habit score
│   └── api/
│       └── analyze/
│           └── route.ts    # AI analysis endpoint
├── lib/
│   ├── storage.ts          # localStorage helpers (MealEntry type + CRUD)
│   └── utils.ts            # cn() and helpers
├── components/
│   ├── ui/                 # shadcn components (auto-generated, do not edit)
│   ├── MealResultCard.tsx  # Analysis result display
│   ├── HealthScoreCircle.tsx # Animated score ring
│   ├── MacroPills.tsx      # Calories/protein/carbs/fat pills
│   └── ImageDropzone.tsx   # Drag-drop image upload
└── .env.local              # ANTHROPIC_API_KEY
```

---

## Key Types

```typescript
// lib/storage.ts
export interface MealEntry {
  id: string           // crypto.randomUUID()
  timestamp: number    // Date.now()
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  health_score: number // 0-100
  health_verdict: string
  healthier_swap: string
  swap_reason: string
}

// API response from /api/analyze
export interface AnalysisResult extends Omit<MealEntry, 'id' | 'timestamp'> {}

// User goal
export type UserGoal = 'lose_weight' | 'eat_clean' | 'build_muscle'
```

---

## API Route Contract

**POST `/api/analyze`**

Request body:
```json
{
  "description": "string (optional if imageBase64 provided)",
  "imageBase64": "string (optional, base64 JPEG)",
  "goal": "lose_weight | eat_clean | build_muscle"
}
```

Response (always valid JSON, never throws):
```json
{
  "name": "Chicken Biryani",
  "calories": 520,
  "protein_g": 32,
  "carbs_g": 58,
  "fat_g": 14,
  "health_score": 68,
  "health_verdict": "Decent protein but high in refined carbs.",
  "healthier_swap": "Quinoa Chicken Bowl",
  "swap_reason": "More fiber, lower glycemic index, same protein."
}
```

---

## Component Patterns

### HealthScoreCircle
- SVG circle with `stroke-dasharray` animated on mount
- Color driven by score value using design system colors
- Shows score number in center, verdict text below

### ImageDropzone
- `onDragOver` / `onDrop` handlers
- `FileReader.readAsDataURL()` → strip `data:image/jpeg;base64,` prefix
- Show thumbnail preview after drop
- "Click to upload" fallback via hidden `<input type="file">`

### MealResultCard
- Slides up with `translate-y-0 opacity-100` transition from `translate-y-4 opacity-0`
- Score circle left, macros right on desktop; stacked on mobile
- Swap suggestion in a distinct orange-bordered box at bottom

---

## Session Instructions for Agent

At the start of each session, the agent should:

1. Read this file to restore full project context
2. Run `ls app/ components/ lib/` to understand current state
3. Ask: "What phase are we on?" if unclear — refer to WORKFLOW.md
4. Never create files outside the structure above without asking
5. Always use `cn()` from `lib/utils.ts` for conditional classnames
6. Never install new npm packages without confirming
7. localStorage calls must always be wrapped in `typeof window !== 'undefined'` guard

---

## Prompts for Common Tasks

**"Build the analyze page"**
→ Create `app/analyze/page.tsx` with text/image tabs, goal selector, analyze button, and `MealResultCard` shown after API response. Wire to POST `/api/analyze`.

**"Build the API route"**
→ Create `app/api/analyze/route.ts` using Anthropic SDK. Use `claude-sonnet-4-20250514`. Parse response as JSON. Return typed `AnalysisResult`.

**"Build the meal log"**
→ Create `app/log/page.tsx`. Read from `getMeals()`. Show today's macro totals at top. List meal cards with delete. Use `MealEntry` type.

**"Add the score circle"**
→ Create `components/HealthScoreCircle.tsx`. SVG circle, animated stroke, color from score range, number in center.

**"Polish the UI"**
→ Add `transition-all duration-300` to result reveals. Add `animate-pulse` skeleton while loading. Ensure mobile breakpoints work.

---

## Done Criteria (for Demo)

- [ ] User can type a food name and get nutrition analysis
- [ ] User can upload a food photo and get nutrition analysis
- [ ] Health score displays with color coding
- [ ] Healthier swap suggestion shows
- [ ] Meal can be saved to log
- [ ] Log shows today's calorie + macro totals
- [ ] Habits page shows weekly average score
- [ ] App is deployed on Vercel and accessible via URL