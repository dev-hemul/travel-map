import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicKey = readFileSync(path.join(__dirname, '../keys/publicKey.pem'), 'utf8');
const alg = 'RS512';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, publicKey, { algorithms: [alg] }, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
};

export default authMiddleware;