import path from 'path';
// Цей рядок імпортує функцію fileURLToPath із модуля url, вбудованого в Node.js.
import { fileURLToPath } from 'url';

// Логи для консолі за запитами
// Обробка та відображення помилок
// Імпорт CORS
import cors from 'cors';
import express from 'express';
import createHttpError from 'http-errors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'

// Роути
import announcementsRouter from "./routes/annoucementsAdding.js";
import getReportsRouter from './routes/main.js';
import supportRouter from './routes/support.js';

const app = express();
app.use(morgan('combined'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());

// import.meta.url це спеціальна змінна ESM, яка містить URL поточного модуля (файлу).
// fileURLToPath(import.meta.url) - конвертує цей URL в шлях файлової системи.
// В результаті __filename буде містити повний шлях до поточного файлу (де знаходиться цей код). Це аналог старої змінної __filename в CommonJS.
const __filename = fileURLToPath(import.meta.url);

// path.dirname(__filename) отримує директорію, в якій знаходиться файл, з повного шляху __filename
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client')));

//Ліміт запитів в репорт(конфігурація)
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 5, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);

// Підключення роутів тут
app.use('/', announcementsRouter);
app.use('/', supportRouter, limiter);
app.use('/', getReportsRouter);
/*app.use('/', mainRouter);*/


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use((req, res, next) => {
  next(createHttpError(404));
});

// error hendler - midleware для обробки помилок. Тобто спочатку вище формуємо помилку, а потім всі помилки передаються сюди
app.use((err, req, res) => {
  const { status = 404, message = 'Internal Server Error' } = err; // Беремо статус помилки
  console.error(status);
  console.error(message);

  res.status(status).json({ error: message }); // Повертаємо повідомлення про помилку в форматі JSON
});

export default app;
