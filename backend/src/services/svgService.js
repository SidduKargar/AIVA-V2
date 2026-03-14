import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { svgsDir } from "../config/storage.js";
import { MODELS } from "../constants/models.js";
import { PROMPTS } from "../constants/prompts.js";

export async function generateSvg(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.GEMINI_SVG}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPTS.SVG_GENERATION(prompt) }] }] }),
    }
  );

  const data = await response.json();
  let svgContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  let svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/i);
  if (!svgMatch) {
    svgMatch = svgContent.match(/```(?:svg|xml)?\s*(<svg[\s\S]*<\/svg>)\s*```/i);
    if (svgMatch) svgContent = svgMatch[1];
  } else {
    svgContent = svgMatch[0];
  }

  if (!svgContent.startsWith("<svg")) throw new Error("Failed to generate valid SVG");

  svgContent = svgContent
    .replace(/script/gi, "removed-script")
    .replace(/on\w+=/gi, "data-removed=");

  if (!svgContent.includes("preserveAspectRatio")) {
    svgContent = svgContent.replace(/<svg/, '<svg preserveAspectRatio="xMidYMid meet"');
  }

  const svgFileName = `${Date.now()}-${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, "-")}.svg`;
  fs.writeFileSync(path.join(svgsDir, svgFileName), svgContent);

  return { svg: svgContent, fileName: svgFileName, filePath: `/uploads/svgs/${svgFileName}` };
}
