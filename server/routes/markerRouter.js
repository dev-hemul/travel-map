// server/routes/markerRoutes.js
import express from 'express';
import { upload } from '../config/cloudinary-markers.js';

import { createMarker, getMarkers, updateMarker, deleteMarker } from '../controller/marker.js';

const router = express.Router();

// Завантаження файлів при створенні маркера
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const url = req.file.path || req.file.url;
    const publicId = req.file.filename || req.file.public_id;

    console.log('Успешна загрузка:', { url, publicId });
    return res.status(200).json({ url, publicId });
  } catch (e) {
    return res.status(500).json({ error: 'Помилка при завантаженні файлу', details: e.message });
  }
});

router.post('/marker', createMarker); // Создание
router.get('/markers', getMarkers); // Чтение
router.put('/marker/:id', updateMarker); // Обновление
router.delete('/marker/:id', deleteMarker); // Удаление

export default router;
