import { readFileSync } from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 7 * 24 * 60 * 1000; // 7 днів
const refreshLifedur = 21 * 24 * 60 * 1000; // 21 день

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

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: true, // Для http://localhost
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
    // console.log('--------------login logs--------------')
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log('email:', email)
    if (!user) return res.status(404).json({ message: 'Такого користувача не існує' });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Неправильний пароль' });

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);
    // console.log('tokens', accessT, refreshT)

    res.cookie('refreshToken', refreshT, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
    });
    // console.log('cookies', res.cookie)

    res.json({ accessToken: accessT });
    // console.log(res.json)
    // console.log('Login successful:', { userId: user._id, refreshToken: refreshT });
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
    // Перевірка refreshToken у БД
    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      // console.log('Refresh token expired or not found:', refreshToken);
      return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    // Створюємо новий accessToken
    const { accessT } = createAccessT({ id: tokenDoc.userId });
    res.json({ accessToken: accessT });
    // console.log('Refresh successful, new access token issued for user:', tokenDoc.userId);
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

    if (!user) return res.status(401).json({ message: 'Невірний токен для юзера' });

    user.username = username || user.username;
    user.email = email || user.email;

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
    await Tokens.deleteMany({ userId: decoded.id });

    res.clearCookie('refreshToken', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Помилка виходу' });
  }
};

// Helper functions
export const createAccessT = payload => {
  // console.log('[createAccessT] Створюємо accessToken для payload:', payload);
  try {
    const accessT = jwt.sign(payload, privateKey, {
      algorithm: alg,
      expiresIn: lifedur / 1000,
    });
    // console.log('[createAccessT] Access Token:', accessT);
    return { accessT };
  } catch (error) {
    console.error('[createAccessT] Помилка:', error.message, error.stack);
    throw error;
  }
};

// const createRefreshT = (userId) => {
//   return nanoid();
// }; поки закоментую, бо на нього еслінт ругається, якщо будуть помилки, буду розбиратись

export const createTokens = async userId => {
  try {
    const accessT = jwt.sign({ id: userId }, privateKey, {
      algorithm: alg,
      expiresIn: lifedur / 1000,
    });
    const refreshT = nanoid();
    // console.log('[createTokens] Access Token:', accessT);
    // console.log('[createTokens] Refresh Token:', refreshT);

    await Tokens.create({ userId, refreshToken: refreshT });
    return { accessT, refreshT };
  } catch (error) {
    console.error('[createTokens] Помилка:', error.message, error.stack);
    throw error;
  }
};
