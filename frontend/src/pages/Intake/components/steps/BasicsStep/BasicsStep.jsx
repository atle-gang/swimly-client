import { useFormContext, useWatch } from 'react-hook-form';
import { Baby } from 'lucide-react';
import { calcAgeMonths, formatAge, getAgeGroup } from '../../../intakeUtils';
import styles from './BasicsStep.module.css';

function BasicsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Watch DOB in real-time to update the age badge without submitting
  const dob = useWatch({ name: 'dateOfBirth' });
  const ageMonths  = calcAgeMonths(dob);
  const ageDisplay = formatAge(ageMonths);
  const ageGroup   = ageMonths >= 0 ? getAgeGroup(ageMonths) : null;

  // Max date for the DOB picker = today (can't be born in the future)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.step}>
      <div className={styles.fieldGroup}>
        <label htmlFor="childName" className={styles.label}>
          Child's name
        </label>
        <input
          id="childName"
          type="text"
          placeholder="e.g. Mia"
          className={`${styles.input} ${errors.childName ? styles.inputError : ''}`}
          {...register('childName')}
        />
        {errors.childName && (
          <p className={styles.errorMsg}>{errors.childName.message}</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="dateOfBirth" className={styles.label}>
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          type="date"
          max={today}
          className={`${styles.input} ${errors.dateOfBirth ? styles.inputError : ''}`}
          {...register('dateOfBirth')}
        />
        {errors.dateOfBirth && (
          <p className={styles.errorMsg}>{errors.dateOfBirth.message}</p>
        )}

        {ageDisplay && !errors.dateOfBirth && (
          <div className={styles.ageBadge}>
            <Baby size={15} strokeWidth={1.8} />
            <span>
              {ageDisplay} · {ageGroup}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default BasicsStep;