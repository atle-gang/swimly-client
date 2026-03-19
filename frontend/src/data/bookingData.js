export const MOCK_CHILD = {
  id: 'child-1',
  name: 'Mia',
  ageMonths: 8,
  ageGroup: 'Baby Splashers',
  ageGroupRange: 'Ages 0–12 months',
};

/**
 * Available class slots for the current week.
 * `bookedCount` drives the "x of 4 spots taken" Rule-of-4 display.
 */
export const MOCK_SLOTS = [
  {
    id: 'slot-1',
    time: '08:00',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Lebo',
    priceRands: 350,
    bookedCount: 2,   
    maxCapacity: 4,
    dayIndex: 0,      
  },
  {
    id: 'slot-2',
    time: '11:00',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Priya',
    priceRands: 350,
    bookedCount: 1,
    maxCapacity: 4,
    dayIndex: 0,
  },
  {
    id: 'slot-3',
    time: '13:00',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Sam',
    priceRands: 350,
    bookedCount: 4,   
    maxCapacity: 4,
    dayIndex: 0,
  },
  {
    id: 'slot-4',
    time: '15:30',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Lebo',
    priceRands: 350,
    bookedCount: 2,
    maxCapacity: 4,
    dayIndex: 0,
  },
  {
    id: 'slot-5',
    time: '09:00',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Priya',
    priceRands: 350,
    bookedCount: 0,
    maxCapacity: 4,
    dayIndex: 1,
  },
  {
    id: 'slot-6',
    time: '14:00',
    durationMin: 30,
    className: 'Baby Splashers',
    instructor: 'Coach Sam',
    priceRands: 350,
    bookedCount: 3,
    maxCapacity: 4,
    dayIndex: 1,
  },
];

/**
 * Generates the next 6 days starting from today.
 * Keeps the calendar strip always current without hardcoding dates.
 *
 * @returns {{ label: string, dateNum: number, fullLabel: string, index: number }[]}
 */
export function generateWeekDays() {
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_LABELS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const today = new Date();

  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      index: i,
      label: DAY_LABELS[date.getDay()],
      dateNum: date.getDate(),
      // Used in the section header: "Thursday 13 March"
      fullLabel: `${DAY_LABELS[date.getDay()]} ${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`,
    };
  });
}

/** Filter options for the time-of-day strip */
export const TIME_FILTERS = [
  { id: 'all', label: 'All times' },
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'avoids-naps', label: 'Avoids naps' },
];