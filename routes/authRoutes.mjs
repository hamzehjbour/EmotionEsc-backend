import express from "express";
import {
  start,
  verify,
  resend,
  login,
} from "../controllers/authController.mjs";

const router = express.Router();

router
  .post("/signup/start", start)
  .post("/signup/verify", verify)
  .post("/login", login);
router.get("/signup/resend", resend);

export default router;
