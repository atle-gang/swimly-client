import styles from './ViewToggle.module.css';

/**
 * @param {object}   props
 * @param {object[]} props.options       - array of { id, label }
 * @param {string}   props.activeView    - id of the currently active view
 * @param {Function} props.onViewChange  - called with the new view id
 */
function ViewToggle({ options, activeView, onViewChange }) {
  return (
    <div className={styles.toggle} role="group" aria-label="Pricing view">
      {options.map((option) => (
        <button
          key={option.id}
          className={`${styles.btn} ${activeView === option.id ? styles.active : ''}`}
          onClick={() => onViewChange(option.id)}
          aria-pressed={activeView === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;