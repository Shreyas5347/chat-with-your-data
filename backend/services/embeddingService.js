import { GoogleGenAI } from "@google/genai";

const MODEL =
    process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";

const DIMENSIONS = Number(
    process.env.EMBEDDING_DIMENSIONS || 768
);

const getGeminiClient = () => {

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
    }

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

};


// Generate document embedding
export const generateEmbedding = async (text, filename) => {

    const ai = getGeminiClient();

    const formattedText = `title: ${filename} | text: ${text}`;

    const response = await ai.models.embedContent({

        model: MODEL,

        contents: formattedText,

        config: {
            outputDimensionality: DIMENSIONS
        }

    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length !== DIMENSIONS) {
        throw new Error("Invalid document embedding.");
    }

    return embedding;

};


// Generate question embedding
export const generateQueryEmbedding = async (question) => {

    const ai = getGeminiClient();

    const formattedQuestion =
        `task: question answering | query: ${question}`;

    const response = await ai.models.embedContent({

        model: MODEL,

        contents: formattedQuestion,

        config: {
            outputDimensionality: DIMENSIONS
        }

    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length !== DIMENSIONS) {
        throw new Error("Invalid question embedding.");
    }

    return embedding;

};