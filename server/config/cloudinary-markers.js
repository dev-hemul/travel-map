import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

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
      // Применяем трансформации только к изображениям
      transformation: isImage
        ? [
            {
              width: 800,
              height: 600,
              crop: 'limit', // Сохраняет пропорции, не превышает указанные размеры
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
    fileSize: 50 * 1024 * 1024, // 50MB лимит
  },
});

export { cloudinary, upload };
