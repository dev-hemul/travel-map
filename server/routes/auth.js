import express from 'express';


import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth.js';
import Tokens from '../model/token.js';
import User from '../model/user.js'; // Імпорт User для GET /profile
import { register, login, logout, updateProfile, getRefreshToken, createTokens } from './../controller/authCntrl.js';
import { googleCodeToUser, getGoogleAuthUrl } from './../middlewares/googleAuth.js'
import {
  validateLoginBody,
  validateRegisterBody,
} from './../middlewares/validation.js';

const router = express.Router();

router.post('/register', validateRegisterBody, register);
router.post('/login', validateLoginBody, (req, res, next) => {
  login(req, res, next);
});
router.post('/refresh-token', verifyRefreshToken, getRefreshToken);
router.post('/logout', verifyAccessToken, logout);

router.get('/profile', verifyAccessToken, async (req, res) => {
  try {
    if (!req.userId) {
      console.error('req.userId is undefined - check token payload');
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json({ user });
  } catch (error) {
    console.error('GET /profile error details:', error.message, error.stack); // Детальний лог
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/profile', verifyAccessToken, updateProfile);

router.get('/google/url', getGoogleAuthUrl);

router.post('/google', googleCodeToUser, async (req, res) => {
  try {
    const gUser = req.googleUser;

    const emailNorm = (gUser.email || '').trim().toLowerCase();

    let user = await User.findOne({
      $or: [{ googleId: gUser.googleId }, { email: emailNorm }],
    });

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
      // якщо був local і тепер зайшов через Google
      if (!user.googleId) user.googleId = gUser.googleId;
      if (!user.provider) user.provider = 'google';
      if (!Array.isArray(user.roles) || user.roles.length === 0) user.roles = ['user'];
      await user.save();
    }

    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: true,
      secure: false, // локально
      sameSite: 'lax',
      maxAge: 21 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({ accessToken: accessT });
  } catch (err) {
    console.error('Google route error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;
