import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ключі читаємо відносно цього файлу, а не "cwd", щоб не ламалось
const privateKey = readFileSync(path.join(__dirname, '../keys/privateKey.pem'), 'utf8');
const publicKey = readFileSync(path.join(__dirname, '../keys/publicKey.pem'), 'utf8');

const alg = 'RS512';
const accessLifedurMs = 7 * 24 * 60 * 60 * 1000;     // 7 днів (для access токена)
const refreshLifedurMs = 21 * 24 * 60 * 60 * 1000;   // 21 день (для refresh токена)

const isProd = process.env.NODE_ENV === 'production';

if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах server/keys/');
}

const setRefreshCookie = (res, refreshT) => {
  res.cookie('refreshToken', refreshT, {
    httpOnly: true,
    secure: isProd,       // локально має бути false, інакше cookie не встановиться по http
    sameSite: 'lax',
    maxAge: refreshLifedurMs,
    path: '/',
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const message =
        existingUser.email === email
          ? 'Електронна пошта вже використовується'
          : 'Імʼя користувача вже зайнято';

      return res.status(400).json({ success: false, message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      provider: 'local',
      roles: ['user'], 
    });

    await user.save();

    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    setRefreshCookie(res, refreshT);
    return res.status(200).json({ accessToken: accessT });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Невірний email або пароль',
      });
    }

    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    setRefreshCookie(res, refreshT);
    return res.json({ accessToken: accessT });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      if (tokenDoc) await Tokens.findByIdAndDelete(tokenDoc._id);
      return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    const { accessT } = createAccessT({ id: tokenDoc.userId });
    return res.json({ accessToken: accessT });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const decoded = jwt.verify(token, publicKey, { algorithms: [alg] });
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: 'Користувача не знайдено' });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    return res.json({ message: 'Профіль оновлено', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(401).json({ message: 'Невірний токен' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const decoded = jwt.verify(token, publicKey, { algorithms: [alg] });

    await Tokens.deleteMany({ userId: decoded.id });
    clearRefreshCookie(res);

    return res.status(200).json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Помилка виходу' });
  }
};

// Helper functions
export const createAccessT = (payload) => {
  const accessT = jwt.sign(payload, privateKey, {
    algorithm: alg,
    expiresIn: Math.floor(accessLifedurMs / 1000),
  });
  return { accessT };
};

export const createTokens = async (userId) => {
  const accessT = jwt.sign({ id: userId }, privateKey, {
    algorithm: alg,
    expiresIn: Math.floor(accessLifedurMs / 1000),
  });

  const refreshT = nanoid();
  const expiresAt = Date.now() + refreshLifedurMs;

  await Tokens.create({ userId, refreshToken: refreshT, expiresAt });

  return { accessT, refreshT };
};
