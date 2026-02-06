import { readFileSync } from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 7 * 24 * 3600 * 1000;        // 7 днів
const refreshLifedur = 21 * 24 * 3600 * 1000; // 21 день

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const setRefreshCookie = (res, refreshT) => {
  res.cookie('refreshToken', refreshT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshLifedur,
    path: '/',
  });
};


if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах keys/');
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailNorm = normalizeEmail(email);
    const usernameNorm = String(username || '').trim();

const existingByEmail = await User.findOne({ email: emailNorm }).select('provider');

  if (existingByEmail) {
    if (existingByEmail.provider === 'google') {
      return res.status(409).json({
        success: false,
        message:
          'Ця адреса вже використовується для входу через Google. Будь ласка авторизуйтесь обраним методом.',
        code: 'GOOGLE_AUTH_ONLY',
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Електронна пошта вже використовується',
    });
  }
    const existingByUsername = await User.findOne({ username: usernameNorm });
    if (existingByUsername) {
      return res.status(400).json({ success: false, message: "Імʼя користувача вже зайнято" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: usernameNorm,
      email: emailNorm,
      password: hashedPassword,
      provider: 'local',
      roles: ['user'],
    });

    await user.save();

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);

    setRefreshCookie(res, refreshT);
    return res.status(200).json({ accessToken: accessT });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};


export const login = async (req, res) => {
  try {
    const emailNorm = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email: emailNorm });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача з таким email не існує',
        code: 'USER_NOT_FOUND',
      });
    }

    if (user.provider === 'google') {
      return res.status(409).json({
        success: false,
        message: 'Цей email зареєстрований через Google. Будь ласка увійдіть обраним методом.',
        code: 'GOOGLE_AUTH_ONLY',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Невірний пароль',
        code: 'WRONG_PASSWORD',
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

    return res.json({ accessToken: accessT });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};


export const googleLogin = async (req, res) => {
  try {
    const gUser = req.googleUser;
    const emailNorm = (gUser.email || '').trim().toLowerCase();

    const byGoogleId = await User.findOne({ googleId: gUser.googleId });

    if (byGoogleId) {
      if (!Array.isArray(byGoogleId.roles) || byGoogleId.roles.length === 0) {
        byGoogleId.roles = ['user'];
        await byGoogleId.save();
      }

      await Tokens.deleteMany({ userId: byGoogleId._id });
      const { accessT, refreshT } = await createTokens(byGoogleId._id);

      res.cookie('refreshToken', refreshT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshLifedur,
        path: '/',
      });

      return res.json({ accessToken: accessT });
    }

    const byEmail = await User.findOne({ email: emailNorm });

    if (byEmail) {
      if (byEmail.provider === 'local' || byEmail.password) {
        return res.status(409).json({
          message: 'Ця адреса вже зареєстрована локально. Будь ласка авторизуйтесь обраним методом.',
          code: 'LOCAL_AUTH_ONLY',
        });
      }
      if (!Array.isArray(byEmail.roles) || byEmail.roles.length === 0) {
        byEmail.roles = ['user'];
        await byEmail.save();
      }

      await Tokens.deleteMany({ userId: byEmail._id });
      const { accessT, refreshT } = await createTokens(byEmail._id);

      res.cookie('refreshToken', refreshT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshLifedur,
        path: '/',
      });

      return res.json({ accessToken: accessT });
    }

    const created = await User.create({
      username: gUser.name || emailNorm.split('@')[0],
      email: emailNorm,
      provider: 'google',
      googleId: gUser.googleId,
      roles: ['user'],
    });

    await Tokens.deleteMany({ userId: created._id });
    const { accessT, refreshT } = await createTokens(created._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
