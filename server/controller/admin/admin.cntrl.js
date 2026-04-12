import User from './../../model/user.js';
import { updateUserRole, updateUserStatus } from './admin.service.js';
import {
  filterUsers,
  attachBanStatus,
  sortUsers,
  paginate,
  banUserByEmail,
  unbanUserByEmail,
} from './admin.service.js';

// import { normalizeEmail } from './../authCntrl/auth.utils.js';

// users
export const listUsers = async (req, res) => {
  try {
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
    } = req.query;

    const currentPage = Math.max(1, Number(page) || 1);
    const limit = 10;

    const allUsers = await User.find(
      {},
      'email roles statuses provider createdAt'
    ).lean();

    let users = filterUsers(allUsers, search);

    users = await attachBanStatus(users);

    users = sortUsers(users, sortBy, sortOrder);

    const total = users.length;

    users = paginate(users, currentPage, limit);

    return res.json({
      users,
      total,
      page: currentPage,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error('listUsers error:', e);
    return res.status(500).json({
      message: 'Не вдалося завантажити користувачів',
    });
  }
};

export const banByEmail = async (req, res) => {
  try {
    const { email, reason, banMinutes } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const minutes = Number(banMinutes || 0);

    const bannedUntil =
      minutes > 0 ? new Date(Date.now() + minutes * 60 * 1000) : null;

    await banUserByEmail({
      email,
      bannedBy: req.user?.id || null,
      reason: String(reason || '').trim(),
      bannedUntil,
    });

    return res.json({ success: true });
  } catch (e) {
    console.error('banByEmail error:', e);
    return res.status(500).json({
      message: 'Не вдалося забанити користувача',
    });
  }
};


export const unbanByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    await unbanUserByEmail(email);

    return res.json({ success: true });
  } catch (e) {
    console.error('unbanByEmail error:', e);
    return res.status(500).json({
      message: 'Не вдалося розбанити користувача',
    });
  }
};
export const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'Missing data' });
    }

    const user = await updateUserRole(userId, role);

    return res.json({ user });
  } catch (e) {
    console.error('updateRole error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateStatus = async (req, res) => {

  try{
    const { userId, status } = req.body;

    if(!userId || !status) {
      return res.status(400).json({ message: 'Missing data' });
    }
    const user = await updateUserStatus(userId, status);
    return res.json({ user });
  } catch (e) {
    console.error('updateStatus error', e);
    return res.status(500).json({ message: 'Server error'})
  }
}