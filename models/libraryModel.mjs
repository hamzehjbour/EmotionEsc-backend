import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["song", "movie"],
    required: true,
  },
  itemImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    text: true,
  },
  artistOrDirector: String,
  releaseDate: Date,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

librarySchema.index({ user: 1, itemId: 1 }, { unique: true });
librarySchema.index({ itemType: 1 });
librarySchema.index({ title: 1 });

const Library = mongoose.model("Library", librarySchema);

export default Library;
