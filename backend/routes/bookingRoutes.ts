// routes/bookingRoutes.ts
// Handles lesson booking and cancellation.
// The Rule of 4 is enforced here — a lesson cannot exceed 4 confirmed bookings.

import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
import { prisma } from '../client';

config();

interface AuthTokenPayload {
  user: { id: string };
}

interface CreateBookingBody {
  child_id:  string;
  lesson_id: string;
}

const MAX_CAPACITY = 4;

const router = Router();

/**
 * POST /swimly-api/bookings
 * Books a lesson for a child.
 *
 * Rule of 4 enforcement:
 * We count confirmed bookings for the lesson inside a transaction.
 * If the count is already at capacity we reject — this prevents race conditions
 * where two parents book the last spot simultaneously.
 */
router.post(
  '/',
  async (req: Request<{}, any, CreateBookingBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const { child_id, lesson_id } = req.body;

      if (!child_id || !lesson_id) {
        return res.status(400).json({ message: 'child_id and lesson_id are required' });
      }

      // Verify the child belongs to the authenticated user
      const child = await prisma.child.findFirst({
        where: { child_id, user_id: userId },
      });

      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      // Use a transaction to atomically check capacity and create the booking
      const booking = await prisma.$transaction(async (tx) => {
        const confirmedCount = await tx.booking.count({
          where: { lesson_id, status: 'CONFIRMED' },
        });

        if (confirmedCount >= MAX_CAPACITY) {
          throw new Error('LESSON_FULL');
        }

        return tx.booking.create({
          data: { child_id, lesson_id },
          include: { lesson: true, child: true },
        });
      });

      return res.status(201).json({ booking });
    } catch (error) {
      if (error instanceof Error && error.message === 'LESSON_FULL') {
        return res.status(409).json({ message: 'This lesson is fully booked' });
      }
      next(error);
    }
  },
);

/**
 * GET /swimly-api/bookings
 * Returns all bookings for the authenticated user across all their children.
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const bookings = await prisma.booking.findMany({
        where: {
          child: { user_id: userId },
        },
        include: {
          lesson: true,
          child:  true,
        },
        orderBy: { created_at: 'desc' },
      });

      return res.status(200).json({ bookings });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * DELETE /swimly-api/bookings/:id
 * Cancels a booking and refunds the credit to the user's balance.
 */
router.delete(
  '/:id',
  async (req: Request<{ id: string }, any, {}>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const bookingId = req.params.id as string;

      const booking = await prisma.booking.findFirst({
        where: {
          booking_id: bookingId,
          child: { user_id: userId },
        },
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.status === 'CANCELLED') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      await prisma.$transaction([
        prisma.booking.update({
          where: { booking_id: bookingId },
          data:  { status: 'CANCELLED' },
        }),
        prisma.balance.update({
          where: { user_id: userId },
          data:  { balance: { increment: 1 } },
        }),
      ]);

      return res.status(200).json({ message: 'Booking cancelled and credit refunded' });
    } catch (error) {
      next(error);
    }
  },
);

export { router as bookingRoutes };