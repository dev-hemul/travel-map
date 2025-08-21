import Marker from '../model/marker.js';

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не завантажений' });
    }

    const avatarUrl = req.file.path || req.file.url;
    const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка при завантаженні файлу' });
  }
};
