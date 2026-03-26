/**
 * Formats a Rand amount with thousands separator.
 * e.g. 1600 → "R1 600",  350 → "R350"
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatRands(amount) {
  return `R${amount.toLocaleString('en-ZA')}`;
}