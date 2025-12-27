
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import jwt from 'jsonwebtoken';

import Tokens from '../model/token.js';
import User from '../model/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicKey = readFileSync(path.join(__dirname, '../keys/publicKey.pem'), 'utf8');
const alg = 'RS512';

export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Токен не надано' });

  jwt.verify(token, publicKey, { algorithms: [alg] }, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Невірний або прострочений access токен' });

    try {
      // id з токена
      req.userId = decoded.id;
      //  ролі з бд
      const user = await User.findById(decoded.id).select('_id roles');
      if (!user) return res.status(401).json({ message: 'Користувача не знайдено' });
      // перевіряти ролі по запиту
      req.user = {
        id: user._id.toString(),
        roles: user.roles || ['user'],
      };

      next();
    } catch (e) {
      console.error('verifyAccessToken error:', e);
      return res.status(500).json({ message: 'Помилка сервера' });
    }
  });
};

export const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      if (tokenDoc) await Tokens.findByIdAndDelete(tokenDoc._id);
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    req.userId = tokenDoc.userId;
    next();
  } catch (e) {
    console.error('verifyRefreshToken error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

