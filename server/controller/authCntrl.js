import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач уже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const savedUser = await User.findById(user._id);
    if (!savedUser) {
      throw new Error('користувача не знайдено');
    }

    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: savedUser._id, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Невірний логін' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не надано' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Невірний токен для юзера' });
    }

    const { username, email } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.json({ message: 'Профіль оновлено', user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Невірний токен' });
  }
};