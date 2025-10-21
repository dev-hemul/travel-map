import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Роути
import announcementsRouter from './routes/annoucementsAdding.js';
import getReportsRouter from './routes/main.js';
import marker from './routes/markerRouter.js';
import profileEdditRouter from './routes/profileChanges.js';
import supportRouter from './routes/support.js';
import authRouter from './routes/auth.js';

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`[Крок 0] Запит: ${req.method} ${req.url}`);
  console.log('[Крок 0] Origin:', req.headers.origin);
  console.log('[Крок 0] Raw Cookie Header:', req.headers.cookie);
  next();
});

app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[Крок 0.5] Після cookie-parser. Cookies:`, req.cookies);
  next();
});

// CORS конфігурація
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  exposedHeaders: ['Set-Cookie'], 
  optionsSuccessStatus: 200 
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use((req, res, next) => {
  console.log('[Крок 1] Після CORS. Cookies:', req.cookies);
  console.log('[Крок 1] Response Headers:', res.getHeaders());
  next();
});

app.use(express.json());

app.use('/login', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.use('/refresh-token', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client')));

// Роути
app.use('/', announcementsRouter);
app.use('/', supportRouter);
app.use('/', getReportsRouter);
app.use('/', marker);
app.use('/', authRouter);
app.use('/profile', profileEdditRouter);

// Обробка 404
app.use((req, res, next) => {
  console.log('[Крок 404] Не знайдено:', req.method, req.url);
  next(createHttpError(404));
});

// Обробник помилок
app.use((err, req, res) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  console.error(`[Помилка] ${status}: ${message}`, err.stack);
  res.status(status).json({ error: message });
});

export default app;