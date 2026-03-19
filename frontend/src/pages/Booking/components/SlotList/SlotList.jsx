import SlotCard from '../SlotCard/Slotcard';
import styles from './SlotList.module.css';

/**
 * @param {object}   props
 * @param {object[]} props.slots          - filtered slots to display
 * @param {string}   props.sectionTitle   - e.g. "Thursday 13 March"
 * @param {string}   props.selectedSlotId - id of currently selected slot
 * @param {Function} props.onSlotSelect   - called with slot id
 */
function SlotList({ slots, sectionTitle, selectedSlotId, onSlotSelect }) {
  return (
    <section className={styles.section}>
      {/* Section header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{sectionTitle}</h2>
        <span className={styles.count}>
          {slots.length} {slots.length === 1 ? 'slot' : 'slots'}
        </span>
      </div>

      {/* Slot cards or empty state */}
      {slots.length === 0 ? (
        <div className={styles.empty}>
          <p>No classes match your filters for this day.</p>
          <p>Try a different day or remove a filter.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              isSelected={slot.id === selectedSlotId}
              onSelect={onSlotSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SlotList;