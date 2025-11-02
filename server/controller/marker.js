// server/controllers/markerController.js
import Marker from '../model/marker.js';

export const createMarker = async (req, res) => {
  try {
    const avatarUrl = req.file ? req.file.path || req.file.url : '';

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
      return res.status(400).json({ error: 'Відсутні обовязкові поля: title, category, lat, lng' });
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

export const getMarkers = async (req, res) => {
  try {
    const markers = await Marker.find();
    res.status(200).json(markers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMarker = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMarker = await Marker.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMarker) {
      return res.status(404).json({ error: 'Маркер не знайдений' });
    }
    res.status(200).json(updatedMarker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMarker = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMarker = await Marker.findByIdAndDelete(id);
    if (!deletedMarker) {
      return res.status(404).json({ error: 'Маркер не знайдений' });
    }
    res.status(200).json({ message: 'Маркер видалений' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMarkerMedia = async (req, res) => {
  try {
    const { id } = req.params; // marker id
    const { url } = req.body; // URL медиа, которое нужно удалить
    if (!url) {
      return res.status(400).json({ error: 'Не вказано url для видалення' });
    }

    const marker = await Marker.findById(id);
    if (!marker) {
      return res.status(404).json({ error: 'Маркер не знайдений' });
    }

    const before = marker.fileUrls.length;
    marker.fileUrls = marker.fileUrls.filter(u => u !== url);

    if (marker.fileUrls.length === before) {
      return res.status(404).json({ error: 'Медіа не знайдено в маркері' });
    }

    await marker.save();
    return res.status(200).json({ message: 'Медіа видалено', marker });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
