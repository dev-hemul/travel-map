import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import jwt from 'jsonwebtoken';

import Tokens from '../model/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicKey = readFileSync(path.join(__dirname, '../keys/publicKey.pem'), 'utf8');
const alg = 'RS512';

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Токен не надано' });

  jwt.verify(token, publicKey, { algorithms: [alg] }, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Невірний або прострочений access токен' });
    req.userId = decoded.id; // Зберігаємо userId для подальшого використання
    next();
  });
};

export const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

  const tokenDoc = await Tokens.findOne({ refreshToken });
  if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
    if (tokenDoc) await Tokens.findByIdAndDelete(tokenDoc._id);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
  req.userId = tokenDoc.userId;
  next();
};
