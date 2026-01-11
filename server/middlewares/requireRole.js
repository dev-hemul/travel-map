export const requireRole = (...allowedRoles) => (req, res, next) => {
  const roles = req.user?.roles || [];
  const ok = roles.some((r) => allowedRoles.includes(r));
  if (!ok) return res.status(403).json({ message: 'Недостатньо прав' });
  next();
};
