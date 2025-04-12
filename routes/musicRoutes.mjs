import express from "express";
import {
  getTodaysTopMusicController,
  getMusicRecommendations,
} from "../controllers/musicController.mjs";

import { protect } from "../controllers/authController.mjs";

const router = express.Router();

router.use(protect);

// Define the route for today's top music
router.get("/todays-top-music", getTodaysTopMusicController);
router.get("/recommendations", getMusicRecommendations);

export default router;
