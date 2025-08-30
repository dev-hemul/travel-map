// server/controller/authCntrl.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../model/user.js';
import Tokens from '../model/token.js';
import { readFileSync } from 'fs';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 60 * 60 * 1000; // 60 хвилин для access token
const refreshLifedur = 30 * 24 * 60 * 60 * 1000; // 30 днів для refresh token

export const register = async (req, res) => {
  try {
    if (!privateKey || !publicKey) return res.status(500).json({ message: 'Ключі не ініціалізовані' });
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Користувач уже існує' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const { accessT, refreshT } = await createTokens(user._id);
    user.refreshToken = refreshT;
    await user.save();

    res.status(200).json({ accessToken: accessT, refreshToken: refreshT, user: { id: user._id, username, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (!privateKey || !publicKey) return res.status(500).json({ message: 'Ключі не ініціалізовані' });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Невірний логін' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Невірний пароль' });

    const { accessT, refreshT } = await createTokens(user._id);
    user.refreshToken = refreshT;
    await user.save();

    res.json({ accessToken: accessT, refreshToken: refreshT, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!privateKey || !publicKey) return res.status(500).json({ message: 'Ключі не ініціалізовані' });
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
    if (!privateKey || !publicKey) return res.status(500).json({ message: 'Ключі не ініціалізовані' });
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ token: refreshToken });
    if (!tokenDoc) return res.status(403).json({ message: 'Invalid refresh token' });

    const decoded = verifyToken(tokenDoc.jti); // Перевірка jti
    const user = await User.findById(tokenDoc.params.iss);

    if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ message: 'Invalid refresh token' });

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

// Функціонал логаута 
export const logout = async (req, res) => {
  try {
    if (!privateKey || !publicKey) return res.status(500).json({ message: 'Ключі не ініціалізовані' });
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const decoded = verifyToken(token);
    const userId = decoded.iss;
    await removeRefTokenByIss(userId);
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка виходу', error: error.message });
  }
};

// функції для створення та верифікації токенів
const createAccessT = (payload) => {
  const expiration = Math.floor(Date.now() / 1000) + Math.floor(lifedur / 1000);
  const jti = nanoid();
  payload.exp = expiration;
  payload.jti = jti;
  const token = jwt.sign(payload, privateKey, { algorithm: alg });
  return { token, jti };
};

const createRefreshT = async (jti, params) => {
  const token = nanoid();
  const refreshT = await new Tokens({ jti, token, params, expiresAt: Date.now() + refreshLifedur }).save();
  return refreshT.token;
};

const createTokens = async (iss) => {
  const { token: accessT, jti } = createAccessT({ iss });
  const refreshT = await createRefreshT(jti, { iss });
  return { accessT, refreshT };
};

const removeRefTokenByIss = async (iss) => {
  const result = await Tokens.deleteMany({ "params.iss": iss });
  return result;
};

const verifyToken = (token) => {
  return jwt.verify(token, publicKey, { algorithms: [alg] });
};