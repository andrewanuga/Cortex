import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const geminiSummarize = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
}

await geminiSummarize();