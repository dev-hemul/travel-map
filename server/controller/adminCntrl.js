import BannedEmails from '../model/bannedEmails.js';
import User from '../model/user.js';
import { normalizeEmail } from './authCntrl/auth.utils.js';

export const listUsers = async (req, res) => {
  try {
    const { search = '', sortOption = 'newest' } = req.query;

    const searchRegex = new RegExp(search, 'i');

    const users = await User.find({
      $or: [
        { username: searchRegex },
        { email: searchRegex },
        { provider: searchRegex },
      ],
    }).lean();

    const banned = await BannedEmails.find().select('email -_id').lean();
    const bannedSet = new Set(banned.map((b) => normalizeEmail(b.email)));

    const usersWithBan = users.map((u) => ({
      ...u,
      isBanned: bannedSet.has(normalizeEmail(u.email)),
    }));

    usersWithBan.sort((a, b) => {
      switch (sortOption) {
        case 'email_asc':
          return (a.email || '').localeCompare(b.email || '');

        case 'email_desc':
          return (b.email || '').localeCompare(a.email || '');

        case 'username_asc':
          return (a.username || '').localeCompare(b.username || '');

        case 'username_desc':
          return (b.username || '').localeCompare(a.username || '');

        case 'banned_first':
          return Number(b.isBanned) - Number(a.isBanned);

        case 'active_first':
          return Number(a.isBanned) - Number(b.isBanned);

        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);

        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
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
    if (!emailNorm) return res.status(400).json({ message: 'Email required' });

    const reason = String(req.body?.reason || '').trim();
    const minutes = Number(req.body?.banMinutes || 0);
    const bannedUntil = minutes > 0 ? new Date(Date.now() + minutes * 60 * 1000) : null;

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
    if (!emailNorm) return res.status(400).json({ message: 'Email required' });

    await BannedEmails.deleteOne({ email: emailNorm });
    return res.json({ success: true });
  } catch (e) {
    console.error('unbanByEmail error:', e);
    return res.status(500).json({ message: 'Не вдалося розбанити користувача' });
  }
};