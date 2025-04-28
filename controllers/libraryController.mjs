import Library from "../models/libraryModel.mjs";
import AppError from "../utils/AppError.mjs";

const checkType = (type) => {
  const allowedTypes = ["song", "movie"];

  return allowedTypes.includes(type);
};

export const addItem = async (req, res, next) => {
  try {
    const { _id, itemType, title, artistOrDirector, releaseDate } = req.body;

    if (!checkType(itemType)) {
      throw new AppError("Invalid item type. Must be song or movie", 400);
    }

    const item = await Library.create({
      _id,
      user: req.user.id,
      itemType,
      title,
      artistOrDirector,
      releaseDate,
    });

    res.status(201).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (err) {
    if (err.code === 11000)
      return next(new AppError("Item already exists in your library", 400));
  }
};

export const getItems = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    if (!checkType(type)) {
      throw new AppError("Invalid item type. Must be song or movie", 400);
    }

    let filter = {
      user: req.user._id,
    };

    if (type) {
      filter.itemType = req.query.type;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: `.*${escapedSearch}.*`, $options: "i" };
    }

    const items = await Library.find(filter);

    if (items.length === 0) {
      const item = type === "song" ? "song" : "movie";

      const message = search
        ? `We haven't found ${search} in your ${item}s library`
        : `No ${item}s in your library`;
      throw new AppError(message, 404);
    }

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  } catch (err) {
    next(err);
  }
};
