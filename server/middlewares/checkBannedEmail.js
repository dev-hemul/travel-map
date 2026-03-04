import { normalizeEmail } from '../controller/authCntrl/auth.utils.js';
import BannedEmails from '../model/bannedEmails.js';

export const checkBannedEmail = async (req, res, next) => {
  const emailNorm = normalizeEmail(req.body?.email);
  if (!emailNorm) return next();

  const banned = await BannedEmails.findOne({ email: emailNorm }).lean();
  if (banned) {
    return res.status(403).json({
      code: 'BANNED_ACCOUNT',
      message: 'Ваш обліковий запис забанений. Зверніться в службу підтримки',
    });
  }

  return next();
};