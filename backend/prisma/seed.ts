import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

// Age groups matching the frontend
const AGE_GROUPS = [
  '0-6 months',
  '6-18 months',
  '18m-3 years',
  '3-5 years',
];

// Class names per age group
const CLASS_NAMES: Record<string, string> = {
  '0-6 months':   'Tiny Dippers',
  '6-18 months':  'Baby Splashers',
  '18m-3 years':  'Little Swimmers',
  '3-5 years':    'Junior Strokes',
};

const INSTRUCTORS = ['Coach Lebo', 'Coach Priya', 'Coach Sam'];

// Four time slots per day
const TIME_SLOTS = ['08:00', '10:00', '13:00', '15:30'];

function getInstructor(index: number): string {
  return INSTRUCTORS[index % INSTRUCTORS.length];
}

async function main() {
  console.log('Seeding lessons…');

  // Clear existing lessons before reseeding
  await prisma.lesson.deleteMany();

  const lessons = [];
  const today = new Date();

  // Generate lessons for the next 14 days
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const lessonDate = new Date(today);
    lessonDate.setDate(today.getDate() + dayOffset);

    // Skip Sundays — no classes on Sundays
    if (lessonDate.getDay() === 0) continue;

    for (let timeIndex = 0; timeIndex < TIME_SLOTS.length; timeIndex++) {
      const time = TIME_SLOTS[timeIndex];

      // One lesson per age group per time slot
      for (let groupIndex = 0; groupIndex < AGE_GROUPS.length; groupIndex++) {
        const ageGroup  = AGE_GROUPS[groupIndex];
        const className = CLASS_NAMES[ageGroup];

        lessons.push({
          class_name:   className,
          instructor:   getInstructor(timeIndex + groupIndex),
          lesson_date:  new Date(lessonDate.setHours(0, 0, 0, 0)),
          lesson_time:  time,
          duration_min: 30,
          max_capacity: 4,
          price_rands:  350,
          age_group:    ageGroup,
        });
      }
    }
  }

  await prisma.lesson.createMany({ data: lessons });

  console.log(`Seeded ${lessons.length} lessons across 14 days.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });