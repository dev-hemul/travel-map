export const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost',
    'https://tripmap.site',
    'https://travel-map-three-beta.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};
