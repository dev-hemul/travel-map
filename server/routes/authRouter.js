import { Router } from 'express';
import { check } from 'express-validator';

import controller from '../controller/authController.js';

const router = Router();

router.post(
  '/registration',
  [
    check('login', "Ім'я користувача не може бути пустим").notEmpty(),
    check('password', 'Пароль має бути більше 4 символів і менше 10').isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

export default router;
