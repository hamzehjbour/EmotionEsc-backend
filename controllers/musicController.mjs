import AppError from "../utils/AppError.mjs";
import { getMusicRecommendation } from "../services/musicServices.mjs";

export const getMusicRecommendations = async (req, res, next) => {
  try {
    const { em,page} = req.query;
  
    const recommendations = await getMusicRecommendation(em, page);
    res.status(200).json({
      status: "success",
      data: recommendations,
    });
  } catch (err) {
    next(err); 
  }
};