import { Router } from "express";
import { analyzeYoutube } from "../controllers/youtube.controller.js";

const router = Router();

router.post("/analyze", analyzeYoutube);

export default router;