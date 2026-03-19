import { Info } from 'lucide-react';
import styles from './CreditsExplainer.module.css';

function CreditsExplainer() {
  return (
    <div className={styles.box}>
      <Info size={18} strokeWidth={1.8} className={styles.icon} />
      <p className={styles.text}>
        <strong>How credits work: </strong>
        Credits are added to your account instantly after purchase. One credit
        equals one lesson booking — on any date, any time. Credits{' '}
        <strong>never expire</strong> and can be used across multiple children.
      </p>
    </div>
  );
}

export default CreditsExplainer;