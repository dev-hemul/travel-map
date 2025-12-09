import { readFileSync } from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 7 * 24 * 60 * 1000;        // 7 днів
const refreshLifedur = 21 * 24 * 60 * 1000; // 21 день

if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах keys/');
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

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
    });
    await user.save();

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshLifedur,
      path: '/',
    });

    res.status(201).json({ accessToken: accessT });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
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

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshLifedur,
      path: '/',
    });

    res.json({ accessToken: accessT });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
export const getRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    const { accessT } = createAccessT({ id: tokenDoc.userId });
    res.json({ accessToken: accessT });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
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
    res.json({ message: 'Профіль оновлено', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(401).json({ message: 'Невірний токен' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const decoded = jwt.verify(token, publicKey, { algorithms: [alg] });
    Tokens.deleteMany({ userId: decoded.id });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Помилка виходу' });
  }
};

const createAccessT = (payload) => {
  const accessT = jwt.sign(payload, privateKey, {
    algorithm: alg,
    expiresIn: lifedur / 1000,
  });
  return { accessT };
};

export const createTokens = async (userId) => {
  const accessT = jwt.sign({ id: userId }, privateKey, {
    algorithm: alg,
    expiresIn: lifedur / 1000,
  });

  const refreshT = nanoid();
  const expiresAt = Date.now() + refreshLifedur;

  await Tokens.create({ userId, refreshToken: refreshT, expiresAt });

  return { accessT, refreshT };
};