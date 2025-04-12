import express from "express";
import { start, verify, resend } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup/start", start);

router.post("/signup/verify", verify);

router.get("/signup/resend", resend);

export default router;
