import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";

const DIMENSIONS = Number(
    process.env.EMBEDDING_DIMENSIONS || 768
);

// Initialize Gemini client
const getGeminiClient = () => {

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing.");
    }

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

};


// Generate embedding for one document chunk
const generateEmbedding = async (text, filename) => {

    try {

        const ai = getGeminiClient();

        // Format document according to Gemini's
        // question-answering retrieval instructions
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

            throw new Error("Invalid embedding returned by Gemini.");

        }

        return embedding;

    } catch (error) {

        console.error("Gemini Embedding Error:", error.message);

        throw error;

    }

};

export default generateEmbedding;