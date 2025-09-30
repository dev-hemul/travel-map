import { readFileSync } from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../model/user.js';
import Tokens from '../model/token.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 10000; // 10 сек
const refreshLifedur = 20000; // 20 сек

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
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
    });
    res.status(200).json({ accessToken: accessT });
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

    await Tokens.deleteMany({ userId: user._id });
    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
    });
    res.json({ accessToken: accessT });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getRefreshToken = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc) return res.status(403).json({ message: 'Invalid refresh token' });
    if (tokenDoc.expiresAt < Date.now()) {
      await Tokens.findByIdAndDelete(tokenDoc._id);
      return res.status(403).json({ message: 'Refresh token has expired' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) return res.status(403).json({ message: 'User not found' });

    await Tokens.findByIdAndDelete(tokenDoc._id);
    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
    });
    res.status(200).json({ accessToken: accessT });
  } catch (error) {
    console.error('RefreshToken error:', error);
    res.status(500).json({ message: 'Помилка оновлення токена' });
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
const createAccessT = (payload) => {
  const expiration = Math.floor(Date.now() / 1000) + Math.floor(lifedur / 1000);
  payload.exp = expiration;
  return { token: jwt.sign(payload, privateKey, { algorithm: alg, noTimestamp: true }) };
};

const createRefreshT = (userId) => {
  return nanoid();
};

const createTokens = async (userId) => {
  if (!userId) throw new Error('userId is undefined');
  const payload = { id: userId };
  const { token: accessT } = createAccessT(payload);
  const refreshT = createRefreshT(userId);

  await Tokens.create({
    refreshToken: refreshT,
    userId,
    expiresAt: Date.now() + refreshLifedur
  });
  return { accessT, refreshT };
};