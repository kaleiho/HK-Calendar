import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from '../types';

const apiKey = process.env.API_KEY;

export const analyzeImageForCalendar = async (
  base64Image: string, 
  monthName: string,
  year: number
): Promise<AIAnalysisResult | null> => {
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Prepare base64 data (remove data URL header if present)
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: `This image is for a calendar background for ${monthName} ${year} in Hong Kong. 
            1. Provide a short, uplifting, or poetic quote (max 15 words) that fits the mood of the image and the season. English or Traditional Chinese is fine.
            2. Suggest a primary color (hex code) extracted from the image that is dark enough to be readable text on a light background.
            3. Suggest a secondary accent color (hex code) from the image.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING }
          },
          required: ["quote", "primaryColor", "secondaryColor"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
