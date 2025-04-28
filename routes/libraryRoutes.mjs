import express from "express";
import { protect } from "../controllers/authController.mjs";
import { addItem, getItems } from "../controllers/libraryController.mjs";

const router = express.Router();

router.use("/", protect);

router.post("/add-to-library", addItem);

router.get("/get-library", getItems);

export default router;
