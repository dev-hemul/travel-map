import { normalizeEmail, ensureRoles, issueTokens } from './auth.utils.js';
import User from '../../model/user.js';

const conflict = (res, message, code) =>
  res.status(409).json({ success: false, message, code });

export const googleLogin = async (req, res) => {
  try {
    const gUser = req.googleUser;

    const googleId = String(gUser?.googleId || '');
    const emailNorm = normalizeEmail(gUser?.email);

    const byGoogleId = await User.findOne({ googleId }).select('provider roles');
    if (byGoogleId) {
      await ensureRoles(byGoogleId);
      const accessToken = await issueTokens(res, byGoogleId._id);
      return res.json({ accessToken });
    }

    const byEmail = await User.findOne({ email: emailNorm }).select('provider roles');
    if (byEmail) {
      if (byEmail.provider === 'local') {
        return conflict(
          res,
          'Ця адреса вже зареєстрована локально. Увійдіть з паролем.',
          'LOCAL_AUTH_ONLY'
        );
      }
      await ensureRoles(byEmail);
      const accessToken = await issueTokens(res, byEmail._id);
      return res.json({ accessToken });
    }

    const created = await User.create({
      username: gUser?.name || emailNorm.split('@')[0],
      email: emailNorm,
      provider: 'google',
      googleId,
      roles: ['user'],
    });

    await ensureRoles(created);
    const accessToken = await issueTokens(res, created._id);
    return res.json({ accessToken });
  } catch (e) {
    console.error('googleLogin controller error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
};
