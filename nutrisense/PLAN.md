# 🥗 NutriSense — Food & Health App
> AMD Slingshot Hackathon · Powered by H2S

---

## Problem Statement
Design a smart solution that helps individuals make better food choices and build healthier eating habits by leveraging available data, user behavior, or contextual inputs.

---

## Our Angle (Minimal, Winnable)
**NutriSense** — Snap a meal photo or describe what you're eating → get instant nutrition breakdown, a health score, and a smarter swap suggestion. Tracks your weekly eating patterns and nudges you toward better habits.

**Why this wins:** Visual + conversational UX, AI-first, real utility, ships fast.

---

## Core Features (MVP Only)

| Feature | Description | Priority |
|---|---|---|
| Food Analyzer | Text or image input → nutrition facts + health score (0–100) | P0 |
| Smart Swap | Suggest a healthier alternative to what you just ate | P0 |
| Meal Log | Save analyzed meals, view today's summary | P1 |
| Weekly Habit Score | Simple weekly score based on logged meals | P1 |
| Onboarding | Ask goal (lose weight / eat clean / build muscle) — personalizes AI output | P2 |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind | Fast, beautiful, SSR |
| AI Brain | Claude claude-sonnet-4-20250514 via Anthropic API | Nutrition analysis + smart swaps |
| Image Input | Browser FileReader → base64 → Claude vision | No extra infra |
| Storage | localStorage (MVP) | Zero backend, ships fast |
| Deployment | Vercel | 1-click deploy |
| UI Components | shadcn/ui | Pre-built, polished |

---

## Pages / Routes

```
/                → Landing / Home (hero + CTA)
/analyze         → Main analyzer (text + image input)
/log             → Meal history + today's summary
/habits          → Weekly habit score + streaks
```

---

## AI Prompt Strategy

**Nutrition Analysis Prompt:**
```
You are a nutrition expert. The user ate: [food description or image].
Return JSON: { name, calories, protein_g, carbs_g, fat_g, health_score (0-100), health_verdict (string), healthier_swap (string), swap_reason (string) }
```

**Personalization Layer:**
Prepend user goal to every prompt: `"User goal: ${goal}. Tailor advice accordingly."`

---

## Design Direction
- **Aesthetic:** Clean dark health-tech — think Whoop meets Linear
- **Font:** Clash Display (headings) + DM Sans (body)
- **Colors:** `#0A0A0A` bg · `#22C55E` green accent · `#F97316` orange for alerts
- **Key interaction:** Drag-drop image → instant scan animation → results card slides up

---

## Non-Goals (skip for hackathon)
- User auth / backend DB
- Barcode scanner
- Restaurant API integration
- Calorie goal tracking with charts
- Social/sharing features