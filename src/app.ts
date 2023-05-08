import express from 'express';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { NotFoundError, errorHandler } from '@pippip/pip-system-common';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SECRET!],
    maxAge: parseInt(process.env.COOKIE_EXP!),
    signed: true,
    httpOnly: true,
  }),
);

app.use('/api', authRoutes);

app.all('*', (req, res) => {
  const err = new NotFoundError();
  res.json({
    ...err.serializeErrors(),
  });
});

app.use(errorHandler);

export default app;