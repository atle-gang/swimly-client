import { formatRands } from '../../pricingUtils';
import styles from './PackCard.module.css';

/**
 * @param {object}   props
 * @param {object}   props.pack       - a CREDIT_PACKS item
 * @param {boolean}  props.isSelected - whether this pack is chosen
 * @param {Function} props.onSelect   - called with pack.id on click
 */
function PackCard({ pack, isSelected, onSelect }) {
  const { id, name, description, priceRands, perLessonRands, savingRands, featured } = pack;

  const cardClass = [
    styles.card,
    featured    ? styles.featured  : '',
    isSelected  ? styles.selected  : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      className={cardClass}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(id)}
      aria-pressed={isSelected}
      aria-label={`${name}, ${formatRands(priceRands)}, saves ${formatRands(savingRands)}`}
    >
      {/* Best value badge — only on featured pack */}
      {featured && (
        <span className={styles.badge}>BEST VALUE</span>
      )}

      {/* Pack icon placeholder — lucide Layers icon */}
      <div className={styles.iconBlock}>
        <span className={styles.lessonCount}>{pack.lessonCount}</span>
        <span className={styles.lessonLabel}>lessons</span>
      </div>

      {/* Pack info */}
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Price block */}
      <div className={styles.priceBlock}>
        <span className={styles.price}>{formatRands(priceRands)}</span>
        <span className={styles.perLesson}>{formatRands(perLessonRands)} / lesson</span>
        <span className={styles.saving}>Save {formatRands(savingRands)}</span>
      </div>
    </article>
  );
}

export default PackCard;