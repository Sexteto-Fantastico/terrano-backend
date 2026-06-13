import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { createHash } from "crypto";
import path from "path";

const UPLOAD_DIR = path.resolve(__dirname, "../../uploads/profiles");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/pjpeg", "image/png", "image/webp"];

const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const hash = createHash("sha256")
            .update(`${Date.now()}-${Math.random()}`)
            .digest("hex");
        const ext = path.extname(file.originalname);
        const filename = `${hash}${ext}`;
        cb(null, filename);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed. Only image files (jpeg, png, webp) are accepted.`));
    }
};

export const uploadAvatar = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
});
