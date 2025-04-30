import express from "express";
import { protect } from "../controllers/authController.mjs";
import {
  addItem,
  getItems,
  removeItem,
} from "../controllers/libraryController.mjs";

const router = express.Router();

router.use("/", protect);

router.post("/add-to-library", addItem);

router.get("/get-library", getItems);

router.delete("/remove-from-library/:id", removeItem);

export default router;
