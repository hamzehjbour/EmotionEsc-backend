import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    select: false,
  },

  linkToSpotify: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.comparePasswords = async function (
  plainPassword,
  storedPassword,
) {
  return await bcrypt.compare(plainPassword, storedPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
