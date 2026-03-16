import express from 'express';

import { listUsers, banByEmail, unbanByEmail } from '../controller/adminCntrl.js';
import { verifyAccessToken } from '../middlewares/auth.js';
// import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/admin/users', verifyAccessToken, listUsers);
router.post('/admin/ban', verifyAccessToken, banByEmail);
router.post('/admin/unban', verifyAccessToken, unbanByEmail);

export default router;