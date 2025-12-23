import express from 'express';

import { verifyAccessToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/admin/ping', verifyAccessToken, requireRole('admin'), (req, res) => {
  res.json({ ok: true, message: 'тут адмінка', user: req.user });
});

export default router;
