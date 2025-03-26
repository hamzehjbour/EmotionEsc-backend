import express from "express";
import { getMusicRecommendations } from "../controllers/musicController.mjs";

const router = express.Router();

router.get("/recommendations", getMusicRecommendations);

export default router;