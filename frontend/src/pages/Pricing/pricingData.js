export const SINGLE_LESSON = {
  title: '30-min lesson',
  subtitle: 'All age groups · Max 4 children',
  priceRands: 350,
  features: [
    'Qualified AUSTSWIM instructor',
    'Pool equipment provided',
    'Safety briefing included',
    'Max 4 children per class',
    'Cancel 24 hrs before for a full credit refund',
  ],
};

/**
 * Credit pack offerings.
 * `featured` drives the "Best Value" badge and highlighted card style.
 * `savingRands` is derived (lessonCount * singlePrice - packPrice) but stored
 * explicitly so the UI never has to recalculate it.
 */
export const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: '3 lessons · No expiry',
    lessonCount: 3,
    priceRands: 990,
    perLessonRands: 330,
    savingRands: 60,
    featured: false,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    description: '5 lessons · No expiry',
    lessonCount: 5,
    priceRands: 1600,
    perLessonRands: 320,
    savingRands: 150,
    featured: true,
  },
  {
    id: 'term',
    name: 'Term Pack',
    description: '10 lessons · No expiry',
    lessonCount: 10,
    priceRands: 3000,
    perLessonRands: 300,
    savingRands: 500,
    featured: false,
  },
];

/**
 * Policy rows shown beneath the credit packs section.
 */
export const POLICIES = [
  {
    id: 'cancel',
    icon: 'refresh',
    text: 'Cancel up to 24 hours before and your credit is returned automatically.',
  },
  {
    id: 'secure',
    icon: 'lock',
    text: 'Payments secured via PayFast. Card details are never stored on our servers.',
  },
  {
    id: 'receipt',
    icon: 'mail',
    text: 'An email receipt is sent immediately after every purchase.',
  },
];

/** The two tabs in the view toggle */
export const PRICING_VIEWS = [
  { id: 'single', label: 'Single Lesson' },
  { id: 'packs',  label: 'Credit Packs'  },
];