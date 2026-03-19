import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, X, Clock } from 'lucide-react';
import { generateTimeOptions } from '../../../intakeUtils';
import styles from './NapTimesStep.module.css';

// Generate once — options don't change during the session
const TIME_OPTIONS = generateTimeOptions();
const MAX_NAPS = 3;

function NapTimesStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // useFieldArray gives us append / remove without manual state
  const { fields, append, remove } = useFieldArray({ name: 'napTimes' });

  function handleAddNap() {
    // Guard: never exceed 3 nap slots
    if (fields.length >= MAX_NAPS) return;
    append({ start: '', end: '' });
  }

  const napErrors = errors.napTimes ?? [];

  return (
    <div className={styles.step}>

      {/* Explanation micro-copy */}
      <div className={styles.hint}>
        <Clock size={14} strokeWidth={1.8} />
        <p>
          We use this to suggest the best class times for your baby's schedule.
          You can add up to {MAX_NAPS} nap windows.
        </p>
      </div>

      {/* Dynamic nap slots */}
      <div className={styles.napList}>
        {fields.map((field, index) => {
          const slotErrors = napErrors[index];
          return (
            <div key={field.id} className={styles.napSlot}>
              {/* Index badge */}
              <span className={styles.napIndex}>{index + 1}</span>

              {/* Start / end pickers */}
              <div className={styles.pickers}>
                <div className={styles.pickerGroup}>
                  <label
                    htmlFor={`napTimes.${index}.start`}
                    className={styles.pickerLabel}
                  >
                    Start
                  </label>
                  <select
                    id={`napTimes.${index}.start`}
                    className={`${styles.select} ${slotErrors?.start ? styles.selectError : ''}`}
                    {...register(`napTimes.${index}.start`)}
                  >
                    <option value="">--:--</option>
                    {TIME_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {slotErrors?.start && (
                    <p className={styles.errorMsg}>{slotErrors.start.message}</p>
                  )}
                </div>

                <span className={styles.to}>to</span>

                <div className={styles.pickerGroup}>
                  <label
                    htmlFor={`napTimes.${index}.end`}
                    className={styles.pickerLabel}
                  >
                    End
                  </label>
                  <select
                    id={`napTimes.${index}.end`}
                    className={`${styles.select} ${slotErrors?.end ? styles.selectError : ''}`}
                    {...register(`napTimes.${index}.end`)}
                  >
                    <option value="">--:--</option>
                    {TIME_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {slotErrors?.end && (
                    <p className={styles.errorMsg}>{slotErrors.end.message}</p>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(index)}
                aria-label={`Remove nap ${index + 1}`}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add nap button — hidden once limit is reached */}
      {fields.length < MAX_NAPS && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAddNap}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add nap time
          <span className={styles.addBtnSub}>
            ({fields.length} of {MAX_NAPS})
          </span>
        </button>
      )}

      {/* Optional skip note */}
      {fields.length === 0 && (
        <p className={styles.skipNote}>
          No nap times added. You can skip this step if your child doesn't nap.
        </p>
      )}
    </div>
  );
}

export default NapTimesStep;