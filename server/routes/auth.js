import express from 'express';
import { register, login, logout, updateProfile, getRefreshToken } from '../controller/authCntrl.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile', authMiddleware, updateProfile); // Захищений ендпоінт
router.post('/refresh-token', getRefreshToken);
router.post('/logout', authMiddleware, logout); // Захищений ендпоінт

export default router;