import jwt from 'jsonwebtoken';

export default function roleMiddleware(roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Користувач не авторизований' });
      }
      const { roles: userRoles } = jwt.verify(token, process.env.JWT_SECRET);
      let hasRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true;
        }
        if (!hasRole) {
          res.status(403).json({ message: 'У вас не має доступу!' });
        }
      });
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({ message: 'Користувач не авторизований' });
    }
  };
}
