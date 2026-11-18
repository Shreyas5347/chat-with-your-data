import path from "path";

import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import extractPDFText from "../services/pdfService.js";
import extractTXTText from "../services/textService.js";

import cleanText from "../services/cleanTextService.js";
import createChunks from "../services/chunkService.js";

export const uploadDocument = async (req, res) => {

    let document;

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a document."
            });
        }

        const file = req.file;

        const extension = path.extname(file.originalname).toLowerCase();

        // Step 1: Extract text
        let pages;

        if (extension === ".pdf") {

            pages = await extractPDFText(file.buffer);

        } else if (extension === ".txt") {

            pages = extractTXTText(file.buffer);

        } else {

            return res.status(400).json({
                success: false,
                message: "Unsupported file format."
            });

        }

        // Step 2: Clean extracted text
        pages = pages.map(page => ({
            ...page,
            text: cleanText(page.text)
        }));

        // Step 3: Check extracted content
        const hasText = pages.some(page => page.text.length > 0);

        if (!hasText) {
            return res.status(400).json({
                success: false,
                message: "No readable text found in the document."
            });
        }

        // Step 4: Generate chunks
        const chunks = createChunks(pages);

        if (chunks.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Unable to generate document chunks."
            });
        }

        // Step 5: Create document record
        document = await Document.create({

            filename: file.originalname,

            fileType: extension.replace(".", ""),

            fileSize: file.size,

            totalChunks: chunks.length,

            status: "processing"

        });

        // Step 6: Prepare chunk records
        const chunkDocuments = chunks.map(chunk => ({

            documentId: document._id,

            chunkIndex: chunk.chunkIndex,

            text: chunk.text,

            embedding: [],

            pageNumber: chunk.pageNumber

        }));

        // Step 7: Store chunks in MongoDB
        await Chunk.insertMany(chunkDocuments);

        res.status(201).json({

            success: true,

            message: "Document extracted and chunked successfully. Embeddings are pending.",

            document: {

                id: document._id,

                filename: document.filename,

                totalChunks: document.totalChunks,

                status: document.status

            }

        });

    } catch (error) {

        console.error("Document Processing Error:", error);

        if (document) {

            await Chunk.deleteMany({
                documentId: document._id
            });

            await Document.deleteOne({
                _id: document._id
            });

        }

        res.status(500).json({

            success: false,

            message: "Document processing failed.",
            
            error: error.message

        });

    }

};