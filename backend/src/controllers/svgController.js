import { generateSvg } from "../services/svgService.js";

export async function handleGenerateSvg(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await generateSvg(prompt);
    res.json({ ...result, message: "SVG generated successfully" });
  } catch (error) {
    console.error("Error generating SVG:", error);
    const isInvalid = error.message === "Failed to generate valid SVG";
    res.status(500).json({ error: error.message, ...(isInvalid && { raw: error.raw }) });
  }
}
