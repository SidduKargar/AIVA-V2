import { Router } from "express";
import { documentUpload, imageUpload } from "../config/storage.js";
import { handleUpload } from "../controllers/documentController.js";
import { handleGenerate, handleClearChat } from "../controllers/chatController.js";
import { handleGenerateSvg } from "../controllers/svgController.js";
import { handleProcessImage } from "../controllers/imageController.js";
import { handleSearchCode, handleSearchDocs } from "../controllers/codeController.js";

const router = Router();

router.post("/upload", documentUpload.single("document"), handleUpload);
router.post("/generate", handleGenerate);
router.delete("/clear-chat/:conversationId", handleClearChat);
router.post("/generate-svg", handleGenerateSvg);
router.post("/process-image", imageUpload.single("image"), handleProcessImage);
router.post("/search-code", handleSearchCode);
router.post("/search-docs", handleSearchDocs);

export default router;
