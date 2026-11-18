import mongoose from "mongoose";

import Chunk from "../models/Chunk.js";

const retrieveRelevantChunks = async (
    queryEmbedding,
    documentId,
    limit = 3
) => {

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new Error("Invalid document ID.");
    }

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== 768) {
        throw new Error("Invalid query embedding dimensions.");
    }

    const results = await Chunk.aggregate([

        {
            $vectorSearch: {

                index: "vector_index",

                path: "embedding",

                queryVector: queryEmbedding,

                numCandidates: 30,

                limit: limit,

                filter: {
                    documentId: new mongoose.Types.ObjectId(documentId)
                }

            }
        },

        {
            $project: {

                _id: 1,

                documentId: 1,

                chunkIndex: 1,

                text: 1,

                pageNumber: 1,

                score: {
                    $meta: "vectorSearchScore"
                }

            }
        }

    ]);

    return results;

};

export default retrieveRelevantChunks;