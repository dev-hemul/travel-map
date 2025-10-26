import express from 'express';
import { register, login, logout, updateProfile, getRefreshToken } from './../controller/authCntrl.js';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth.js';
import User from '../model/user.js'; // Імпорт User для GET /profile

const router = express.Router();

router.post('/register', register);
router.post('/login', (req, res, next) => {
  console.log('[Крок 1.5] POST /login. Body:', req.body);
  console.log('[Крок 1.5] Headers:', req.headers);
  console.log('[Крок 1.5] Raw Cookie Header:', req.headers.cookie);
  console.log('[Крок 1.5] Cookies:', req.cookies);
  login(req, res, next);
});
router.post('/refresh-token', verifyRefreshToken, getRefreshToken);
router.post('/logout', verifyAccessToken, logout);

// GET /profile для перевірки токена
router.get('/profile', verifyAccessToken, async (req, res) => {
  try {
    console.log('GET /profile - req.userId:', req.userId); // Лог для діагностики
    if (!req.userId) {
      console.error('req.userId is undefined - check token payload');
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    const user = await User.findById(req.userId).select('-password');
    console.log('User found:', user ? user._id : 'No user');
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json({ user });
  } catch (error) {
    console.error('GET /profile error details:', error.message, error.stack); // Детальний лог
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// POST /profile для оновлення
router.post('/profile', verifyAccessToken, updateProfile);

export default router;