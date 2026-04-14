import { GoogleGenAI } from '@google/genai';

export interface AnalysisResult {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  health_score: number;
  health_verdict: string;
  healthier_swap: string;
  swap_reason: string;
}

export async function analyzeFood(
  goal: string,
  description?: string,
  imageBase64?: string
): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set.");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a nutrition expert. User goal: ${goal || 'eat healthy'}.
The user ate: ${description || 'the food in this image'}.
Return ONLY valid JSON with no extra text matching this exact schema:
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
}`;

  const requestContents: any[] = [];
  
  if (imageBase64) {
    // Determine mimeType from base64 string
    let mimeType = 'image/jpeg';
    if (imageBase64.startsWith('/9j/')) mimeType = 'image/jpeg';
    else if (imageBase64.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
    else if (imageBase64.startsWith('UklGR')) mimeType = 'image/webp';
    
    // Some implementations pass data:image/... base64 inside the data, depending on if it has prefix
    let cleanBase64 = imageBase64;
    if (imageBase64.includes('base64,')) {
      const parts = imageBase64.split('base64,');
      mimeType = parts[0].replace('data:', '').replace(';', '');
      cleanBase64 = parts[1];
    }

    requestContents.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      }
    });
  }
  
  requestContents.push({text: prompt});

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: requestContents,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return data as AnalysisResult;
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    throw err;
  }
}
