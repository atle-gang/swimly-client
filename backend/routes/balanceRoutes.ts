import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
import { prisma } from '../client';

config();

interface AuthTokenPayload {
  user: { id: string };
}

interface UpdateBalanceBody {
  delta: number;
}

const router = Router();

router.get(
  '/data',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const userBalance = await prisma.balance.findUnique({
        where: { user_id: userId },
      });

      if (!userBalance) {
        return res.status(404).json({ message: 'Balance not found' });
      }

      return res.status(200).json({ balance: userBalance.balance });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/update',
  async (req: Request<{}, any, UpdateBalanceBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const updatedBalance = await prisma.balance.upsert({
        where: { user_id: userId },
        update: { balance: { increment: req.body.delta } },
        create: {
          user: { connect: { user_id: userId } },
          balance: req.body.delta,
        },
      });

      return res.status(200).json({
        message: 'Balance updated successfully',
        balance: updatedBalance.balance,
      });
    } catch (error) {
      next(error);
    }
  },
);

export { router as balanceRoutes };