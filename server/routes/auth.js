import express from 'express';
import { register, login, logout, updateProfile, getRefreshToken } from './../controller/authCntrl.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile', updateProfile);
router.post('/refresh-token', getRefreshToken);
router.post('/logout', logout);

export default router;
