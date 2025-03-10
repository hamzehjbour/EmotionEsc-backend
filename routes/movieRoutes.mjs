import express from "express";
import {
  getRecommendations,
  getPopular,
  getTopRated,
  getDetails,
} from "../controllers/movieController.mjs";

const router = express.Router();

router
  .get("/get-movie-recommendation", getRecommendations)
  .get("/popular-movies", getPopular)
  .get("/top-rated-movies", getTopRated)
  .get("/movie-details/:id", getDetails);

export default router;
