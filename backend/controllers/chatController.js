import { generateQueryEmbedding } from "../services/embeddingService.js";

import retrieveRelevantChunks from "../services/retrievalService.js";

import generateAnswer from "../services/llmService.js";

import buildContext from "../utils/promptBuilder.js";


export const chatWithDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        const { question } = req.body;


        // Step 1: Validate question

        if (!question || !question.trim()) {

            return res.status(400).json({

                success: false,

                message: "Please provide a question."

            });

        }


        // Step 2: Generate question embedding

        console.log("Generating question embedding...");

        const queryEmbedding =
            await generateQueryEmbedding(question);


        // Step 3: Retrieve relevant chunks

        console.log("Retrieving relevant document chunks...");

        const relevantChunks =
            await retrieveRelevantChunks(
                queryEmbedding,
                documentId,
                3
            );


        // Step 4: Handle empty retrieval results

        if (relevantChunks.length === 0) {

            return res.status(200).json({

                success: true,

                answer: "I couldn't find relevant information in the uploaded document.",

                sources: []

            });

        }


        // Step 5: Build document context

        console.log("Building document context...");

        const context = buildContext(relevantChunks);


        // Step 6: Generate answer using Groq

        console.log("Generating answer using Groq...");

        const answer = await generateAnswer(
            question,
            context
        );


        // Step 7: Prepare source information

        const sources = relevantChunks.map(chunk => ({

            chunkId: chunk._id,

            chunkIndex: chunk.chunkIndex,

            pageNumber: chunk.pageNumber,

            score: chunk.score,

            text: chunk.text

        }));


        // Step 8: Return response

        res.status(200).json({

            success: true,

            question,

            answer,

            sources

        });


    } catch (error) {

        console.error("Chat Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to generate an answer.",

            error: error.message

        });

    }

};