import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

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
          content: `Research the company "${partyName}" and return a clean, readable counterparty briefing in Markdown.

Use this exact section order:
1) ## Company Snapshot
2) ## Recent Developments (last 12 months)
3) ## Legal and Regulatory Considerations
4) ## Financial Strength Indicators
5) ## Key Contract Risks
6) ## Recommended Clauses
7) ## Quick Recommendation (Go / Caution / High Risk)
8) ## Sources

Formatting rules:
- Use headings, short paragraphs, and bullet points.
- Keep line lengths moderate for readability.
- Avoid dense tables unless absolutely necessary.
- If you include a table, keep it to at most 3 columns.
- Highlight practical contract implications, not just facts.
- Under "Sources", include bullet links with source name and URL.`,
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
