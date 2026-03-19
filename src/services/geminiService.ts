import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeContract(contractDetails: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a legal AI assistant. Analyze the following contract details and provide a professional summary, key risks, and recommended actions. 
      
      Contract Details:
      ${contractDetails}
      
      Format the response in Markdown with clear headings.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing contract:", error);
    throw error;
  }
}

export async function researchCounterparty(partyName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Research the company "${partyName}". Provide a brief overview of their business, recent news, and any potential legal or financial considerations for a contract relationship.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error researching counterparty:", error);
    throw error;
  }
}

export async function legalChat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are a professional legal assistant for LexisManage. You help users with contract queries, legal definitions, and best practices. Always advise users to consult with qualified legal counsel for critical decisions.",
        tools: [{ googleSearch: {} }],
      },
      history: history,
    });
    
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error in legal chat:", error);
    throw error;
  }
}

export async function generateContractDraft(templateName: string, partyName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Draft a professional ${templateName} between LexisManage (the provider) and ${partyName} (the client). 
      Include standard clauses for liability, termination, and confidentiality. 
      Format as a professional legal document in Markdown.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating draft:", error);
    throw error;
  }
}
