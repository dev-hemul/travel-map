import BannedEmails from './../../model/bannedEmails.js';
import User from './../../model/user.js'
import { normalizeEmail } from './../authCntrl/auth.utils.js';

export const filterUsers = (users, search) => {
  if (!search) return users;

  const normalizedSearch = search.trim().toLowerCase();

  return users.filter((user) => {
    const searchValue = [user.username, user.email, user.provider]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchValue.includes(normalizedSearch);
  });
};


export const attachBanStatus = async (users) => {
  const banned = await BannedEmails.find().select('email -_id').lean();
  const bannedSet = new Set(banned.map((b) => normalizeEmail(b.email)));

  return users.map((u) => ({
    ...u,
    isBanned: bannedSet.has(normalizeEmail(u.email)),
  }));
};


export const sortUsers = (users, sortBy, sortOrder) => {
  return users.sort((a, b) => {
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
};

export const paginate = (users, page, limit) => {
  const skip = (page - 1) * limit;
  return users.slice(skip, skip + limit);
};

export const banUserByEmail = async ({
  email,
  bannedBy,
  reason,
  bannedUntil,
}) => {
  const emailNorm = normalizeEmail(email);

  return BannedEmails.updateOne(
    { email: emailNorm },
    {
      $set: {
        email: emailNorm,
        reason,
        bannedAt: new Date(),
        bannedUntil,
        bannedBy,
      },
    },
    { upsert: true }
  );
};


export const unbanUserByEmail = async (email) => {
  const emailNorm = normalizeEmail(email);
  return BannedEmails.deleteOne({ email: emailNorm });
};

export const updateUserRole = async (userId, role) => {
  return User.findByIdAndUpdate(
    userId,
    { roles: [role] },
    { new: true }
  );
};