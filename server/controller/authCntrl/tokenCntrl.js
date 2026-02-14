import { clearRefreshCookie, decodeToken, createAccessToken } from './auth.utils.js';
import Tokens from '../../model/token.js';
import User from '../../model/user.js';


export const getRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token not provided' });

  try {
    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }

    const user = await User.findById(tokenDoc.userId).select('roles');
    const roles = Array.isArray(user?.roles) && user.roles.length ? user.roles : ['user'];

    const accessToken = createAccessToken({ id: tokenDoc.userId, roles });
    return res.json({ accessToken });
  } catch (e) {
    console.error('Refresh error:', e);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const payload = decodeToken(token);
      const userId = payload?.id;
      if (userId) await Tokens.deleteMany({ userId });
    }

    clearRefreshCookie(res);
    return res.json({ message: 'Успішний вихід' });
  } catch (e) {
    console.error('Logout error:', e);
    return res.status(500).json({ message: 'Помилка виходу' });
  }
};
