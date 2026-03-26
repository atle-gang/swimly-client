import styles from './FilterStrip.module.css';

/**
 * @param {object}   props
 * @param {object[]} props.filters        
 * @param {string}   props.activeFilter   
 * @param {Function} props.onFilterChange 
 */
function FilterStrip({ filters, activeFilter, onFilterChange }) {
  return (
    <div className={styles.strip} role="group" aria-label="Time filter">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.pill} ${activeFilter === filter.id ? styles.active : ''}`}
          onClick={() => onFilterChange(filter.id)}
          // Accessibility: tell screen readers which option is pressed
          aria-pressed={activeFilter === filter.id}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterStrip;