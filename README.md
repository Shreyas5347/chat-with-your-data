# Chat With Your Data – Mini RAG Application

A full-stack Retrieval-Augmented Generation (RAG) application that allows users to upload PDF and TXT documents and ask questions about their content. The application retrieves relevant information from uploaded documents and uses an LLM to generate context-grounded answers with source citations.

## Features

- Upload PDF and TXT documents.
- Automatic text extraction and preprocessing.
- Text chunking with overlapping content.
- Semantic search using vector embeddings.
- AI-powered question answering.
- Source citations for generated answers.
- Relevance filtering and no-answer handling.
- Responsive user interface.

## Live Demo

- **Frontend:** https://chat-with-your-data-six.vercel.app/     
- **Backend:** https://chat-with-your-data-87yu.onrender.com

## Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend |
| Node.js + Express | Backend and REST APIs |
| MongoDB Atlas | Document and embedding storage |
| Mongoose | Database modelling |
| Gemini API | Text embedding generation |
| MongoDB Atlas Vector Search | Semantic retrieval |
| Groq API | LLM-based answer generation |
| Multer | File uploads |
| pdf-parse | PDF text extraction |
| Render | Backend deployment |
| Vercel | Frontend deployment |

## RAG Workflow

1. **Document Upload:** Users upload PDF or TXT files through the React interface.
2. **Text Extraction:** The backend extracts text using pdf-parse for PDFs and UTF-8 decoding for TXT files.
3. **Preprocessing:** Extracted text is cleaned by normalizing whitespace.
4. **Chunking:** Text is divided into smaller chunks of 400 words with a 60-word overlap to preserve context between consecutive chunks.
5. **Embedding Generation:** Gemini generates 768-dimensional vector embeddings for each chunk.
6. **Storage:** Document chunks and their embeddings are stored in MongoDB Atlas.
7. **Retrieval:** User questions are converted into embeddings, and MongoDB Atlas Vector Search retrieves the three most relevant chunks using cosine similarity.
8. **Answer Generation:** Retrieved chunks are passed as context to Groq, which generates an answer using only the supplied document information.
9. **Citations:** The LLM returns structured JSON containing answerability and source numbers. The backend uses these source numbers to return the corresponding document chunks as citations.

## Chunking and Embedding Approach

- **Chunk Size:** 400 words.
- **Chunk Overlap:** 60 words.
- **Embedding Model:** Gemini (`gemini-embedding-2`).
- **Embedding Dimensions:** 768.
- **Vector Search:** MongoDB Atlas Vector Search using cosine similarity.
- **Retrieval Limit:** Top 3 relevant chunks.

Overlapping chunks help preserve context when related information spans chunk boundaries. Embeddings allow semantic retrieval rather than relying only on exact keyword matching.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Gemini API key
- Groq API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd chat-with-your-data
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
EMBEDDING_DIMENSIONS=768
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
MIN_RELEVANCE_SCORE=0.75
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite, usually `http://localhost:5173`.

### 4. MongoDB Vector Search Configuration

Create a Vector Search index named `vector_index` on the `chunks` collection.

Configure the vector field to use:

- Path: `embedding`
- Dimensions: `768`
- Similarity: `cosine`

Also configure `documentId` as a filter field.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Configure the production `VITE_API_BASE_URL` with the deployed backend URL and allow the Vercel frontend origin in backend CORS settings.

## Future Improvements

With more development time, I would focus on:

1. **Hybrid Search:** Combine vector search with keyword-based retrieval to improve search accuracy.
2. **Reranking:** Use a reranking model to improve the ordering of retrieved chunks.
3. **Semantic Chunking:** Experiment with document-aware chunking to preserve more meaningful context.
4. **Streaming Responses:** Display AI-generated answers progressively.
5. **Chat History:** Store conversations for future access.
6. **Authentication:** Add user authentication and document-level access control.
7. **Evaluation:** Implement retrieval and answer evaluation to measure relevance, faithfulness and citation accuracy.

---



