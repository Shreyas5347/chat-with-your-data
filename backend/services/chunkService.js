const CHUNK_SIZE = 400;
const CHUNK_OVERLAP = 60;

const createChunks = (pages) => {

    const chunks = [];

    let chunkIndex = 0;

    for (const page of pages) {

        const words = page.text.split(/\s+/).filter(Boolean);

        let start = 0;

        while (start < words.length) {

            const end = Math.min(
                start + CHUNK_SIZE,
                words.length
            );

            const chunkWords = words.slice(start, end);

            const chunkText = chunkWords.join(" ");

            chunks.push({

                chunkIndex: chunkIndex++,

                text: chunkText,

                pageNumber: page.pageNumber

            });

            if (end === words.length) {
                break;
            }

            start = end - CHUNK_OVERLAP;
            //if chunk overlap=10 then wes should strart from  the nth word of previous chunkart to preserve the context


        }

    }

    return chunks;

};

export default createChunks;