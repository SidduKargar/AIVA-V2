import { groq } from "../config/clients.js";
import { MODELS } from "../constants/models.js";
import { PROMPTS } from "../constants/prompts.js";
import { retrieveContext } from "./ragService.js";

export const chatHistories = new Map();

export async function generateChatResponse({ prompt, documentId, conversationId, deepThink }) {
  const chatHistory = chatHistories.get(conversationId) || [];
  let messages = [...chatHistory];
  let model = deepThink ? MODELS.DEEP_THINK : MODELS.DEFAULT;

  if (documentId) {
    model = deepThink ? MODELS.DEEP_THINK : MODELS.DOCUMENT;
    const context = await retrieveContext(prompt, documentId);
    if (context) messages.unshift({ role: "system", content: context });
  }

  messages.push({ role: "user", content: PROMPTS.RESPONSE_FORMAT(prompt) });

  const completion = await groq.chat.completions.create({ messages, model });
  const response = completion.choices[0]?.message?.content || "";

  chatHistory.push({ role: "user", content: prompt });
  chatHistory.push({ role: "assistant", content: response });
  chatHistories.set(conversationId, chatHistory);

  return response;
}
