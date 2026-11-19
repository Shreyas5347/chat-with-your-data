import { useState, useRef, useEffect } from "react";
import { MessageSquare, FileText } from "lucide-react";
import ChatMessage from "../ChatMessage/ChatMessage";
import MessageInput from "../MessageInput/MessageInput";
import { chatWithDocument } from "../../api/api";
import "./ChatWindow.css";

function ChatWindow({ selectedDocument }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Reset chat when document changes
    useEffect(() => {
        setMessages([]);
    }, [selectedDocument?._id, selectedDocument?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (question) => {
        const docId = selectedDocument?._id || selectedDocument?.id;
        if (!docId || !question.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: question,
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const data = await chatWithDocument(docId, question);

            const aiMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.answer,
                sources: data.sources || [],
                answerable: data.answerable
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                role: "error",
                content: error?.response?.data?.message || "Failed to get a response. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    // No document selected
    if (!selectedDocument) {
        return (
            <div className="chat-window chat-empty">
                <div className="empty-state">
                    <div className="empty-icon">
                        <MessageSquare size={40} />
                    </div>
                    <h2>Chat With Your Documents</h2>
                    <p>Upload a document and select it from the sidebar to start asking questions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-header-icon">
                        <FileText size={16} />
                    </div>
                    <div>
                        <p className="chat-header-title">{selectedDocument.filename}</p>
                        <p className="chat-header-meta">
                            {selectedDocument.totalChunks} chunks · Ready to chat
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-start-hint">
                        <p>Ask anything about <strong>{selectedDocument.filename}</strong></p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))
                )}

                {loading && (
                    <div className="chat-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput onSend={handleSendMessage} disabled={loading} />
        </div>
    );
}

export default ChatWindow;
