import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
import { prisma } from '../client';

config();

interface AuthTokenPayload {
  user: { id: string };
}

// Shape of the intake form payload the frontend sends
interface CreateChildBody {
  childName:       string;
  dateOfBirth:     string;
  experienceLevel: string;
  medicalFlags:    string[];
  additionalNotes: string | null;
  napTimes:        { start: string; end: string }[];
}

const router = Router();

/**
 * POST /swimly-api/children
 * Creates a child profile from the intake form submission.
 * NapTimes are created in the same transaction as the child.
 */
router.post(
  '/',
  async (req: Request<{}, any, CreateChildBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const {
        childName,
        dateOfBirth,
        experienceLevel,
        medicalFlags,
        additionalNotes,
        napTimes,
      } = req.body;

      if (!childName || !dateOfBirth || !experienceLevel) {
        return res.status(400).json({
          message: 'childName, dateOfBirth and experienceLevel are required',
        });
      }

      // Cap nap times at 3 — mirrors the frontend Zod schema rule
      if (napTimes && napTimes.length > 3) {
        return res.status(400).json({ message: 'Maximum of 3 nap times allowed' });
      }

      const child = await prisma.child.create({
        data: {
          user_id:          userId,
          name:             childName,
          date_of_birth:    new Date(dateOfBirth),
          experience_level: experienceLevel,
          medical_flags:    medicalFlags ?? [],
          additional_notes: additionalNotes ?? null,
          // Create all nap times in the same DB transaction
          nap_times: {
            create: (napTimes ?? []).map((nap) => ({
              start_time: nap.start,
              end_time:   nap.end,
            })),
          },
        },
        // Return the child with nap times included
        include: { nap_times: true },
      });

      return res.status(201).json({ child });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /swimly-api/children
 * Returns all child profiles for the authenticated user.
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const children = await prisma.child.findMany({
        where:   { user_id: userId },
        include: { nap_times: true },
        orderBy: { created_at: 'desc' },
      });

      return res.status(200).json({ children });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /swimly-api/children/:id
 * Returns a single child profile by ID.
 */
router.get(
  '/:id',
  async (req: Request<{ id: string }, any, {}>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const childId = req.params.id as string;

      const child = await prisma.child.findFirst({
        where:   { child_id: childId, user_id: userId },
        include: { nap_times: true },
      });

      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }

      return res.status(200).json({ child });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * PATCH /swimly-api/children/:id
 * Updates the editable fields of a child profile.
 * Name and date of birth are intentionally excluded — these do not change.
 */
router.patch(
  '/:id',
  async (req: Request<{ id: string }, any, Partial<CreateChildBody>>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;
 
      const childId = req.params.id as string;
 
      // Verify the child belongs to the authenticated user
      const existing = await prisma.child.findFirst({
        where: { child_id: childId, user_id: userId },
      });
 
      if (!existing) {
        return res.status(404).json({ message: 'Child not found' });
      }
 
      const { experienceLevel, medicalFlags, additionalNotes, napTimes } = req.body;
 
      if (napTimes && napTimes.length > 3) {
        return res.status(400).json({ message: 'Maximum of 3 nap times allowed' });
      }
 
      // Update child and replace nap times in one transaction
      const updated = await prisma.$transaction(async (tx) => {
        // Delete existing nap times and recreate — simplest way to handle
        // additions, removals and edits without diffing
        if (napTimes !== undefined) {
          await tx.napTime.deleteMany({ where: { child_id: childId } });
        }
 
        return tx.child.update({
          where: { child_id: childId },
          data: {
            ...(experienceLevel !== undefined && { experience_level: experienceLevel }),
            ...(medicalFlags    !== undefined && { medical_flags:    medicalFlags    }),
            ...(additionalNotes !== undefined && { additional_notes: additionalNotes }),
            ...(napTimes !== undefined && {
              nap_times: {
                create: napTimes.map((nap) => ({
                  start_time: nap.start,
                  end_time:   nap.end,
                })),
              },
            }),
          },
          include: { nap_times: true },
        });
      });
 
      return res.status(200).json({ child: updated });
    } catch (error) {
      next(error);
    }
  },
);

export { router as childRoutes };