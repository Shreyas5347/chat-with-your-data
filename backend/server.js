import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import documentRoutes from "./routes/documentRoutes.js";

import searchRoutes from "./routes/searchRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://chat-with-your-data-six.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Chat With Your Data API is running!");
});
// Document routes
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);

// Start server after database connection
const startServer = async () => {

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};

startServer();