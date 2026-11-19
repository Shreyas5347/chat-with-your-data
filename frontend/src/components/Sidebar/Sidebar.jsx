import { FileText, Upload, Trash2, CheckCircle, Loader, Sun, Moon } from "lucide-react";
import "./Sidebar.css";

function Sidebar({
    documents,
    selectedDocument,
    onSelectDocument,
    onUploadClick,
    onDocumentDeleted,
    loading,
    theme,
    onToggleTheme,
}) {
    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDelete = async (e, docId) => {
        e.stopPropagation();
        if (!window.confirm("Remove this document?")) return;
        onDocumentDeleted(docId);
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FileText size={20} />
                </div>
                <span className="logo-text">Chat-With-Your-Data</span>
                <button
                    className="theme-toggle-btn"
                    onClick={onToggleTheme}
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
            </div>

            {/* Upload Button */}
            <div className="sidebar-upload">
                <button className="btn btn-primary upload-btn" onClick={onUploadClick}>
                    <Upload size={16} />
                    Upload Document
                </button>
            </div>

            {/* Documents List */}
            <div className="sidebar-section">
                <p className="sidebar-label">Your Documents</p>

                {loading ? (
                    <div className="sidebar-loading">
                        <Loader size={16} className="spin" />
                        <span>Loading...</span>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="sidebar-empty">
                        <p>No documents yet.</p>
                        <p>Upload one to get started!</p>
                    </div>
                ) : (
                    <ul className="document-list">
                        {documents.map((doc) => {
                            const docId = doc._id || doc.id;
                            const isSelected = (selectedDocument?._id || selectedDocument?.id) === docId;

                            return (
                                <li
                                    key={docId}
                                    className={`document-item ${isSelected ? "active" : ""}`}
                                    onClick={() => onSelectDocument(doc)}
                                >
                                    <div className="document-icon">
                                        <FileText size={15} />
                                    </div>

                                    <div className="document-info">
                                        <span className="document-name">{doc.filename}</span>
                                        <span className="document-meta">
                                            {formatFileSize(doc.fileSize)}
                                            {doc.totalChunks ? ` · ${doc.totalChunks} chunks` : ""}
                                        </span>
                                    </div>

                                    <div className="document-actions">
                                        {doc.status === "completed" && (
                                            <CheckCircle size={13} className="status-icon success" />
                                        )}
                                        {doc.status === "processing" && (
                                            <Loader size={13} className="status-icon spin" />
                                        )}
                                        <button
                                            className="delete-btn"
                                            onClick={(e) => handleDelete(e, docId)}
                                            title="Remove document"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
