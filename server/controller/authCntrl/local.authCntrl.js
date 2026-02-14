import bcrypt from 'bcrypt';

import { normalizeEmail, ensureRoles, issueTokens } from './auth.utils.js';
import User from '../../model/user.js';

const conflict = (res, message, code) =>
  res.status(409).json({ success: false, message, code });

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailNorm = normalizeEmail(email);
    const usernameNorm = String(username || '').trim();

    const existingByEmail = await User.findOne({ email: emailNorm }).select('provider');
    if (existingByEmail) {
      if (existingByEmail.provider === 'google') {
        return conflict(
          res,
          'Ця адреса вже використовується для входу через Google. Увійдіть через Google.',
          'GOOGLE_AUTH_ONLY'
        );
      }
      return res.status(400).json({ success: false, message: 'Електронна пошта вже використовується' });
    }

    const existingByUsername = await User.findOne({ username: usernameNorm }).select('_id');
    if (existingByUsername) {
      return res.status(400).json({ success: false, message: "Імʼя користувача вже зайнято" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      username: usernameNorm,
      email: emailNorm,
      password: hashedPassword,
      provider: 'local',
      roles: ['user'],
    });

    await ensureRoles(user);
    const accessToken = await issueTokens(res, user._id);

    return res.status(200).json({ accessToken });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const emailNorm = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const user = await User.findOne({ email: emailNorm }).select('password provider roles');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача з таким email не існує',
        code: 'USER_NOT_FOUND',
      });
    }
    if (user.provider === 'google') {
      return conflict(
        res,
        'Цей email зареєстрований через Google. Увійдіть через Google.',
        'GOOGLE_AUTH_ONLY'
      );
    }

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Невірний пароль',
        code: 'WRONG_PASSWORD',
      });
    }

    await ensureRoles(user);
    const accessToken = await issueTokens(res, user._id);

    return res.json({ accessToken });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
};
