import { formatPrice } from '../../../../utils/bookingUtils';
import styles from './BookingFooter.module.css';

/**
 * @param {object}    props
 * @param {object}    props.selectedSlot  - the full slot object, or null
 * @param {object}    props.child         - the child being booked for
 * @param {string}    props.dayLabel      - e.g. "Thu 13 Mar"
 * @param {Function}  props.onConfirm     - called when the CTA is pressed
 */
function BookingFooter({ selectedSlot, child, dayLabel, onConfirm, isLoading = false }) {
  // Do not render the footer until a slot is chosen
  if (!selectedSlot) return null;

  const { time, priceRands } = selectedSlot;

  return (
    <footer className={styles.footer}>
      {/* Summary row */}
      <div className={styles.summary}>
        <div>
          <p className={styles.summaryLabel}>Selected</p>
          <p className={styles.summaryDetail}>
            {dayLabel} · {time} · {child.name}
          </p>
        </div>
        <span className={styles.price}>{formatPrice(priceRands)}</span>
      </div>

      {/* CTA — placed last in DOM so it sits at the very bottom (thumb zone) */}
      <button className={styles.confirmBtn} onClick={onConfirm} disabled={isLoading}>
        {isLoading ? 'Booking…' : 'Confirm & Pay'}
      </button>

      <p className={styles.policy}>
        Cancel up to 24 hrs before for a full credit refund
      </p>
    </footer>
  );
}

export default BookingFooter;