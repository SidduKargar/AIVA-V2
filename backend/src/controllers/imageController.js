import fs from "fs";
import { processImage } from "../services/imageService.js";

export async function handleProcessImage(req, res) {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const inputPath = req.file.path;
  try {
    const refinedText = await processImage(inputPath);
    res.json({ success: true, extractedText: refinedText, refinedText });
  } catch (error) {
    console.error("Error processing image:", error);
    fs.unlink(inputPath, (err) => {
      if (err) console.error("Error deleting uploaded image:", err);
    });
    res.status(500).json({ success: false, error: "Failed to process image", details: error.message });
  }
}
