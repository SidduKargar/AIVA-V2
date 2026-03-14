import fetch from "node-fetch";
import { MODELS } from "../constants/models.js";

function fallbackEmbedding(text, dimensions = 384) {
  const embedding = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i++) {
    embedding[i % dimensions] += text.charCodeAt(i) / 1000;
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
  return embedding.map((v) => v / magnitude);
}

export async function getEmbeddings(text) {
  try {
    const response = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODELS.EMBEDDING, prompt: text }),
    });
    const data = await response.json();
    if (data.embedding) return data.embedding;
    throw new Error("No embedding returned");
  } catch {
    console.warn("Ollama unavailable, using fallback embedding");
    return fallbackEmbedding(text);
  }
}

export function chunkText(text, maxChunkSize = 1000, overlapSize = 100) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + maxChunkSize, text.length);

    if (endIndex < text.length) {
      const breakPoints = [
        text.lastIndexOf(". ", endIndex),
        text.lastIndexOf("\n", endIndex),
        text.lastIndexOf(". \n", endIndex),
      ].filter((idx) => idx > startIndex);

      if (breakPoints.length > 0) endIndex = Math.max(...breakPoints) + 1;
    }

    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex - overlapSize;
    if (startIndex < 0) startIndex = 0;
    if (startIndex >= text.length - overlapSize) break;
  }

  return chunks;
}
