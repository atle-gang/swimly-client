import { Check } from 'lucide-react';
import { formatRands } from '../../pricingUtils';
import styles from './SingleLessonCard.module.css';

/**
 * @param {object}   props
 * @param {object}   props.lesson    - SINGLE_LESSON data object
 * @param {Function} props.onSelect  - called when the book button is pressed
 */
function SingleLessonCard({ lesson }) {
  const { title, subtitle, priceRands, features } = lesson;

  return (
    <div className={styles.card}>
      {/* Top row: title + price */}
      <div className={styles.top}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.priceBlock}>
          <span className={styles.price}>{formatRands(priceRands)}</span>
          <span className={styles.priceSub}>per lesson</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Feature checklist */}
      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature} className={styles.featureRow}>
            <Check size={14} strokeWidth={2.5} className={styles.checkIcon} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SingleLessonCard;