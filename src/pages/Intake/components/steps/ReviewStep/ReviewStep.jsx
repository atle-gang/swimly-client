import { useFormContext } from 'react-hook-form';
import { User, Layers, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { calcAgeMonths, formatAge, getAgeGroup } from '../../../intakeUtils';
import { EXPERIENCE_LEVELS, MEDICAL_FLAGS } from '../../../intakeSchema';
import styles from './ReviewStep.module.css';

function ReviewStep() {
  const { getValues } = useFormContext();
  const values = getValues();

  const ageMonths   = calcAgeMonths(values.dateOfBirth);
  const ageDisplay  = formatAge(ageMonths);
  const ageGroup    = getAgeGroup(ageMonths);

  const experienceLabel =
    EXPERIENCE_LEVELS.find((l) => l.id === values.experienceLevel)?.label ?? '—';

  const flagLabels = (values.medicalFlags ?? []).map(
    (id) => MEDICAL_FLAGS.find((f) => f.id === id)?.label ?? id
  );

  return (
    <div className={styles.step}>
      <p className={styles.intro}>
        Please review the details before submitting. You can go back to edit any step.
      </p>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <User size={14} strokeWidth={2} />
          <span>Basics</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Name</span>
          <span className={styles.rowValue}>{values.childName || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Date of birth</span>
          <span className={styles.rowValue}>{values.dateOfBirth || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Age</span>
          <span className={styles.rowValue}>{ageDisplay || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Class group</span>
          <span className={styles.rowValue}>{ageGroup || '—'}</span>
        </div>
      </div>

      {/* Section: Experience */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Layers size={14} strokeWidth={2} />
          <span>Experience</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Level</span>
          <span className={styles.rowValue}>{experienceLabel}</span>
        </div>
      </div>

      {/* Section: Safety */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <ShieldAlert size={14} strokeWidth={2} />
          <span>Medical &amp; safety</span>
        </div>
        {flagLabels.length === 0 ? (
          <div className={styles.row}>
            <span className={styles.rowValue} style={{ color: 'var(--color-grey-4)' }}>
              No flags selected
            </span>
          </div>
        ) : (
          flagLabels.map((label) => (
            <div key={label} className={styles.row}>
              <CheckCircle2 size={13} className={styles.flagIcon} />
              <span className={styles.rowValue}>{label}</span>
            </div>
          ))
        )}
        {values.additionalNotes && (
          <div className={styles.notesBox}>
            <p className={styles.rowLabel}>Additional notes</p>
            <p className={styles.notesText}>{values.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* Section: Nap times */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Clock size={14} strokeWidth={2} />
          <span>Nap times</span>
        </div>
        {(values.napTimes ?? []).length === 0 ? (
          <div className={styles.row}>
            <span className={styles.rowValue} style={{ color: 'var(--color-grey-4)' }}>
              No nap times added
            </span>
          </div>
        ) : (
          values.napTimes.map((nap, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.rowLabel}>Nap {i + 1}</span>
              <span className={styles.rowValue}>
                {nap.start} – {nap.end}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewStep;