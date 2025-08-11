import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import Role from '../model/role.js';
import User from '../model/users.js';

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Помилка при реєстрації', errors });
      }

      const { login, password, email } = req.body;
      const candidate = await User.findOne({ login });
      if (candidate) {
        return res.status(400).json({ message: 'Користувач з таким логіном вже існує!' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ login, password: hashedPassword, email, roles: [userRole.value] });
      await user.save();
      return res.json({ message: 'Новий користувач успішно зареєстрований!' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { login, password, email } = req.body;
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Login error' });
    }
  }

  async getUsers(req, res) {
    try {
      res.json('server work');
    } catch (e) {
      console.log(e);
      res.status(400).json();
    }
  }
}

export default new AuthController();
