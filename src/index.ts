import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { DatabaseConnectionError } from '@pippip/pip-system-common';
dotenv.config();

const start = async (): Promise<void> => {
  console.log('\nStarting up ...\n');
  if (process.env.ACCESS_TOKEN_SECRET == null) {
    throw new Error('ACCESS_TOKEN_SECRET must be defined.');
  }
  if (process.env.REFRESH_TOKEN_SECRET == null) {
    throw new Error('REFRESH_TOKEN_SECRET must be defined.');
  }
  if (process.env.ACCESS_TOKEN_EXP == null) {
    throw new Error('ACCESS_TOKEN_EXP must be defined.');
  }
  if (process.env.REFRESH_TOKEN_EXP == null) {
    throw new Error('REFRESH_TOKEN_EXP must be defined.');
  }
  if (process.env.MONGO_URI == null) {
    throw new Error('MONGO_URI must be defined.');
  }
  if (process.env.PORT == null) {
    throw new Error('PORT must be defined.');
  }
  if (process.env.COOKIE_SECRET == null) {
    throw new Error('COOKIE_SECRET must be defined.');
  }
  if (process.env.COOKIE_EXP == null) {
    throw new Error('COOKIE_EXP must be defined.');
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('=========== Connected to MongoDB ===========');
  } catch (err) {
    console.log(err);
    throw new DatabaseConnectionError();
  }

  app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT ?? 3333} !!!\n`);
  });
};

void start();