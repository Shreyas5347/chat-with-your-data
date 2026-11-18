const extractTXTText = (buffer) => {

    const text = buffer.toString("utf-8");

    if (!text.trim()) {
        throw new Error("The uploaded TXT file is empty.");
    }

    return [
        {
            pageNumber: null,
            text: text
        }
    ];

};

export default extractTXTText;