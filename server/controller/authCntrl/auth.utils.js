import { readFileSync } from 'fs';

import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import Tokens from '../../model/token.js';
import User from '../../model/user.js';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';

export const lifedur = 7 * 24 * 3600 * 1000;          // 7 днів
export const refreshLifedur = 21 * 24 * 3600 * 1000;  // 21 день

if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах keys/');
}

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const setRefreshCookie = (res, refreshT) => {
  res.cookie('refreshToken', refreshT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshLifedur,
    path: '/',
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

export const ensureRoles = async (user) => {
  if (!Array.isArray(user.roles) || user.roles.length === 0) {
    user.roles = ['user'];
    await user.save();
  }
};

export const createAccessToken = (payload) =>
  jwt.sign(payload, privateKey, { algorithm: alg, expiresIn: lifedur / 1000 });

export const createTokens = async (userId) => {
  const user = await User.findById(userId).select('roles');
  const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : ['user'];

  const accessT = createAccessToken({ id: userId, roles });

  const refreshT = nanoid();
  const expiresAt = Date.now() + refreshLifedur;

  await Tokens.create({ userId, refreshToken: refreshT, expiresAt });

  return { accessT, refreshT };
};

export const issueTokens = async (res, userId) => {
  await Tokens.deleteMany({ userId });
  const { accessT, refreshT } = await createTokens(userId);
  setRefreshCookie(res, refreshT);
  return accessT;
};

export const decodeToken = (token) => jwt.decode(token);
