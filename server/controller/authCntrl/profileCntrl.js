import User from '../../model/user.js';

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const userId = req.userId;  
    if (!userId) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    return res.json({
      message: 'Профіль оновлено',
      user,
    });

  } catch (e) {
    console.error('UpdateProfile error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};
