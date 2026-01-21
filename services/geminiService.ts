
import { GoogleGenAI, Type } from "@google/genai";
import { Player, WinRateData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResults = async (players: Player[], winRates: WinRateData[], formula: string) => {
  const prompt = `
    I have a combat simulation system with 4 stats: Combat, Magic, Ranged, and Defense.
    Total points available per player: 10.
    Current Logic Formula: ${formula}
    
    Here are the players and their win rates:
    ${winRates.map(w => `${w.playerName}: ${w.winRate.toFixed(1)}% win rate`).join('\n')}
    
    Stats for players:
    ${players.map(p => `${p.name}: C:${p.stats.Combat}, M:${p.stats.Magic}, R:${p.stats.Ranged}, D:${p.stats.Defense}`).join('\n')}

    Please analyze these results. Which build strategy is dominant? Is the formula ${formula} mathematically flawed or biased? Provide a concise summary of the "Meta" based on this data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert RPG system designer and mathematical analyst. You provide deep insights into game balance and broken mechanics.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze results. Please check your simulation data and try again.";
  }
};
