import express from "express";
import { upload } from "../middleware/upload.js";
import {
  authenticate,
  requireUploader,
  requireAdmin
} from "../middleware/auth.js";

import {
  uploadMedia,
  getMedia,
  approveMedia,
  deleteMedia
} from "../controllers/mediaController.js";

const router = express.Router();

/* ===============================
   GET APPROVED MEDIA (PUBLIC)
================================ */
router.get("/", getMedia);

/* ===============================
   UPLOAD MEDIA (RESEARCHER + ADMIN)
================================ */
router.post(
  "/upload",
  authenticate,
  requireUploader,
  upload.single("file"),
  uploadMedia
);

/* ===============================
   APPROVE MEDIA (ADMIN ONLY)
================================ */
router.post(
  "/:id/approve",
  authenticate,
  requireAdmin,
  approveMedia
);

/* ===============================
   DELETE MEDIA (ADMIN ONLY)
================================ */
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteMedia
);

export default router;
