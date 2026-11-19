import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import "./SourceCitation.css";

function SourceCitation({ sources }) {
    const [expanded, setExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="source-citation">
            <button
                className="source-toggle"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <BookOpen size={13} />
                <span>{sources.length} source{sources.length > 1 ? "s" : ""} cited</span>
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {expanded && (
                <div className="source-list">
                    {sources.map((source, index) => (
                        <div key={source.chunkId || index} className="source-item">
                            <div className="source-header">
                                <span className="source-badge">Source {index + 1}</span>
                                <span className="source-meta">
                                    {source.pageNumber != null
                                        ? `Page ${source.pageNumber}`
                                        : `Chunk ${source.chunkIndex + 1}`}
                                    {source.score != null &&
                                        ` · Score: ${(source.score * 100).toFixed(0)}%`}
                                </span>
                            </div>
                            <p className="source-text">{source.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SourceCitation;
