import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "You must provide your full name"],
  },

  email: {
    type: String,
    required: [true, "You must provide your email"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "You must have a password"],
  },

  linkToSpotify: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
