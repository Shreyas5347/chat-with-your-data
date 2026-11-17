import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true
        },

        chunkIndex: {
            type: Number,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        embedding: {
            type: [Number],
            default: []
        },

        pageNumber: {
            type: Number,
            default: null
        }
    },

    {
        timestamps: true
    }
);

chunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

const Chunk = mongoose.model("Chunk", chunkSchema);

export default Chunk;