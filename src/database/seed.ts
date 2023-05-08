import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserSeeder } from './user';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const DBSeed = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/pipcarsystem');
    await UserSeeder();
    console.log(`User is Seeded`);
    // await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
DBSeed();
