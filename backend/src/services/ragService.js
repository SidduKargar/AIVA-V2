import { documentCollection } from "../config/clients.js";
import { getEmbeddings, chunkText } from "./embeddingService.js";
import { PROMPTS } from "../constants/prompts.js";

export const documents = new Map();
export const documentIdToName = new Map();

export async function indexDocument(documentId, fileName, fileContent) {
  documents.set(documentId, fileContent);
  documentIdToName.set(documentId, fileName);

  const textChunks = chunkText(fileContent);

  for (let i = 0; i < textChunks.length; i++) {
    try {
      const embedding = await getEmbeddings(textChunks[i]);
      await documentCollection.add({
        ids: [`${documentId}-chunk-${i}`],
        embeddings: [embedding],
        metadatas: [{ documentId, fileName, chunkIndex: i, totalChunks: textChunks.length }],
        documents: [textChunks[i]],
      });
    } catch (error) {
      console.error(`Error processing chunk ${i} for document ${documentId}:`, error);
    }
  }

  return textChunks.length;
}

export async function retrieveContext(prompt, documentId) {
  try {
    const promptEmbedding = await getEmbeddings(prompt);
    const queryResult = await documentCollection.query({
      queryEmbeddings: [promptEmbedding],
      nResults: 5,
      where: { documentId },
    });

    if (queryResult.documents?.[0]?.length > 0) {
      const documentName = documentIdToName.get(documentId) || "uploaded document";
      return PROMPTS.DOCUMENT_CONTEXT(documentName, queryResult.documents[0].join("\n\n"));
    }
  } catch (error) {
    console.error("Error during RAG retrieval:", error);
  }

  // Fallback to full document
  const documentContent = documents.get(documentId);
  if (documentContent) return PROMPTS.DOCUMENT_FALLBACK(documentContent);
  return null;
}
