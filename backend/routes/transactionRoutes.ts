import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
import { prisma } from '../client';

config();

interface AuthTokenPayload {
  user: { id: string };
}

interface Children {
  name: string;
  age: number;
}

interface HealthConcern {
  name: string;
  concern: string | null;
}

interface CreateTransactionBody {
  children_names: Children[];
  health_concerns: HealthConcern[] | null;
  payment_type: string;
  lesson_date: string | Date;
  lesson_time: string;
  nap_times: string[];
  point_amount?: number | null;
  money_amount?: number | string | null;
}

interface GetTransactionsQuery {
  page?: string;
  limit?: string;
}

const router = Router();

router.post(
  '/',
  async (req: Request<{}, any, CreateTransactionBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const existingUser = await prisma.user.findUnique({ where: { user_id: userId } });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const point_amount = req.body.point_amount ?? null;
      const money_amount = req.body.money_amount ?? null;

      await prisma.transaction.create({
        data: {
          user: { connect: { user_id: userId } },
          children_names: JSON.stringify(req.body.children_names),
          health_concerns: JSON.stringify(req.body.health_concerns) ?? null,
          payment_type: req.body.payment_type,
          lesson_date: new Date(req.body.lesson_date),
          lesson_time: req.body.lesson_time,
          nap_times: req.body.nap_times,
          point_amount,
          money_amount,
        },
      });

      return res.status(201).json({ message: 'Lesson scheduled successfully' });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/data',
  async (
    req: Request<{}, any, {}, GetTransactionsQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const existingUser = await prisma.user.findUnique({ where: { user_id: userId } });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const page = parseInt(req.query.page ?? '1', 10);
      const limit = parseInt(req.query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const transactions = await prisma.transaction.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        orderBy: { lesson_date: 'desc' },
      });

      return res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },
);

export { router as transactionRoutes };