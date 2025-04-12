import express from "express";
import {
  getRecommendations,
  getPopular,
  getTopRated,
  getDetails,
} from "../controllers/movieController.mjs";

import { protect } from "../controllers/authController.mjs";

const router = express.Router();

router.use(protect);

router
  .get("/get-movie-recommendation", getRecommendations)
  .get("/popular-movies", getPopular)
  .get("/top-rated-movies", getTopRated)
  .get("/movie-details/:id", getDetails);

export default router;
