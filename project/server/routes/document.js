import express from "express";
import { authenticate } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import {
  uploadDocument,
  getDocument,
  getAllUserDocuments,
} from "../controllers/document.js";

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadDocument);
router.get("/:id", authenticate, getDocument);
router.get("/user/all", authenticate, getAllUserDocuments);

export default router;
