import BannedEmails from '../model/bannedEmails.js';
import User from '../model/user.js';
import { normalizeEmail } from './authCntrl/auth.utils.js'; 

export const listUsers = async (req, res) => {
  const users = await User.find()
    .select('_id email username roles provider googleId')
    .lean();

  const banned = await BannedEmails.find().select('email -_id').lean();
  const bannedSet = new Set(banned.map(b => b.email));

  const usersWithBan = users.map(u => ({
    ...u,
    isBanned: bannedSet.has(normalizeEmail(u.email)),
  }));

  return res.json({ users: usersWithBan });
};

export const banByEmail = async (req, res) => {
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
};

export const unbanByEmail = async (req, res) => {
  const emailNorm = normalizeEmail(req.body?.email);
  if (!emailNorm) return res.status(400).json({ message: 'Email required' });

  await BannedEmails.deleteOne({ email: emailNorm });
  return res.json({ success: true });
};