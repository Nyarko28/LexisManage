import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

/** Model with built-in web search for real-time info (counterparty research, legal chat) */
const SEARCH_MODEL = "groq/compound";

/** Standard model for tasks that don't need search (contract analysis, drafting) */
const STANDARD_MODEL = "llama-3.3-70b-versatile";

export async function analyzeContract(contractDetails: string) {
  try {
    const response = await groq.chat.completions.create({
      model: STANDARD_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a legal AI assistant. Provide professional summaries, key risks, and recommended actions. Format responses in Markdown with clear headings.",
        },
        {
          role: "user",
          content: `Analyze the following contract details:\n\n${contractDetails}`,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Error analyzing contract:", error);
    throw error;
  }
}

export async function researchCounterparty(partyName: string) {
  try {
    const response = await groq.chat.completions.create({
      model: SEARCH_MODEL,
      messages: [
        {
          role: "user",
          content: `Research the company "${partyName}". Provide a brief overview of their business, recent news, and any potential legal or financial considerations for a contract relationship. Format the response in Markdown with clear headings.`,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Error researching counterparty:", error);
    throw error;
  }
}

export async function legalChat(
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[]
) {
  try {
    const messages: { role: "user" | "assistant" | "system"; content: string }[] = [
      {
        role: "system",
        content:
          "You are a professional legal assistant for LexisManage. You help users with contract queries, legal definitions, and best practices. Always advise users to consult with qualified legal counsel for critical decisions.",
      },
      ...history.map((m) => ({
        role: (m.role === "model" ? "assistant" : m.role) as "user" | "assistant",
        content: m.parts[0]?.text ?? "",
      })),
      { role: "user", content: message },
    ];

    const response = await groq.chat.completions.create({
      model: SEARCH_MODEL,
      messages,
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Error in legal chat:", error);
    throw error;
  }
}

export async function generateContractDraft(
  templateName: string,
  partyName: string
) {
  try {
    const response = await groq.chat.completions.create({
      model: STANDARD_MODEL,
      messages: [
        {
          role: "user",
          content: `Draft a professional ${templateName} between LexisManage (the provider) and ${partyName} (the client). 
Include standard clauses for liability, termination, and confidentiality. 
Format as a professional legal document in Markdown.`,
        },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Error generating draft:", error);
    throw error;
  }
}
