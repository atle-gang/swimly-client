import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../client';

interface GetLessonsQuery {
  date?:      string;  // ISO date string — filter by day
  age_group?: string;  // e.g. "0-12 months"
}

const router = Router();

/**
 * GET /swimly-api/lessons
 * Returns available lessons with their current booking counts.
 * The frontend uses bookedCount to drive the Rule of 4 dot indicator.
 */
router.get(
  '/',
  async (req: Request<{}, any, {}, GetLessonsQuery>, res: Response, next: NextFunction) => {
    try {
      const { date, age_group } = req.query;

      const lessons = await prisma.lesson.findMany({
        where: {
          ...(date && {
            lesson_date: {
              // Match all lessons on the given calendar day
              gte: new Date(`${date}T00:00:00.000Z`),
              lte: new Date(`${date}T23:59:59.999Z`),
            },
          }),
          ...(age_group && { age_group }),
        },
        include: {
          // Count only confirmed bookings — cancelled ones free the spot
          _count: {
            select: {
              bookings: { where: { status: 'CONFIRMED' } },
            },
          },
        },
        orderBy: { lesson_time: 'asc' },
      });

      // Shape the response to match the frontend slot structure
      const slots = lessons.map((lesson) => ({
        id:           lesson.lesson_id,
        className:    lesson.class_name,
        instructor:   lesson.instructor,
        date:         lesson.lesson_date,
        time:         lesson.lesson_time,
        durationMin:  lesson.duration_min,
        maxCapacity:  lesson.max_capacity,
        bookedCount:  lesson._count.bookings,
        priceRands:   Number(lesson.price_rands),
        ageGroup:     lesson.age_group,
      }));

      return res.status(200).json({ slots });
    } catch (error) {
      next(error);
    }
  },
);

export { router as lessonRoutes };