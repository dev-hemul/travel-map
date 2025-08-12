import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

import controller from '../controller/authController.js';

const router = Router();

router.post(
  '/registration',
  [
    check('username', "Ім'я користувача не може бути пустим").notEmpty(),
    check('password', 'Пароль має бути більше 4 символів і менше 10').isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

export default router;
