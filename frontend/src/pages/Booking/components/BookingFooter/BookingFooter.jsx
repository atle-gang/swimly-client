import { formatPrice } from '../../../../utils/bookingUtils';
import styles from './BookingFooter.module.css';

/**
 * @param {object}    props
 * @param {object}    props.selectedSlot  - the full slot object, or null
 * @param {object}    props.child         - the child being booked for
 * @param {string}    props.dayLabel      - e.g. "Thu 13 Mar"
 * @param {Function}  props.onConfirm     - called when the CTA is pressed
 */
function BookingFooter({ selectedSlot, child, dayLabel, onConfirm }) {
  if (!selectedSlot) return null;

  const { time, priceRands } = selectedSlot;

  return (
    <footer className={styles.footer}>
      <div className={styles.summary}>
        <div>
          <p className={styles.summaryLabel}>Selected</p>
          <p className={styles.summaryDetail}>
            {dayLabel} · {time} · {child.name}
          </p>
        </div>
        <span className={styles.price}>{formatPrice(priceRands)}</span>
      </div>

      <button className={styles.confirmBtn} onClick={onConfirm}>
        Confirm &amp; Pay
      </button>

      <p className={styles.policy}>
        Cancel up to 24 hrs before for a full credit refund
      </p>
    </footer>
  );
}

export default BookingFooter;