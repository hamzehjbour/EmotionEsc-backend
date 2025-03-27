import {
  getMusicRecommendation,
  getTodaysTopMusic,
} from "../services/musicServices.mjs";

export const getTodaysTopMusicController = async (req, res, next) => {
  try {
    const { page } = req.query;

    const topMusic = await getTodaysTopMusic(page);

    res.status(200).json({
      status: "success",
      data: topMusic,
    });
  } catch (err) {
    next(err);
  }
};

export const getMusicRecommendations = async (req, res, next) => {
  try {
    const { em, page } = req.query;

    const recommendations = await getMusicRecommendation(em, page);

    res.status(200).json({
      status: "success",
      data: recommendations,
    });
  } catch (err) {
    next(err);
  }
};
