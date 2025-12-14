import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';


// Роути
import adminRoutes from './routes/admin.js';
import announcementsRouter from './routes/annoucementsAdding.js';
import authRouter from './routes/auth.js';
import getReportsRouter from './routes/main.js';
import marker from './routes/markerRouter.js';
import profileEdditRouter from './routes/profileChanges.js';
import supportRouter from './routes/support.js';
import usersRoutes from './routes/users.js';
import weatherRouter from './routes/weather.js';

const app = express();

// Завантажуємо YAML
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
const file = fs.readFileSync(swaggerPath, 'utf8');
const swaggerDocument = YAML.parse(file);

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
    origin: [
      'http://localhost:5173',
      'http://159.89.102.4',
      'https://evgeniiviter.website',
      'http://localhost',
    ],
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
app.use(express.static(path.join(__dirname, '../client')));

// Роути
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/', announcementsRouter);
app.use('/api/', supportRouter);
app.use('/api/', getReportsRouter);
app.use('/api/', marker);
app.use('/api/', authRouter);
app.use('/api/profile', profileEdditRouter);
app.use('/api/', weatherRouter);
app.use('/api/', adminRoutes);
app.use('/api/', usersRoutes);

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
