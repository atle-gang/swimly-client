import PackCard from './PackCard';
import CreditsExplainer from '../CreditsExplainer/CreditsExplainer';
import PolicyList from '../PolicyList/PolicyList';
import { POLICIES } from '../../pricingData';
import styles from './PackList.module.css';

/**
 * @param {object}   props
 * @param {object[]} props.packs           - CREDIT_PACKS array
 * @param {string}   props.selectedPackId  - id of currently selected pack
 * @param {Function} props.onPackSelect    - called with pack id
 */
function PackList({ packs, selectedPackId, onPackSelect }) {
  return (
    <div className={styles.container}>
      <p className={styles.sectionLabel}>Credit Packs — save per lesson</p>

      <div className={styles.list}>
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            isSelected={pack.id === selectedPackId}
            onSelect={onPackSelect}
          />
        ))}
      </div>

      <CreditsExplainer />

      <div className={styles.divider} />

      <PolicyList policies={POLICIES} />
    </div>
  );
}

export default PackList;