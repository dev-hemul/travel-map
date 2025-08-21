// server/controllers/markerController.js
import Marker from '../model/marker.js';

// Создание нового маркера
export const createMarker = async (req, res) => {
  try {
    // Если пришёл файл от multer/cloudinary — берём URL
    const avatarUrl = req.file ? req.file.path || req.file.url : '';

    // Нормализация данных из body (поддержка как JSON, так и multipart/form-data)
    const {
      title,
      category,
      description = '',
      private: isPrivate = false,
      lat,
      lng,
      tags = [],
      fileUrls = [],
    } = req.body;

    if (!title || !category || lat === undefined || lng === undefined) {
      return res
        .status(400)
        .json({ error: 'Отсутствуют обязательные поля: title, category, lat, lng' });
    }

    const normalizeArray = v => {
      if (Array.isArray(v)) return v;
      if (typeof v === 'string' && v.length)
        return v.includes(',')
          ? v
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [v];
      return [];
    };

    const markerData = {
      title,
      category,
      description,
      private: isPrivate === true || isPrivate === 'true',
      lat: Number(lat),
      lng: Number(lng),
      tags: normalizeArray(tags),
      fileUrls: normalizeArray(fileUrls),
      avatarUrl,
    };

    const marker = new Marker(markerData);
    await marker.save();
    res.status(201).json(marker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получение всех маркеров
export const getMarkers = async (req, res) => {
  try {
    const markers = await Marker.find();
    res.status(200).json(markers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновление маркера
export const updateMarker = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMarker = await Marker.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMarker) {
      return res.status(404).json({ error: 'Маркер не найден' });
    }
    res.status(200).json(updatedMarker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удаление маркера (пустая болванка)
export const deleteMarker = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMarker = await Marker.findByIdAndDelete(id);
    if (!deletedMarker) {
      return res.status(404).json({ error: 'Маркер не найден' });
    }
    res.status(200).json({ message: 'Маркер удалён' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
