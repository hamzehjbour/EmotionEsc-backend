import { getTodaysTopMusic } from "../services/musicServices.mjs";

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
