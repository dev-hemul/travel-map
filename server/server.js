import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';


// Роути
import announcementsRouter from './routes/annoucementsAdding.js';
import authRouter from './routes/auth.js';
import getReportsRouter from './routes/main.js';
import marker from './routes/markerRouter.js';
import profileEdditRouter from './routes/profileChanges.js';
import supportRouter from './routes/support.js';
import weatherRouter from './routes/weather.js';

const app = express();

app.use(morgan('dev'));

app.use((req, res, next) => {
  next();
});

app.use(cookieParser());
app.use((req, res, next) => {
  next();
});

// CORS конфігурація
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use((req, res, next) => {
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
app.use('/', weatherRouter);

// Обробка 404
app.use((req, res, next) => {
  next(createHttpError(404));
});

// Обробник помилок
app.use((err, req, res) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  console.error(`[Помилка] ${status}: ${message}`, err.stack);
  res.status(status).json({ error: message });
});

export default app;
