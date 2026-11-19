import mongoose from "mongoose";

import Document from "../models/document.js";

import { generateQueryEmbedding } from "../services/embeddingService.js";

import retrieveRelevantChunks from "../services/retrievalService.js";

import generateAnswer from "../services/llmService.js";

import buildContext from "../utils/promptBuilder.js";

const MIN_RELEVANCE_SCORE = Number(
    process.env.MIN_RELEVANCE_SCORE || 0.75
);

export const chatWithDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const { question } = req.body;
        // Step 1: Validate document ID

        if (!mongoose.Types.ObjectId.isValid(documentId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid document ID."

            });

        }


        // Step 2: Validate question

        if (!question || !question.trim()) {

            return res.status(400).json({

                success: false,

                message: "Please provide a question."

            });

        }


       // Step 3: Verify document exists

        const document = await Document.findById(documentId);

        if (!document) {

            return res.status(404).json({

                success: false,

                message: "Document not found."

            });

        }


        // Step 4: Check document processing status

        if (document.status !== "completed") {

            return res.status(400).json({

                success: false,

                message: "Document is not ready for questions yet."

            });

        }


        // Step 5: Generate question embedding

        console.log("Generating question embedding...");

        const queryEmbedding =
            await generateQueryEmbedding(question.trim());


        // Step 6: Retrieve relevant chunks

        console.log("Retrieving relevant chunks...");

        const relevantChunks =
            await retrieveRelevantChunks(
                queryEmbedding,
                documentId,
                3
            );


        // Step 7: Handle empty retrieval

        if (!relevantChunks.length) {

            return res.status(200).json({

                success: true,

                answer: "I couldn't find relevant information in the uploaded document.",

                sources: []

            });

        }


        // Step 8: Apply relevance filtering

        const bestScore = Math.max(
            ...relevantChunks.map(chunk => chunk.score)
        );


        if (bestScore < MIN_RELEVANCE_SCORE) {

            return res.status(200).json({

                success: true,

                answer: "I couldn't find relevant information in the uploaded document.",

                sources: []

            });

        }


        // Step 9: Build context

        console.log("Building document context...");

        const context = buildContext(relevantChunks);


        

        // Step 10: Generate structured answer using Groq

console.log("Generating answer using Groq...");

const result = await generateAnswer(
    question.trim(),
    context
);

// Step 11: Handle unanswered questions

if (!result.answerable) {
    return res.status(200).json({
        success: true,
        question,
        answer: result.answer,
        answerable: false,
        sources: []
    });
}
// Step 12: Select only sources used by the LLM
if (
    !Array.isArray(result.usedSources) ||
    result.usedSources.length === 0
) {
    return res.status(200).json({
        success: true,
        question,
        answer: "I couldn't identify supporting sources in the uploaded document.",
        answerable: false,
        sources: []
    });
}
const citedSources = result.usedSources
    .map(number => relevantChunks[number - 1])
    .filter(Boolean);

        // Step 13: Prepare citations

        const sources = citedSources.map(chunk => {
    const originalIndex = relevantChunks.indexOf(chunk);

    return {
        sourceNumber: originalIndex + 1,
        chunkId: chunk._id,
        chunkIndex: chunk.chunkIndex,
        pageNumber: chunk.pageNumber,
        score: chunk.score,
        text: chunk.text
    };
});


      

       // Step 14: Return response

return res.status(200).json({
    success: true,
    question,
    answer: result.answer,
    answerable: true,
    sources
});


    }

    catch (error) {

        console.error("Chat Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to generate an answer."

        });

    }

};