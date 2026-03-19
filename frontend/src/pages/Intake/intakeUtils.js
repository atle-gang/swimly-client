/**
 * Calculates age in months from a date-of-birth string.
 * Used to display the auto-calculated age badge on Step 1.
 *
 * @param {string} dob - ISO date string e.g. "2024-07-01"
 * @returns {number} age in complete months, or -1 if invalid
 */
export function calcAgeMonths(dob) {
  if (!dob) return -1;
  const date = new Date(dob);
  if (isNaN(date.getTime())) return -1;
  const now = new Date();
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  );
}

/**
 * Formats an age in months to a human-readable string.
 * e.g. 8 → "8 months", 14 → "1 year 2 months", 24 → "2 years"
 *
 * @param {number} months
 * @returns {string}
 */
export function formatAge(months) {
  if (months < 0) return '';
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const rem   = months % 12;
  if (rem === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} yr ${rem} mo`;
}

/**
 * Maps age in months to the correct swim class group name.
 *
 * @param {number} months
 * @returns {string}
 */
export function getAgeGroup(months) {
  if (months < 6)  return 'Tiny Dippers (0–6 months)';
  if (months < 18) return 'Baby Splashers (6–18 months)';
  if (months < 36) return 'Little Swimmers (18m–3 years)';
  return 'Junior Strokes (3–5 years)';
}

/**
 * Generates a list of time options in 15-minute increments.
 * Used to populate the nap time select inputs.
 *
 * @returns {{ value: string, label: string }[]}
 */
export function generateTimeOptions() {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const value = `${hh}:${mm}`;
      const period = h < 12 ? 'AM' : 'PM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const label = `${h12}:${mm} ${period}`;
      options.push({ value, label });
    }
  }
  return options;
}