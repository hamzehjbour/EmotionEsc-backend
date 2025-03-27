import express from "express";
import {
  getTodaysTopMusicController,
  getMusicRecommendations,
} from "../controllers/musicController.mjs";

const router = express.Router();

// Define the route for today's top music
router.get("/todays-top-music", getTodaysTopMusicController);
router.get("/recommendations", getMusicRecommendations);

export default router;
