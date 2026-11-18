import express from "express";

import { searchDocument } from "../controllers/searchController.js";

const router = express.Router();

router.post("/:documentId", searchDocument);

export default router;