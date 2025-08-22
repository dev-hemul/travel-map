import bcrypt from 'bcrypt';
import User from '../model/user.js';
import { createTokens, verifyToken, removeRefTokenByIss } from './../utils/authUtil.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Користувач уже існує' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const { accessT, refreshT } = await createTokens(user._id);
    user.refreshToken = refreshT;
    await user.save();

    res
      .status(200)
      .json({
        accessToken: accessT,
        refreshToken: refreshT,
        user: { id: user._id, username, email },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Невірний логін' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Невірний пароль' });

    const { accessT, refreshT } = await createTokens(user._id);
    user.refreshToken = refreshT;
    await user.save();

    res.json({
      accessToken: accessT,
      refreshToken: refreshT,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.iss);

    if (!user) return res.status(401).json({ message: 'Невірний токен для юзера' });

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

export const getRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ token: refreshToken });
    if (!tokenDoc) return res.status(403).json({ message: 'Invalid refresh token' });

    const decoded = verifyToken(tokenDoc.jti); // Перевірка jti (опціонально)
    const user = await User.findById(tokenDoc.params.iss);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const { accessT, refreshT } = await createTokens(user._id);
    user.refreshToken = refreshT;
    await user.save();
    await removeRefTokenByIss(user._id);

    res.status(200).json({ accessToken: accessT, refreshToken: refreshT });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: 'Помилка оновлення токена', error: error.message });
  }
};
