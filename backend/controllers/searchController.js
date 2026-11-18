import { generateQueryEmbedding } from "../services/embeddingService.js";

import retrieveRelevantChunks from "../services/retrievalService.js";


export const searchDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const { question } = req.body;

        if (!question || !question.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please provide a question."
            });

        }


        // Step 1: Generate question embedding

        console.log("Generating question embedding...");

        const queryEmbedding = await generateQueryEmbedding(question);


        // Step 2: Retrieve relevant chunks

        console.log("Searching relevant document chunks...");

        const results = await retrieveRelevantChunks(
            queryEmbedding,
            documentId,
            3
        );


        // Step 3: Return results

        res.status(200).json({

            success: true,

            question,

            totalResults: results.length,

            results

        });
        


    } catch (error) {

        console.error("Search Error:", error.message);

        res.status(500).json({

            success: false,

            message: "Document search failed.",

            error: error.message

        });

    }

};