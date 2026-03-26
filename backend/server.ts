import { Request, Response, NextFunction } from 'express';
const express = require('express');
const cors = require('cors');
import helmet from 'helmet';
import { userRoutes    } from './routes/userRoutes';
import { balanceRoutes } from './routes/balanceRoutes';
import { childRoutes   } from './routes/childRoutes';
import { lessonRoutes  } from './routes/lessonRoutes';
import { bookingRoutes } from './routes/bookingRoutes';
import { paymentRoutes } from './routes/paymentRoutes';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ allowedHeaders: ['Authorization', 'Content-Type'] }));

app.use('/swimly-api/user', userRoutes);
app.use('/swimly-api/user/balance', balanceRoutes);
app.use('/swimly-api/user/balance', balanceRoutes);
app.use('/swimly-api/children', childRoutes);
app.use('/swimly-api/lessons',  lessonRoutes);
app.use('/swimly-api/bookings', bookingRoutes);
app.use('/swimly-api/payments', paymentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Inside the server');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});