import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${NODE_ENV}` });

import dbRunner from './runners/db.js';
import httpRunner from './runners/http.js';

await dbRunner();
await httpRunner();
