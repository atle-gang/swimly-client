import styles from './SpotIndicator.module.css';
import { spotsRemaining } from '../../../../utils/bookingUtils';

/**
 * Renders up to maxCapacity dots, filled for booked spots, empty for available.
 *
 * @param {object} props
 * @param {number} props.bookedCount
 * @param {number} props.maxCapacity
 */
function SpotIndicator({ bookedCount, maxCapacity }) {
  const remaining = spotsRemaining(bookedCount, maxCapacity);

  return (
    <div className={styles.wrapper} aria-label={`${remaining} of ${maxCapacity} spots remaining`}>
      <div className={styles.dots}>
        {Array.from({ length: maxCapacity }, (_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < bookedCount ? styles.taken : styles.available}`}
          />
        ))}
      </div>
      <span className={styles.label}>
        {remaining === 0 ? 'Full' : `${remaining} left`}
      </span>
    </div>
  );
}

export default SpotIndicator;