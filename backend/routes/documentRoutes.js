import express from "express";
import multer from "multer";

import upload from "../middleware/uploadMiddleware.js";

import {
    getDocuments,
    deleteDocument,
    uploadDocument
} from "../controllers/documentController.js";

const router = express.Router();

// GET all documents
router.get("/", getDocuments);

// DELETE a document by ID
router.delete("/:id", deleteDocument);

router.post(
    "/upload",

    (req, res, next) => {

        upload.single("document")(req, res, (error) => {

            if (error instanceof multer.MulterError) {

                const message =
                    error.code === "LIMIT_FILE_SIZE"
                        ? "File size cannot exceed 10 MB."
                        : error.message;

                return res.status(400).json({
                    success: false,
                    message
                });

            }

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next();

        });

    },

    uploadDocument
);

export default router;