import { errorHandler, NotFoundError, NotFoundErrorApp } from '@pippip/pip-system-common';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import agencyRoutes from './routes/agency.routes';
import authAgencyRoutes from './routes/auth-agency.routes';
import authRoutes from './routes/auth.routes';
import car_typeRoutes from './routes/car-type.routes';
import carRoutes from './routes/car.routes';
import driverRoutes from './routes/driver.routes';
import registerRoutes from './routes/register.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
app.set('trust proxy', true);

const WEB_ADMIN_URL = process.env.WEB_ADMIN_URL ?? false;
const DEV_WEB_ADMIN_URL = process.env.DEV_WEB_ADMIN_URL ?? false;
const WEB_PARTNER_URL = process.env.WEB_PARTNER_URL ?? false;
const corsURLs = [WEB_ADMIN_URL, WEB_PARTNER_URL, DEV_WEB_ADMIN_URL].filter((v) => v);
app.use(
  cors({
    credentials: true,
    origin: corsURLs.length > 0 ? corsURLs : '*',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200,
    preflightContinue: true,
  }),
);
// app.use(compression({ level: 6, threshold: 100 * 1000 }));
app.use(morgan('tiny'));
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

app.get('/', (req, res) => res.send('Hello from PIPCAR!'));
app.get('/api', (req, res) => res.send('Hello from PIPCAR API!'));
// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
app.use('/api', authRoutes);
app.use('/api', authAgencyRoutes);
app.use('/api', userRoutes);
app.use('/api', agencyRoutes);
app.use('/api', registerRoutes);
app.use('/api', carRoutes);
app.use('/api', driverRoutes);
app.use('/api', car_typeRoutes);

console.log(process.env.NODE_ENV);
console.log('corsURLs', corsURLs);

app.all('*', (req, res) => {
  const err = new NotFoundError();
  const errApp = new NotFoundErrorApp();
  res.json({
    ...err.serializeErrors(),
    ...errApp.serializeErrors(),
  });
});

app.use(errorHandler);

export default app;
