# 🥗 NutriSense

**AI-Powered Food Analyzer & Lifestyle Habit Tracker**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://nutrisense-100545345636.us-central1.run.app)
[![Hackathon](https://img.shields.io/badge/AMD-Slingshot%20Hackathon-orange)](https://nutri-sense.vercel.app/)

NutriSense is a modern health application built for the **AMD Slingshot Hackathon**. It leverages cutting-edge Generative AI to provide instant nutritional feedback from photos or text descriptions, helping users make healthier eating choices through data-driven insights.

---

## 🚀 Key Features

- **📸 AI Image Recognition:** Upload a photo of your meal to get instant calorie and macro estimates.
- **💬 Natural Language Analysis:** Describe your meal (e.g., "A bowl of chicken biryani and a coke") for instant nutrition breakdown.
- **📈 Health Score & Verdict:** Get a 0-100 health score and a professional verdict on your meal.
- **🔄 Healthier Swaps:** AI-driven suggestions for healthier alternatives based on your food choices.
- **📊 Meal Logging:** Save your meals to a persistent log to track your daily progress.
- **📅 Habit Tracking:** Weekly summaries and average health scores to visualize your improvement.

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite) + TypeScript
- **Styling:** Tailwind CSS 4.0 (Modern, utility-first CSS)
- **AI Core:** Google Gemini Pro Vision / Gemini 1.5 Flash
- **Database:** Supabase (PostgreSQL) for secure meal logging
- **Icons/UI:** Lucide React + Framer Motion (Transitions)
- **Deployment:** Google Cloud Platform (Cloud Run)

---

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sarfraj89/nutrisense.git
   cd nutrisense
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Deployment (GCP)

NutriSense is containerized using **Docker** and deployed via **Google Cloud Run** for high scalability and serverless performance.

- **Storage:** Google Artifact Registry
- **Compute:** Cloud Run (us-central1)
- **Web Server:** Nginx (SPA-configured)

---

## 🏆 Hackathon Context

This project was developed for the **AMD Slingshot Hackathon 2026**.
NutriSense aims to solve one of the biggest challenges in fitness: **accurate and effortless calorie tracking**.

---

### 📩 Contact & Contributions
Developed by [sarfraj89](https://github.com/sarfraj89). Feel free to reach out for feedback or contributions!
