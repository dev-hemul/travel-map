import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';


// Роути
import announcementsRouter from "./routes/annoucementsAdding.js";
import getReportsRouter from './routes/main.js';
import supportRouter from './routes/support.js';
import profileEdditRouter from './routes/profileChanges.js';


const app = express();

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// Шляхи до статичних файлів
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client')));

// Підключення роутів тут
app.use('/', announcementsRouter);
app.use('/', supportRouter);
app.use('/', getReportsRouter);
<<<<<<< HEAD
=======
app.use('/', profileEdditRouter);

>>>>>>> 3384f3c406036832e547291e0264fc26087841e0

// Обробка 404
app.use((req, res, next) => {
  next(createHttpError(404));
});

// Обробник помилок
<<<<<<< HEAD
app.use((err, req, res, next) => {
=======
app.use((err, req, res) => {
>>>>>>> 3384f3c406036832e547291e0264fc26087841e0
  const { status = 500, message = 'Internal Server Error' } = err;
  console.error(status, message);
  res.status(status).json({ error: message });
});

export default app;