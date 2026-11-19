import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import DocumentUpload from "./components/DocumentUpload/DocumentUpload";
import { getDocuments } from "./api/api";
import "./App.css";

function App() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [loadingDocuments, setLoadingDocuments] = useState(true);

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoadingDocuments(true);
            const data = await getDocuments();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            setDocuments([]);
        } finally {
            setLoadingDocuments(false);
        }
    };

    const handleDocumentUploaded = (newDocument) => {
        // Ensure both _id and id are present
        const doc = {
            ...newDocument,
            _id: newDocument._id || newDocument.id,
        };
        setDocuments((prev) => [doc, ...prev]);
        setSelectedDocument(doc);
        setShowUpload(false);
    };

    const handleSelectDocument = (doc) => {
        setSelectedDocument({
            ...doc,
            _id: doc._id || doc.id,
        });
        setShowUpload(false);
    };

    const handleDocumentDeleted = (documentId) => {
        setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== documentId));
        if ((selectedDocument?._id || selectedDocument?.id) === documentId) {
            setSelectedDocument(null);
        }
    };

    return (
        <div className="app">
            <Sidebar
                documents={documents}
                selectedDocument={selectedDocument}
                onSelectDocument={handleSelectDocument}
                onUploadClick={() => setShowUpload(true)}
                onDocumentDeleted={handleDocumentDeleted}
                loading={loadingDocuments}
            />

            <main className="main-content">
                {showUpload ? (
                    <DocumentUpload
                        onDocumentUploaded={handleDocumentUploaded}
                        onCancel={() => setShowUpload(false)}
                    />
                ) : (
                    <ChatWindow selectedDocument={selectedDocument} />
                )}
            </main>
        </div>
    );
}

export default App;
