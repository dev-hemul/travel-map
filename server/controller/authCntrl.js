import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../model/user.js';
import Tokens from '../model/token.js';
import { readFileSync } from 'fs';

const privateKey = readFileSync('keys/privateKey.pem', 'utf8');
const publicKey = readFileSync('keys/publicKey.pem', 'utf8');
const alg = 'RS512';
const lifedur = 10000; // 10 sec
const refreshLifedur = 20000; // 20 sec

if (!privateKey || !publicKey) {
  throw new Error('Ключі не ініціалізовані в файлах keys/');
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) return res.status(400).json({ message: 'Username вже зайнято' });
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return res.status(400).json({ message: 'Email вже зайнято' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, provider: 'local' });
    await user.save();

    // Delete any existing tokens for this user
    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: false, // Set to false for testing
      secure: false, 
      sameSite: 'lax', 
      maxAge: refreshLifedur,
    });

    console.log('Register: Cookie встановлено:', refreshT);
    res.status(200).json({ accessToken: accessT }); // Прибрано user
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Такого користувача не існує' });
    }
    
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Неправильний пароль' });
    }

    // Delete old tokens
    await Tokens.deleteMany({ userId: user._id });

    const { accessT, refreshT } = await createTokens(user._id);

    res.cookie('refreshToken', refreshT, {
      httpOnly: false, // Set to false for testing
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur,
    });
    console.log('Login: Cookie встановлено:', refreshT);
    
    res.json({ accessToken: accessT }); // Прибрано user
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const getRefreshToken = async (req, res) => {
  try {
    console.log('=== DEBUG INFO ===');
    console.log('All headers:', req.headers);
    console.log('Cookie header:', req.headers.cookie);
    console.log('Parsed cookies from cookieParser:', req.cookies);
    
    let refreshToken = null;

    if (req.cookies && req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
      console.log('рефрештокен:', refreshToken);
    }
  
    
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const tokenDoc = await Tokens.findOne({ refreshToken });
    if (!tokenDoc) return res.status(403).json({ message: 'Invalid refresh token' });
    
    if (tokenDoc.expiresAt < Date.now()) {
      console.log('Token expired at:', new Date(tokenDoc.expiresAt).toLocaleString());
      await Tokens.findByIdAndDelete(tokenDoc._id); 
      return res.status(403).json({ message: 'Refresh token has expired' }); 
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) return res.status(403).json({ message: 'User not found' });

    await Tokens.findByIdAndDelete(tokenDoc._id); 

    const { accessT, refreshT } = await createTokens(user._id);
    if (!refreshT || !accessT) throw new Error('Помилка генерації токенів');

    res.cookie('refreshToken', refreshT, {
      httpOnly: false, 
      secure: false,
      sameSite: 'lax',
      maxAge: refreshLifedur
    });
    console.log('New tokens generated and cookie set');

    res.status(200).json({ accessToken: accessT, message: 'Tokens refreshed successfully' });
  } catch (error) {
    console.error('RefreshToken error:', error);
    res.status(500).json({ message: 'Помилка оновлення токена' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const userId = verifyToken(token);
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ message: 'Невірний токен для юзера' });

    const { username, email } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.json({ message: 'Профіль оновлено', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(401).json({ message: 'Невірний токен' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен не надано' });

    const userId = verifyToken(token);
    await Tokens.deleteMany({ userId }); 
    
    res.clearCookie('refreshToken', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });
    
    res.status(200).json({ message: 'Успішний вихід' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Помилка виходу' });
  }
};


// Helper functions
const createAccessT = (payload) => {
  const expiration = Math.floor(Date.now() / 1000) + Math.floor(lifedur / 1000);
  payload.exp = expiration;
  const token = jwt.sign(payload, privateKey, { algorithm: alg });
  return { token };
};

const createRefreshT = (userId) => {
  return nanoid();
};

const createTokens = async (userId) => {
  if (!userId) throw new Error('userId is undefined');
  
  const { token: accessT } = createAccessT({ iss: userId });
  const refreshT = createRefreshT(userId);
  
  // Create token in database
  await Tokens.create({ 
    refreshToken: refreshT, 
    userId, 
    expiresAt: Date.now() + refreshLifedur 
  });
  
  console.log('Tokens created:', { accessT: accessT.substring(0, 20) + '...', refreshT });
  return { accessT, refreshT };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: [alg] });
    return decoded.iss; 
  } catch (error) {
    throw new Error('Невірний токен');
  }
};