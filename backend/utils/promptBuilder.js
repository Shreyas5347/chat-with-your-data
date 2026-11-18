const buildContext = (chunks) => {

    return chunks.map((chunk, index) => {

        const sourceNumber = index + 1;

        return `
[Source ${sourceNumber}]

Document Page: ${chunk.pageNumber ?? "Not available"}

Chunk Index: ${chunk.chunkIndex}

Content:
${chunk.text}

`;

    }).join("\n--------------------\n");

};

export default buildContext;