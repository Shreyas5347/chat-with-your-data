import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});


// Upload a document
export const uploadDocument = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("document", file);

    const response = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
    });

    return response.data;
};


// Fetch all documents
export const getDocuments = async () => {
    const response = await api.get("/documents");
    return response.data;
};


// Delete a document
export const deleteDocument = async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
};


// Chat with a document
export const chatWithDocument = async (documentId, question) => {
    const response = await api.post(`/chat/${documentId}`, { question });
    return response.data;
};
