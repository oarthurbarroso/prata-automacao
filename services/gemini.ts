
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the API key strictly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartInsights = async (context: string) => {
  try {
    // Generate content using the recommended model for text-based analysis tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como assistente sênior de uma clínica de estética, analise os seguintes dados e sugira 3 ações estratégicas de marketing ou vendas: ${context}. Responda em Português de forma concisa.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Não foi possível gerar insights no momento. Verifique sua chave de API.";
  }
};

export const suggestReply = async (message: string) => {
  try {
    // Generate content using the recommended model for response suggestion tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Um cliente da clínica de estética enviou a seguinte mensagem: "${message}". Sugira uma resposta profissional, amigável e persuasiva em Português.`,
    });
    return response.text;
  } catch (error) {
    return "Olá! Como posso ajudar você hoje?";
  }
};
