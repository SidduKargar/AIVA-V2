import Tesseract from "tesseract.js";
import fs from "fs";
import { groq } from "../config/clients.js";
import { MODELS } from "../constants/models.js";
import { PROMPTS } from "../constants/prompts.js";

export async function processImage(inputPath) {
  const { data: { text } } = await Tesseract.recognize(inputPath, "eng");

  if (!text) throw new Error("No text was extracted from the image");

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: PROMPTS.IMAGE_OCR_REFINE(text) }],
    model: MODELS.IMAGE_OCR,
  });

  let refinedText = completion.choices[0]?.message?.content || text;
  refinedText = refinedText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  fs.unlink(inputPath, (err) => {
    if (err) console.error("Error deleting uploaded image:", err);
  });

  return refinedText;
}
