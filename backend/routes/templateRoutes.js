import express from "express";
import { saveTemplate, getTemplate } from "../controllers/templateController.js";
import { protect } from "../middleware/authMiddleware.js"; // Adjust path if needed

const router = express.Router();

// Both routes must be protected so we know which user's template to save/fetch
router.post("/", protect, saveTemplate);
router.get("/", protect, getTemplate);

export default router;