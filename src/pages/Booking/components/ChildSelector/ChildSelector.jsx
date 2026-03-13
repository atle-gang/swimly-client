import { User } from 'lucide-react';
import styles from './ChildSelector.module.css';

/**
 * @param {object} props
 * @param {{ name: string, ageMonths: number, ageGroup: string, ageGroupRange: string }} props.child
 */
function ChildSelector({ child }) {
  const { name, ageMonths, ageGroup, ageGroupRange } = child;

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <User size={20} strokeWidth={1.8} />
      </div>
      <div className={styles.info}>
        <p className={styles.label}>Booking for</p>
        <h1 className={styles.name}>
          {name} <span className={styles.age}>· {ageMonths} months</span>
        </h1>
        <p className={styles.group}>
          {ageGroup} · {ageGroupRange}
        </p>
      </div>
    </div>
  );
}

export default ChildSelector;