import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, Loader, AlertCircle } from "lucide-react";
import { uploadDocument } from "../../api/api";
import "./DocumentUpload.css";

function DocumentUpload({ onDocumentUploaded, onCancel }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | uploading | success | error
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const ACCEPTED_TYPES = ["application/pdf", "text/plain"];
    const MAX_SIZE_MB = 20;

    const validateFile = (f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) {
            return "Only PDF and TXT files are supported.";
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            return `File must be under ${MAX_SIZE_MB}MB.`;
        }
        return null;
    };

    const handleFileSelect = (f) => {
        const error = validateFile(f);
        if (error) {
            setErrorMessage(error);
            setFile(null);
            return;
        }
        setErrorMessage("");
        setFile(f);
        setStatus("idle");
    };

    const handleInputChange = (e) => {
        const f = e.target.files?.[0];
        if (f) handleFileSelect(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileSelect(f);
    };

    const handleUpload = async () => {
        if (!file) return;
        setStatus("uploading");
        setProgress(0);

        try {
            const data = await uploadDocument(file, (progressEvent) => {
                const pct = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress(pct);
            });

            setStatus("success");
            setTimeout(() => {
                onDocumentUploaded(data.document);
            }, 800);
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error?.response?.data?.message || "Upload failed. Please try again."
            );
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="upload-page">
            <div className="upload-card">
                {/* Header */}
                <div className="upload-card-header">
                    <h2>Upload a Document</h2>
                    <p>Supported formats: PDF, TXT · Max size: {MAX_SIZE_MB}MB</p>
                    <button className="upload-close-btn" onClick={onCancel}>
                        <X size={18} />
                    </button>
                </div>

                {/* Drop Zone */}
                <div
                    className={`drop-zone ${isDragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                    onClick={() => !file && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="file-preview">
                            <div className="file-preview-icon">
                                <FileText size={32} />
                            </div>
                            <div className="file-preview-info">
                                <span className="file-preview-name">{file.name}</span>
                                <span className="file-preview-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button
                                className="file-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setStatus("idle");
                                    setProgress(0);
                                    setErrorMessage("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="drop-zone-content">
                            <div className="drop-icon">
                                <Upload size={30} />
                            </div>
                            <p className="drop-text">Drag & drop your file here</p>
                            <p className="drop-subtext">or click to browse</p>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                />

                {/* Error Message */}
                {errorMessage && (
                    <div className="upload-error">
                        <AlertCircle size={15} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Progress Bar */}
                {status === "uploading" && (
                    <div className="upload-progress">
                        <div className="progress-bar-track">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="progress-label">
                            {progress < 100 ? `Uploading… ${progress}%` : "Processing document…"}
                        </span>
                    </div>
                )}

                {/* Success */}
                {status === "success" && (
                    <div className="upload-success">
                        <CheckCircle size={16} />
                        <span>Document uploaded successfully!</span>
                    </div>
                )}

                {/* Actions */}
                <div className="upload-actions">
                    <button className="btn btn-ghost" onClick={onCancel} disabled={status === "uploading"}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || status === "uploading" || status === "success"}
                    >
                        {status === "uploading" ? (
                            <><Loader size={15} className="spin" /> Uploading…</>
                        ) : (
                            <><Upload size={15} /> Upload Document</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DocumentUpload;
