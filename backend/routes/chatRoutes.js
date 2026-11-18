import express from "express";

import { chatWithDocument } from "../controllers/chatController.js";

const router = express.Router();

router.post("/:documentId", chatWithDocument);

export default router;