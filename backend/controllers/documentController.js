import path from "path";

import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import extractPDFText from "../services/pdfService.js";
import extractTXTText from "../services/textService.js";

import cleanText from "../services/cleanTextService.js";
import createChunks from "../services/chunkService.js";

import { generateEmbedding } from "../services/embeddingService.js";

// GET /api/documents — fetch all documents
export const getDocuments = async (req, res) => {

    try {

        const documents = await Document.find()
            .sort({ createdAt: -1 })
            .select("_id filename fileType fileSize totalChunks status createdAt");

        res.status(200).json({
            success: true,
            documents
        });

    } catch (error) {

        console.error("Get Documents Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch documents.",
            error: error.message
        });

    }

};


// DELETE /api/documents/:id — delete a document and its chunks
export const deleteDocument = async (req, res) => {

    try {

        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found."
            });
        }

        await Chunk.deleteMany({ documentId: id });
        await Document.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "Document deleted successfully."
        });

    } catch (error) {

        console.error("Delete Document Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete document.",
            error: error.message
        });

    }

};


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
        // Step 6: Generate embeddings for each chunk

const chunkDocuments = [];

for (const chunk of chunks) {

    console.log(`Generating embedding for chunk ${chunk.chunkIndex + 1}/${chunks.length}`);

    const embedding = await generateEmbedding(
        chunk.text,
        file.originalname
    );
    

    chunkDocuments.push({

        documentId: document._id,

        chunkIndex: chunk.chunkIndex,

        text: chunk.text,

        embedding: embedding,

        pageNumber: chunk.pageNumber

    });

}
console.log("Total chunks:", chunkDocuments.length);

console.log(
    "First chunk embedding length:",
    chunkDocuments[0]?.embedding?.length
);



// Step 7: Store chunks with embeddings
await Chunk.insertMany(chunkDocuments);


// Step 8: Update document status
document.status = "completed";

await document.save();


        res.status(201).json({

    success: true,

    message: "Document processed and embeddings generated successfully!",

    document: {

        _id: document._id,

        filename: document.filename,

        fileSize: document.fileSize,

        fileType: document.fileType,

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