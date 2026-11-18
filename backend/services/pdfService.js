import { PDFParse } from "pdf-parse";

const extractPDFText = async (buffer) => {

    const parser = new PDFParse({
        data: buffer
    });

    try {

        const result = await parser.getText();

        // Extract text page by page
        const pages = result.pages.map((page, index) => ({
            pageNumber: page.num || index + 1,
            text: page.text || ""
        }));

        return pages;

    } finally {

        // Release PDF parser resources
        await parser.destroy();

    }

};

export default extractPDFText;