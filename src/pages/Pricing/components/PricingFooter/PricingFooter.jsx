import { formatRands } from '../../pricingUtils';
import { CREDIT_PACKS } from '../../pricingData';
import styles from './PricingFooter.module.css';

/**
 * @param {object}   props
 * @param {string}   props.activeView      - 'single' | 'packs'
 * @param {string}   props.selectedPackId  - id of the selected pack, or null
 * @param {Function} props.onPrimaryAction
 * @param {Function} props.onSecondaryAction
 */
function PricingFooter({ activeView, selectedPackId, onPrimaryAction, onSecondaryAction }) {
  // Determine the primary button label dynamically
  const selectedPack = CREDIT_PACKS.find((p) => p.id === selectedPackId);

  let primaryLabel;
  if (activeView === 'single') {
    primaryLabel = `Book a single lesson — ${formatRands(350)}`;
  } else if (selectedPack) {
    primaryLabel = `Buy ${selectedPack.name} — ${formatRands(selectedPack.priceRands)}`;
  } else {
    // Default to the featured pack when nothing is explicitly selected
    const featured = CREDIT_PACKS.find((p) => p.featured);
    primaryLabel = `Buy ${featured.name} — ${formatRands(featured.priceRands)}`;
  }

  const secondaryLabel =
    activeView === 'single'
      ? 'View credit packs instead'
      : 'Book a single lesson instead';

  return (
    <footer className={styles.footer}>
      <button className={styles.primaryBtn} onClick={onPrimaryAction}>
        {primaryLabel}
      </button>
      <button className={styles.secondaryBtn} onClick={onSecondaryAction}>
        {secondaryLabel}
      </button>
    </footer>
  );
}

export default PricingFooter;