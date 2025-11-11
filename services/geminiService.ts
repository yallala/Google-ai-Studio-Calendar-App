import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set in environment variables. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Added explicit return type to ensure the result is correctly typed as a string.
export const generateEventIdea = async (): Promise<string> => {
  if (!API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(JSON.stringify({
        title: "Family Game Night",
        description: "Dust off the board games for a night of friendly competition."
    })), 1000));
  }
  
  try {
    const prompt = `
      You are a creative family assistant. Suggest a fun and simple family activity, goal, or important update.
      The suggestion should be for a family with children.
      The output must be a valid JSON object with two keys: 'title' (a short, actionable title) and 'description' (a one-sentence description).
      
      Example:
      {
        "title": "Backyard Movie Night",
        "description": "Set up a projector and watch a classic family movie under the stars."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The short, actionable title for the family activity."
            },
            description: {
              type: Type.STRING,
              description: "A one-sentence description of the activity."
            }
          },
          required: ["title", "description"]
        },
      },
    });

    const text = response.text.trim();
    
    JSON.parse(text);
    
    return text;

  } catch (error) {
    console.error("Error generating event idea from Gemini:", error);
    throw new Error("Failed to get a suggestion from AI.");
  }
};