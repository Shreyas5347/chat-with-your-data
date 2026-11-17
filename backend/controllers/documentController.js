export const uploadDocument = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a document."
            });
        }

        const file = req.file;

        res.status(200).json({

            success: true,

            message: "Document uploaded successfully!",

            document: {
                filename: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size
            }

        });

    } catch (error) {

        console.error("Upload Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Document upload failed."
        });

    }

};