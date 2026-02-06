import { readFileSync } from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 7 * 24 * 3600 * 1000 * 1000;         // 7 днів
const refreshLifedur = 21 * 24 * 3600 * 1000 * 1000; // 21 день

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
      roles: ['user'], 
    });
    await user.save();

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: refreshLifedur,
      domain: 'localhost',
      path: '/',
    });

    res.status(200).json({ accessToken: accessT });
  } catch {
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNorm = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Невірний email або пароль',
      });
    }

    if (!user.password) {
      return res.status(409).json({
        success: false,
        message: 'Ця адреса використовувалась для авторизації через Google',
        code: 'GOOGLE_AUTH_ONLY',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Невірний email або пароль',
      });
    }

    if (!Array.isArray(user.roles) || user.roles.length === 0) {
      user.roles = ['user'];
      await user.save();
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


export const googleLogin = async (req, res) => {
  try {
    const gUser = req.googleUser;

    const emailNorm = (gUser.email || '').trim().toLowerCase();

    let user = await User.findOne({
      $or: [{ googleId: gUser.googleId }, { email: emailNorm }],
    });

    if (user && user.email === emailNorm && user.password) {
      return res.status(409).json({
        message: 'Ця адреса використовувалась для авторизації через логін і пароль',
        code: 'LOCAL_AUTH_ONLY',
      });
    }

    if (!user) {
      user = new User({
        username: gUser.name || emailNorm.split('@')[0],
        email: emailNorm,
        provider: 'google',
        googleId: gUser.googleId,
        roles: ['user'],
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = gUser.googleId;
      if (!user.provider) user.provider = 'google';
      if (!Array.isArray(user.roles) || user.roles.length === 0) user.roles = ['user'];
      await user.save();
    }

    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
      path: '/',
    });

    return res.json({ accessToken: accessT });
  } catch (err) {
    console.error('googleLogin controller error:', err);
    return res.status(500).json({ message: 'Server error' });
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
    const user = await User.findById(tokenDoc.userId).select('roles');
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : ['user'];

    const { accessT } = createAccessT({ id: tokenDoc.userId, roles });
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

  if (token) {
    const payload = jwt.decode(token);
    const userId = payload?.id;
    if (userId) await Tokens.deleteMany({ userId });
  }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return res.json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Помилка виходу' });
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
  const user = await User.findById(userId).select('roles');
  const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : ['user'];

  const accessT = jwt.sign({ id: userId, roles }, privateKey, {
    algorithm: alg,
    expiresIn: lifedur / 1000,
  });

  const refreshT = nanoid();
  const expiresAt = Date.now() + refreshLifedur;

  await Tokens.create({ userId, refreshToken: refreshT, expiresAt });

  return { accessT, refreshT };
};
