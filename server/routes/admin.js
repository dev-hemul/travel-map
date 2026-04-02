import express from 'express';

import { listUsers } from '../controller/admin/admin.cntrl.js';
import { banByEmail, unbanByEmail, updateRole } from '../controller/admin/admin.cntrl.js';
import { verifyAccessToken } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.get('/users', verifyAccessToken, requireRole('admin'), listUsers);
router.post('/ban', verifyAccessToken, requireRole('admin'), banByEmail);
router.post('/unban', verifyAccessToken, requireRole('admin'), unbanByEmail);
router.post('/role', verifyAccessToken, requireRole('admin'), updateRole);

export default router;