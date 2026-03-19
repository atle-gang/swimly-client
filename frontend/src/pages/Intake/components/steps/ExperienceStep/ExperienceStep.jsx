import { useFormContext, useWatch } from 'react-hook-form';
import { CheckCircle2, Circle, AlertTriangle, Stethoscope } from 'lucide-react';
import { EXPERIENCE_LEVELS, MEDICAL_FLAGS } from '../../../intakeSchema';
import styles from './ExperienceStep.module.css';

function ExperienceStep() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedLevel = useWatch({ name: 'experienceLevel' });
  const selectedFlags = useWatch({ name: 'medicalFlags' }) ?? [];

  function handleExperienceSelect(id) {
    setValue('experienceLevel', id, { shouldValidate: true });
  }

  function handleFlagToggle(id) {
    const updated = selectedFlags.includes(id)
      ? selectedFlags.filter((f) => f !== id)
      : [...selectedFlags, id];
    setValue('medicalFlags', updated, { shouldValidate: true });
  }

  // Show the notes textarea only if any medical flag is ticked
  const showNotes = selectedFlags.length > 0;

  return (
    <div className={styles.step}>

      <div className={styles.fieldGroup}>
        <p className={styles.label}>Experience level</p>

        <div className={styles.expCards}>
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                type="button"
                className={`${styles.expCard} ${isSelected ? styles.expCardSelected : ''}`}
                onClick={() => handleExperienceSelect(level.id)}
                aria-pressed={isSelected}
              >
                <div className={styles.expText}>
                  <span className={styles.expTitle}>{level.label}</span>
                  <span className={styles.expDesc}>{level.description}</span>
                </div>
                <span className={styles.expCheck}>
                  {isSelected
                    ? <CheckCircle2 size={20} strokeWidth={2} />
                    : <Circle size={20} strokeWidth={1.5} />}
                </span>
              </button>
            );
          })}
        </div>

        {errors.experienceLevel && (
          <p className={styles.errorMsg}>{errors.experienceLevel.message}</p>
        )}
      </div>

      {/* Medical & safety flags */}
      <div className={styles.fieldGroup}>
        <p className={styles.label}>
          <AlertTriangle size={13} strokeWidth={2} />
          Medical &amp; safety flags
        </p>

        {/* Safety banner */}
        <div className={styles.safetyBanner}>
          <Stethoscope size={16} strokeWidth={1.8} />
          <span>Tick all that apply — helps us keep your child safe.</span>
        </div>

        <div className={styles.checkList}>
          {MEDICAL_FLAGS.map((flag) => {
            const isChecked = selectedFlags.includes(flag.id);
            return (
              <button
                key={flag.id}
                type="button"
                className={`${styles.checkRow} ${isChecked ? styles.checkRowActive : ''}`}
                onClick={() => handleFlagToggle(flag.id)}
                aria-pressed={isChecked}
              >
                {/* Custom checkbox visual */}
                <span className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                  {isChecked && <CheckCircle2 size={14} strokeWidth={2.5} />}
                </span>
                <span className={styles.checkLabel}>{flag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional notes — conditionally shown */}
      {showNotes && (
        <div className={styles.fieldGroup}>
          <label htmlFor="additionalNotes" className={styles.label}>
            Additional notes
            <span className={styles.optional}> (optional)</span>
          </label>
          <textarea
            id="additionalNotes"
            placeholder="e.g. Mia had an ear infection last month and wears ear plugs in the water…"
            className={styles.textarea}
            rows={3}
            {...register('additionalNotes')}
          />
          {errors.additionalNotes && (
            <p className={styles.errorMsg}>{errors.additionalNotes.message}</p>
          )}
        </div>
      )}

    </div>
  );
}

export default ExperienceStep;