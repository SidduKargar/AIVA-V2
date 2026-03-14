import { groq } from "../config/clients.js";
import { MODELS } from "../constants/models.js";
import { PROMPTS } from "../constants/prompts.js";

export async function searchCode({ language, query, deepThink }) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: PROMPTS.CODE_SEARCH(language, query) }],
    model: deepThink ? MODELS.DEEP_THINK : MODELS.CODE,
    temperature: 0.5,
  });
  return completion.choices[0]?.message?.content || "";
}

export async function searchDocs({ query, deepThink }) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: PROMPTS.DOCS_SEARCH(query) }],
    model: deepThink ? MODELS.DEEP_THINK : MODELS.CODE,
    temperature: 0.3,
  });
  return completion.choices[0]?.message?.content || "";
}
