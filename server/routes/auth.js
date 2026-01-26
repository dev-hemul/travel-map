import express from 'express';


import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth.js';
import Tokens from '../model/token.js';
import User from '../model/user.js'; // Імпорт User для GET /profile
import { register, login, googleLogin, logout, updateProfile, getRefreshToken } from './../controller/authCntrl.js';
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

router.post('/google', googleCodeToUser, googleLogin);


export default router;
