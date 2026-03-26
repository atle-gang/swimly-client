import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
import { prisma } from '../client';
import { PaymentType } from '../generated/prisma/client';

config();

interface AuthTokenPayload {
  user: { id: string };
}

interface CreatePaymentBody {
  payment_type:  'SINGLE_LESSON' | 'CREDIT_PACK';
  amount_rands:  number;
  credits_added: number;  // 1 for single lesson, pack size for credit packs
  description:   string;  // e.g. "Popular Pack - 5 lessons"
}

const router = Router();

/**
 * POST /swimly-api/payments
 * Records a payment and adds credits to the user's balance atomically.
 * In a production app this would integrate with PayFast before recording.
 */
router.post(
  '/',
  async (req: Request<{}, any, CreatePaymentBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const { payment_type, amount_rands, credits_added, description } = req.body;

      if (!payment_type || !amount_rands || credits_added === undefined || !description) {
        return res.status(400).json({
          message: 'payment_type, amount_rands, credits_added and description are required',
        });
      }

      // Record the payment and update balance in one transaction
      const [payment] = await prisma.$transaction([
        prisma.payment.create({
          data: {
            user_id:       userId,
            payment_type:  payment_type as PaymentType,
            amount_rands,
            credits_added,
            description,
          },
        }),
        prisma.balance.upsert({
          where:  { user_id: userId },
          update: { balance: { increment: credits_added } },
          create: { user_id: userId, balance: credits_added },
        }),
      ]);

      return res.status(201).json({
        message:       'Payment recorded and credits added',
        payment,
        credits_added,
      });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /swimly-api/payments
 * Returns the authenticated user's payment history.
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const payments = await prisma.payment.findMany({
        where:   { user_id: userId },
        orderBy: { created_at: 'desc' },
      });

      return res.status(200).json({ payments });
    } catch (error) {
      next(error);
    }
  },
);

export { router as paymentRoutes };