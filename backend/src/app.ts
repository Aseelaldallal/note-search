import express from 'express';
import cors from 'cors';
import routes from './routes';

export const app = express();

// Middleware
app.use(cors());  // TODO: Any website can call API now

// Mount routes
app.use(routes);
