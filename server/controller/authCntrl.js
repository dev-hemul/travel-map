import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../model/user.js';
import Tokens from '../model/token.js';
import { readFileSync } from 'fs'; // Залишаємо fs

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 15 * 60 * 1000; // 15 хвилин для access token
const refreshLifedur = 7 * 24 * 60 * 60 * 1000; // 7 днів для refresh token

if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах keys/');
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) return res.status(400).json({ message: 'Username вже зайнято' });
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return res.status(400).json({ message: 'Email вже зайнято' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, provider: 'local' });
    await user.save();

    const { accessT, refreshT } = await createTokens(user._id);
    if (!refreshT || !accessT) throw new Error('Помилка генерації токенів');

    await Tokens.create({ refreshToken: refreshT, userId: user._id, expiresAt: Date.now() + refreshLifedur });

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshLifedur,
    });
    res.status(200).json({ accessToken: accessT, user: { id: user._id, username, email } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Такого користувача не існує' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Неправильний пароль' });

    const { accessT, refreshT } = await createTokens(user._id);
    if (!refreshT || !accessT) throw new Error('Помилка генерації токенів');

    await Tokens.create({ refreshToken: refreshT, userId: user._id, expiresAt: Date.now() + refreshLifedur });

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshLifedur,
    });
    res.json({ accessToken: accessT, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const userId = verifyToken(token);
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ message: 'Невірний токен для юзера' });

    const { username, email } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.json({ message: 'Профіль оновлено', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(401).json({ message: 'Невірний токен' });
  }
};

export const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc) return res.status(403).json({ message: 'Invalid refresh token' });

    const user = await User.findById(tokenDoc.userId);
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    await Tokens.findByIdAndDelete(tokenDoc._id); // Видаляємо старий

    const { accessT, refreshT } = await createTokens(user._id);
    if (!refreshT || !accessT) throw new Error('Помилка генерації токенів');

    await Tokens.create({ refreshToken: refreshT, userId: user._id, expiresAt: Date.now() + refreshLifedur });

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshLifedur,
    });

    res.status(200).json({ accessToken: accessT });
  } catch (error) {
    console.error('RefreshToken error:', error);
    res.status(500).json({ message: 'Помилка оновлення токена' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const userId = verifyToken(token);
    await Tokens.deleteMany({ userId }); // Видаляємо усі токени для користувача
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Помилка виходу' });
  }
};

// Функції для створення та верифікації токенів
const createAccessT = (payload) => {
  const expiration = Math.floor(Date.now() / 1000) + Math.floor(lifedur / 1000);
  payload.exp = expiration;
  const token = jwt.sign(payload, privateKey, { algorithm: alg });
  return { token };
};

const createRefreshT = async (userId) => {
  const refreshToken = nanoid();
  await Tokens.create({ refreshToken, userId, expiresAt: Date.now() + refreshLifedur });
  return refreshToken;
};

const createTokens = async (userId) => {
  if (!userId) throw new Error('userId is undefined');
  const { token: accessT } = createAccessT({ iss: userId });
  const refreshT = await createRefreshT(userId);
  return { accessT, refreshT };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: [alg] });
    return decoded.iss; 
  } catch (error) {
    throw new Error('Невірний токен');
  }
};