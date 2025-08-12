import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import Role from '../model/role.js';
import User from '../model/users.js';

const generateAccessToken = (userId, roles) => {
  const payload = {
    userId,
    roles,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Помилка при реєстрації', errors });
      }

      const { username, password, email } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Користувач з таким логіном вже існує!' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ username, password: hashedPassword, email, roles: [userRole.value] });
      await user.save();
      return res.json({ message: 'Новий користувач успішно зареєстрований!' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `Користувач ${user} не знайдений` });
      }
      const validPassword = bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Невірний пароль' });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'username error' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(400).json();
    }
  }
}

export default new AuthController();
