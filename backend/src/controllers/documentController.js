import { uploadDocument } from "../services/documentService.js";

export async function handleUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { documentId, chunksProcessed } = await uploadDocument(req.file);
    res.json({ message: "File uploaded successfully and indexed for RAG", documentId, chunksProcessed });
  } catch (error) {
    if (error.message === "Unsupported file type")
      return res.status(400).json({ error: error.message });
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Failed to process file", details: error.message });
  }
}
