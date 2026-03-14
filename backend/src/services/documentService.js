import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { indexDocument } from "./ragService.js";

export async function uploadDocument(file) {
  const filePath = file.path;
  const fileName = file.originalname;
  const fileExtension = path.extname(fileName).toLowerCase();
  let fileContent;

  switch (fileExtension) {
    case ".txt":
    case ".sql":
      fileContent = fs.readFileSync(filePath, "utf8");
      break;

    case ".pdf": {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBytes);
      fileContent = pdfData.text;
      break;
    }

    case ".docx":
    case ".doc": {
      const result = await mammoth.extractRawText({ path: filePath });
      fileContent = result.value;
      break;
    }

    default:
      throw new Error("Unsupported file type");
  }

  const documentId = file.filename;
  const chunksProcessed = await indexDocument(documentId, fileName, fileContent);

  setTimeout(() => fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete uploaded file:", err);
  }), 500);

  return { documentId, chunksProcessed };
}
