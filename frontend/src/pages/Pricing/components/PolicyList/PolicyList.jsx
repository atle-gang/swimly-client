import { RefreshCw, Lock, Mail } from 'lucide-react';
import styles from './PolicyList.module.css';

// Map icon id strings from pricingData to lucide components
const ICON_MAP = {
  refresh: RefreshCw,
  lock:    Lock,
  mail:    Mail,
};

/**
 * @param {object}   props
 * @param {object[]} props.policies  - POLICIES array from pricingData
 */
function PolicyList({ policies }) {
  return (
    <ul className={styles.list}>
      {policies.map((policy) => {
        const Icon = ICON_MAP[policy.icon];
        return (
          <li key={policy.id} className={styles.row}>
            {Icon && (
              <Icon size={15} strokeWidth={1.8} className={styles.icon} />
            )}
            <p className={styles.text}>{policy.text}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default PolicyList;