import { Router } from "express";
import { shortenUrl } from "../controllers/urlController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
const router = Router();


router.post("/shorten",authMiddleware, shortenUrl);

export default router;