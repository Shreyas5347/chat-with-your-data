import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import documentRoutes from "./routes/documentRoutes.js";

import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Chat With Your Data API is running!");
});
// Document routes
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);

// Start server after database connection
const startServer = async () => {

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};

startServer();