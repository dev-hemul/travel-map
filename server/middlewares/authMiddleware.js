import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Користувач не авторизований' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: 'Користувач не авторизований' });
  }
}
