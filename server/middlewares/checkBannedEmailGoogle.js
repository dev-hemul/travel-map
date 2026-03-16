import { normalizeEmail } from '../controller/authCntrl/auth.utils.js';
import BannedEmails from '../model/bannedEmails.js';

export const checkBannedGoogle = async (req, res, next) => {
  const emailNorm = normalizeEmail(req.googleUser?.email);
  if (!emailNorm) return next();

  const ban = await BannedEmails.findOne({ email: emailNorm }).lean();

  // якщо є тимчасовий бан і він вже минув — прибираємо
  if (ban?.bannedUntil && ban.bannedUntil.getTime() <= Date.now()) {
    await BannedEmails.deleteOne({ _id: ban._id });
    return next();
  }

  if (ban) {
    return res.status(403).json({
      code: 'BANNED_ACCOUNT',
      message: 'Ваш обліковий запис забанений. Зверніться в службу підтримки',
    });
  }

  return next();
};