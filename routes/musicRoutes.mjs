import express from "express";
import { getTodaysTopMusicController } from "../controllers/musicController.mjs";

const router = express.Router();

// Define the route for today's top music
router.get("/todays-top-music", getTodaysTopMusicController);

export default router;
