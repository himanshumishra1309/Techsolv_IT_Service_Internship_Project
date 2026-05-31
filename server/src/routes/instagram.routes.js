import { Router } from "express";
import { processInstagramReel } from "../controllers/instagram.controller.js";

const router = Router()

router.post('/metadata', processInstagramReel);

export default router;