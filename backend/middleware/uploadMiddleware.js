import multer from "multer";
import path from "path";

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Validate file type
const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname).toLowerCase();

    const isPDF =
        extension === ".pdf" &&
        file.mimetype === "application/pdf";

    const isTXT =
        extension === ".txt" &&
        file.mimetype === "text/plain";

    if (isPDF || isTXT) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and TXT files are allowed!"), false);
    }
};

// Configure multer
const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024
    }

});

export default upload;