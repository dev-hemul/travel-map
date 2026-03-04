import BannedEmails from '../model/bannedEmails.js';
import User from '../model/user.js';
import { normalizeEmail } from './authCntrl/auth.utils.js';

export const listUsers = async (req, res) => {
  try {
    const { search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const normalizedSearch = search.trim().toLowerCase();

    const allUsers = await User.find().lean();

    let filteredUsers = allUsers;

    if (normalizedSearch) {
      filteredUsers = allUsers.filter((user) => {
        const searchValue = [user.username, user.email, user.provider]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchValue.includes(normalizedSearch);
      });
    }

    const banned = await BannedEmails.find().select('email -_id').lean();
    const bannedSet = new Set(banned.map((b) => normalizeEmail(b.email)));

    const usersWithBan = filteredUsers.map((u) => ({
      ...u,
      isBanned: bannedSet.has(normalizeEmail(u.email)),
    }));

    usersWithBan.sort((a, b) => {
      let valA;
      let valB;

      switch (sortBy) {
        case 'email':
          valA = a.email?.toLowerCase() || '';
          valB = b.email?.toLowerCase() || '';
          break;

        case 'username':
          valA = a.username?.toLowerCase() || '';
          valB = b.username?.toLowerCase() || '';
          break;

        case 'provider':
          valA = a.provider?.toLowerCase() || '';
          valB = b.provider?.toLowerCase() || '';
          break;

        case 'roles':
          valA = Array.isArray(a.roles) ? a.roles.join(',').toLowerCase() : '';
          valB = Array.isArray(b.roles) ? b.roles.join(',').toLowerCase() : '';
          break;

        case 'isBanned':
          valA = a.isBanned ? 1 : 0;
          valB = b.isBanned ? 1 : 0;
          break;

        case 'createdAt':
        default:
          valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return res.json({ users: usersWithBan });

  } catch (e) {
    console.error('listUsers error:', e);
    return res.status(500).json({ message: 'Не вдалося завантажити користувачів' });
  }
};

export const banByEmail = async (req, res) => {
  try {
    const emailNorm = normalizeEmail(req.body?.email);
    if (!emailNorm) {
      return res.status(400).json({ message: 'Email required' });
    }

    const reason = String(req.body?.reason || '').trim();
    const minutes = Number(req.body?.banMinutes || 0);

    const bannedUntil =
      minutes > 0 ? new Date(Date.now() + minutes * 60 * 1000) : null;

    await BannedEmails.updateOne(
      { email: emailNorm },
      {
        $set: {
          email: emailNorm,
          reason,
          bannedAt: new Date(),
          bannedUntil,
          bannedBy: req.user?.id || null,
        },
      },
      { upsert: true }
    );

    return res.json({ success: true });
  } catch (e) {
    console.error('banByEmail error:', e);
    return res.status(500).json({ message: 'Не вдалося забанити користувача' });
  }
};

export const unbanByEmail = async (req, res) => {
  try {
    const emailNorm = normalizeEmail(req.body?.email);

    if (!emailNorm) {
      return res.status(400).json({ message: 'Email required' });
    }

    await BannedEmails.deleteOne({ email: emailNorm });

    return res.json({ success: true });

  } catch (e) {
    console.error('unbanByEmail error:', e);
    return res.status(500).json({ message: 'Не вдалося розбанити користувача' });
  }
};