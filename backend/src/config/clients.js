import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChromaClient } from "chromadb";

export let groq;
export let genAI;
export const chromaClient = new ChromaClient({ path: "http://localhost:8000" });

export let documentCollection;

export async function initializeChroma() {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    try {
      documentCollection = await chromaClient.getCollection({ name: "document_chunks" });
      console.log("Existing ChromaDB collection retrieved successfully");
    } catch {
      documentCollection = await chromaClient.createCollection({
        name: "document_chunks",
        metadata: { description: "Document chunks for RAG implementation" },
      });
      console.log("New ChromaDB collection created successfully");
    }
  } catch (error) {
    console.error("Error initializing ChromaDB collection:", error);
  }
}
