import path from 'path';
import { fileURLToPath } from 'url';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${NODE_ENV}`),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype?.startsWith('image/');

    return {
      folder: 'mediafiles-marker',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'webm'],
      transformation: isImage
        ? [
            {
              quality: 'auto:good',
              fetch_format: 'auto',
            },
          ]
        : undefined,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

export { cloudinary, upload };
