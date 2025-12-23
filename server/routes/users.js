import express from 'express';

import { verifyAccessToken } from '../middlewares/auth.js';
import User from '../model/user.js';
import UserProfile from '../model/userIProfileModel.js';


const router = express.Router();

// GET /users/me
router.get('/users/me', verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('_id username email roles avatar provider');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await UserProfile.findOne({ user: user._id }).select(
      'firstName lastName middleName phone locationText'
    );

    return res.json({ user, profile });
  } catch (e) {
    console.error('GET /users/me error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
});

export default router;
