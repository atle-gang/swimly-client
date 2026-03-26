import { Request, Response, NextFunction } from 'express';
const express = require('express');
const cors = require('cors');
import helmet from 'helmet';
import { userRoutes } from './routes/userRoutes.ts';
import { balanceRoutes } from './routes/balanceRoutes.ts';
import { transactionRoutes } from './routes/transactionRoutes.ts';

import pinoHttp from 'pino-http';
import logger from './logger.ts';
import prisma from './client.ts'; 

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(
  pinoHttp({
    logger,
    customLogLevel: (req: Request, res: Response, err?: Error): string => {
      if (res.statusCode >= 500) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    },
    customSuccessMessage: (req: Request, res: Response): string => {
      return `${req.method} ${req.url} - ${res.statusCode}`
    },
    customErrorMessage: (err: Error, req: Request): string => {
      return err.message
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ allowedHeaders: ['Authorization', 'Content-Type'] }));

app.use('/swimly-api/user', userRoutes);
app.use('/swimly-api/user/balance', balanceRoutes);
app.use('/swimly-api/user/transactions', transactionRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

app.post('/test-entry', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, message } = req.body as { name?: string; message?: string }

    logger.info({ name, message }, 'Creating new TestEntry via Postman')

    const newEntry = await prisma.testEntry.create({
      data: {
        name: name || 'Test from Postman',
        message: message || 'This was created via Postman!',
      },
    })

    logger.info({ entryId: newEntry.id }, 'TestEntry saved to Neon successfully')

    res.json({
      success: true,
      message: 'Entry saved to Neon!',
      data: newEntry,
    })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error(err, 'Failed to create TestEntry')
    res.status(500).json({ success: false, error: err.message })
  }
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