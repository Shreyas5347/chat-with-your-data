const buildContext = (chunks) => {

    return chunks.map((chunk, index) => {

        return `
[Source ${index + 1}]
Document Page: ${chunk.pageNumber ?? "Not available"}
Chunk Index: ${chunk.chunkIndex}

Content:
${chunk.text}
        `;

    }).join("\n\n");

};

export default buildContext;