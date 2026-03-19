import styles from './FormProgress.module.css';

const STEPS = [
  { number: 1, label: 'Basics' },
  { number: 2, label: 'Experience & Safety' },
  { number: 3, label: 'Nap Times' },
  { number: 4, label: 'Review' },
];

/**
 * @param {object} props
 * @param {number} props.currentStep  - 1-based current step number
 */
function FormProgress({ currentStep }) {
  const current = STEPS[currentStep - 1];
  const fillPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <span className={styles.stepLabel}>
          Step {currentStep} of {STEPS.length}
        </span>
        <span className={styles.stepName}>{current.label}</span>
      </div>

      <div className={styles.track} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={STEPS.length}>
        <div
          className={styles.fill}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      <div className={styles.dots}>
        {STEPS.map((step) => (
          <span
            key={step.number}
            className={[
              styles.dot,
              step.number < currentStep  ? styles.done    : '',
              step.number === currentStep ? styles.current : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={`Step ${step.number}: ${step.label}`}
          />
        ))}
      </div>
    </div>
  );
}

export default FormProgress;