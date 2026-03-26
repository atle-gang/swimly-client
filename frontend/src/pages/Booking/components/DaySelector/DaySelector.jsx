import styles from './DaySelector.module.css';

/**
 * @param {object}   props
 * @param {object[]} props.days           - array from generateWeekDays()
 * @param {number}   props.selectedDay    - index of the currently selected day
 * @param {Function} props.onDayChange    - called with the new day index
 */
function DaySelector({ days, selectedDay, onDayChange }) {
  return (
    <div className={styles.strip} role="group" aria-label="Select day">
      {days.map((day) => (
        <button
          key={day.index}
          className={`${styles.dayBtn} ${selectedDay === day.index ? styles.active : ''}`}
          onClick={() => onDayChange(day.index)}
          aria-pressed={selectedDay === day.index}
          aria-label={day.fullLabel}
        >
          <span className={styles.dayLabel}>{day.label}</span>
          <span className={styles.dayNum}>{day.dateNum}</span>
        </button>
      ))}
    </div>
  );
}

export default DaySelector;