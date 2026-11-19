import { useState, useRef } from "react";
import { Send } from "lucide-react";
import "./MessageInput.css";

function MessageInput({ onSend, disabled }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e) => {
        setValue(e.target.value);
        // Auto-resize textarea
        const ta = textareaRef.current;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    };

    return (
        <form className="message-input-form" onSubmit={handleSubmit}>
            <div className="message-input-wrapper">
                <textarea
                    ref={textareaRef}
                    className="message-textarea"
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your document…"
                    rows={1}
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!value.trim() || disabled}
                    title="Send (Enter)"
                >
                    <Send size={17} />
                </button>
            </div>
            <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </form>
    );
}

export default MessageInput;
