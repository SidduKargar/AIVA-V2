import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDir = path.join(__dirname, "../../uploads");
export const imagesDir = path.join(uploadsDir, "images");
export const svgsDir = path.join(uploadsDir, "svgs");

[uploadsDir, imagesDir, svgsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export const documentUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagesDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});
