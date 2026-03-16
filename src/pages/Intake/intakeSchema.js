import { z } from 'zod';

const napTimeSchema = z
  .object({
    start: z
      .string()
      .min(1, 'Start time is required')
      .regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
    end: z
      .string()
      .min(1, 'End time is required')
      .regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  })
  .refine(
    (data) => {
      const toMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      return toMinutes(data.end) > toMinutes(data.start);
    },
    {
      message: 'End time must be after start time',
      path: ['end'],
    }
  );

export const EXPERIENCE_LEVELS = [
  {
    id: 'none',
    label: 'No experience',
    description: 'Never been in a pool before',
  },
  {
    id: 'splash',
    label: 'Splash confident',
    description: 'Bath / paddling pool comfortable',
  },
  {
    id: 'lessons',
    label: 'Has had lessons before',
    description: 'Some pool time with an instructor',
  },
  {
    id: 'submerging',
    label: 'Submerging',
    description: 'Comfortable going under water',
  },
];

export const MEDICAL_FLAGS = [
  { id: 'grommets',    label: 'Ear condition or grommets' },
  { id: 'eczema',      label: 'Skin sensitivities or eczema' },
  { id: 'allergies',   label: 'Allergies' },
  { id: 'fear',        label: 'Fear of water' },
  { id: 'other',       label: 'Other medical condition' },
];

export const intakeSchema = z.object({
  childName: z
    .string()
    .min(1, 'Child\'s name is required')
    .max(50, 'Name is too long'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((dob) => {
      const date = new Date(dob);
      const now = new Date();
      return !isNaN(date.getTime()) && date < now;
    }, 'Please enter a valid date of birth')
    .refine((dob) => {
      const date = new Date(dob);
      const now = new Date();
      const ageMonths =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());
      return ageMonths >= 0 && ageMonths <= 60;
    }, 'Child must be between 0 and 5 years old'),

  experienceLevel: z
    .string()
    .min(1, 'Please select an experience level'),

  medicalFlags: z.array(z.string()).default([]),

  additionalNotes: z.string().max(500, 'Notes must be under 500 characters').optional(),

  napTimes: z
    .array(napTimeSchema)
    .max(3, 'You can add up to 3 nap times')
    .default([]),
});