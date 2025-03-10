import {
  getMovieRecommendations,
  getPopularMovies,
  getMovieDetails,
  getTopRatedMovies,
} from "../services/movieServices.mjs";

export const getRecommendations = async (req, res, next) => {
  try {
    const { page, lang, em } = req.query;

    const recommendations = await getMovieRecommendations(em, page, lang);

    res.status(200).json({
      status: "success",
      data: recommendations,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getPopular = async (req, res, next) => {
  try {
    // console.log(req.query);
    const { page, lang } = req.query;

    const topMovies = await getPopularMovies(page, lang);

    res.status(200).json({
      status: "success",
      data: topMovies,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTopRated = async (req, res, next) => {
  try {
    // console.log(req.query);
    const { page, lang } = req.query;

    const topMovies = await getTopRatedMovies(page, lang);

    res.status(200).json({
      status: "success",
      data: topMovies,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getDetails = async (req, res, next) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const details = await getMovieDetails(id);

    // console.log(details);

    res.status(200).json({
      status: "success",
      data: details,
    });
  } catch (err) {
    console.log(err);
  }
};
