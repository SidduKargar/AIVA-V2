import { generateChatResponse, chatHistories } from "../services/chatService.js";

export async function handleGenerate(req, res) {
  try {
    const { prompt, documentId, conversationId, deepThink } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await generateChatResponse({ prompt, documentId, conversationId, deepThink });
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
}

export function handleClearChat(req, res) {
  chatHistories.delete(req.params.conversationId);
  res.json({ message: "Chat history cleared" });
}
