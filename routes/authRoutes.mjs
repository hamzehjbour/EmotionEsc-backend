import express from "express";
import {
  start,
  verify,
  resend,
  login,
  forgetPassword,
  resetPassword,
  updateMyPassword,
  protect,
  editProfile,
  redirectToSpotify,
  handleSpotifyCallback,
} from "../controllers/authController.mjs";

const router = express.Router();

router
  .get("/signup/resend", resend)
  .get("/login-spotify", protect, redirectToSpotify)
  .get("/link-spotify", protect, handleSpotifyCallback);

router
  .post("/signup/start", start)
  .post("/signup/verify", verify)
  .post("/login", login)
  .post("/forget-password", forgetPassword)
  .post("/edit-profile", protect, editProfile);

router
  .patch("/reset-password/:token", resetPassword)
  .patch("/update-my-password", protect, updateMyPassword);

export default router;
