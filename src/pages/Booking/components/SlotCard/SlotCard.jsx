import { Clock, User } from 'lucide-react';
import SpotIndicator from './SpotIndicator';
import { isSlotFull, formatPrice } from '../../../../utils/bookingUtils';
import styles from './SlotCard.module.css';

/**
 * @param {object}   props
 * @param {object}   props.slot        - slot data object from bookingData.js
 * @param {boolean}  props.isSelected  - whether this slot is currently chosen
 * @param {Function} props.onSelect    - called with slot.id when the card is clicked
 */
function SlotCard({ slot, isSelected, onSelect }) {
  const { id, time, durationMin, className, instructor, priceRands, bookedCount, maxCapacity } = slot;
  const full = isSlotFull(bookedCount, maxCapacity);

  // Determine which CSS state class to apply
  const cardClass = [
    styles.card,
    isSelected ? styles.selected : '',
    full ? styles.full : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleClick() {
    // Guard: do not allow selecting a full slot
    if (full) return;
    onSelect(id);
  }

  return (
    <article
      className={cardClass}
      onClick={handleClick}
      // Keyboard accessibility
      role="button"
      tabIndex={full ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-disabled={full}
      aria-label={`${className} at ${time} with ${instructor}, ${formatPrice(priceRands)}`}
    >
      {/* Time block */}
      <div className={styles.timeBlock}>
        <span className={styles.time}>{time}</span>
        <span className={styles.duration}>{durationMin} min</span>
      </div>

      {/* Class info */}
      <div className={styles.info}>
        <p className={styles.className}>{className}</p>
        <p className={styles.meta}>
          <User size={11} strokeWidth={2} />
          {instructor}
        </p>
        <p className={styles.meta}>
          <Clock size={11} strokeWidth={2} />
          {durationMin} min lesson
        </p>
      </div>

      <div className={styles.right}>
        <span className={`${styles.price} ${full ? styles.priceDisabled : ''}`}>
          {formatPrice(priceRands)}
        </span>

        {full ? (
          /* Full slot: show waitlist badge instead of spot dots */
          <div className={styles.fullBadge}>
            <span className={styles.fullLabel}>Class Full</span>
            <button
              className={styles.waitlistBtn}
              onClick={(e) => {
                // Stop propagation so the card click handler doesn't fire
                e.stopPropagation();
                alert('Waitlist feature coming soon!');
              }}
            >
              + Waitlist
            </button>
          </div>
        ) : (
          <SpotIndicator bookedCount={bookedCount} maxCapacity={maxCapacity} />
        )}
      </div>
    </article>
  );
}

export default SlotCard;