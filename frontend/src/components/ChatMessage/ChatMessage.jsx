import { Bot, User, AlertCircle } from "lucide-react";
import SourceCitation from "../SourceCitation/SourceCitation";
import "./ChatMessage.css";

function ChatMessage({ message }) {
    const isUser = message.role === "user";
    const isError = message.role === "error";
    const isAssistant = message.role === "assistant";

    return (
        <div className={`chat-message ${isUser ? "user" : "ai"} ${isError ? "error-msg" : ""}`}>
            {/* Avatar */}
            <div className={`message-avatar ${isUser ? "user-avatar" : "ai-avatar"}`}>
                {isUser ? (
                    <User size={15} />
                ) : isError ? (
                    <AlertCircle size={15} />
                ) : (
                    <Bot size={15} />
                )}
            </div>

            {/* Bubble */}
            <div className="message-bubble">
                <div className="message-content">
                    {message.content}
                </div>

                {/* Sources (AI messages only) */}
                {isAssistant &&
                 message.answerable !== false &&
                 message.sources?.length > 0 &&
                 !message.content?.toLowerCase().includes("does not contain") &&
                 !message.content?.toLowerCase().includes("not found in") &&
                 !message.content?.toLowerCase().includes("not mentioned") &&
                 !message.content?.toLowerCase().includes("couldn't find") &&
                 !message.content?.toLowerCase().includes("could not find") && (
                    <SourceCitation sources={message.sources} />
                )}
            </div>
        </div>
    );
}

export default ChatMessage;
