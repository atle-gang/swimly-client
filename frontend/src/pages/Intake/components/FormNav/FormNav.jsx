import { ArrowLeft } from 'lucide-react';
import styles from './FormNav.module.css';

/**
 * @param {object}   props
 * @param {number}   props.currentStep
 * @param {number}   props.totalSteps
 * @param {boolean}  props.isSubmitting  - disables the button during async submit
 * @param {Function} props.onBack
 * @param {Function} props.onNext        - also used for submit on last step
 */
function FormNav({ currentStep, totalSteps, isSubmitting, onBack, onNext }) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className={styles.nav}>
      {/* Back button — hidden on first step */}
      {!isFirstStep ? (
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
      ) : (
        // Placeholder keeps the layout consistent on step 1
        <div className={styles.backPlaceholder} />
      )}

      {/* Next / Submit */}
      <div className={styles.nextWrapper}>
        <button
          type="button"
          className={styles.nextBtn}
          onClick={onNext}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving…'
            : isLastStep
            ? 'Submit'
            : 'Next'}
        </button>
        {!isLastStep && (
          <p className={styles.stepHint}>
            Step {currentStep + 1} of {totalSteps} —{' '}
            {currentStep === 1 && 'Experience & Safety'}
            {currentStep === 2 && 'Nap Times'}
            {currentStep === 3 && 'Review your details'}
          </p>
        )}
      </div>
    </div>
  );
}

export default FormNav;