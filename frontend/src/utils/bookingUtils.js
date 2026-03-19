/**
 * Returns how many spots are remaining in a slot.
 * @param {number} bookedCount
 * @param {number} maxCapacity
 * @returns {number}
 */
export function spotsRemaining(bookedCount, maxCapacity) {
  return Math.max(0, maxCapacity - bookedCount);
}

/**
 * Returns true if a slot has no spots left.
 * @param {number} bookedCount
 * @param {number} maxCapacity
 * @returns {boolean}
 */
export function isSlotFull(bookedCount, maxCapacity) {
  return bookedCount >= maxCapacity;
}

/**
 * Formats a price in Rands.
 * @param {number} amount
 * @returns {string} e.g. "R350"
 */
export function formatPrice(amount) {
  return `R${amount.toLocaleString('en-ZA')}`;
}

/**
 * Determines which time-of-day bucket a time string falls into.
 * Morning:   00:00 – 11:59
 * Afternoon: 12:00 – 23:59
 *
 * @param {string} time  "HH:MM" 24-hour format
 * @returns {'morning' | 'afternoon'}
 */
export function getTimeOfDay(time) {
  const [hours] = time.split(':').map(Number);
  return hours < 12 ? 'morning' : 'afternoon';
}

/**
 * Filters slots by the active time filter and selected day index.
 *
 * @param {object[]} slots
 * @param {string}   filterId  - one of TIME_FILTERS ids
 * @param {number}   dayIndex
 * @returns {object[]}
 */
export function filterSlots(slots, filterId, dayIndex) {
  return slots
    .filter((slot) => slot.dayIndex === dayIndex)
    .filter((slot) => {
      if (filterId === 'all' || filterId === 'avoids-naps') return true;
      return getTimeOfDay(slot.time) === filterId;
    });
}