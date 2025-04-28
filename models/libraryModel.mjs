import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  itemType: {
    type: String,
    enum: ["song", "movie"],
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

librarySchema.index({ itemType: 1 });
librarySchema.index({ user: 1 });
librarySchema.index({ title: 1 });

const Library = mongoose.model("Library", librarySchema);

export default Library;
