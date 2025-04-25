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
} from "../controllers/authController.mjs";

const router = express.Router();

router.get("/signup/resend", resend);

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
