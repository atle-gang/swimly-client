import styles from './Skeleton.module.css';

/**
 * Single skeleton block — animates with a shimmer effect.
 * @param {{ width?: string, height?: string, borderRadius?: string, style?: object }} props
 */
export function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

/**
 * Skeleton for a child card row.
 */
export function ChildCardSkeleton() {
  return (
    <div className={styles.cardRow}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div className={styles.cardLines}>
        <Skeleton width="120px" height="14px" />
        <Skeleton width="80px"  height="12px" style={{ marginTop: '6px' }} />
      </div>
      <Skeleton width="16px" height="16px" borderRadius="4px" style={{ marginLeft: 'auto' }} />
    </div>
  );
}

/**
 * Skeleton for a booking card row.
 */
export function BookingCardSkeleton() {
  return (
    <div className={styles.cardRow}>
      <Skeleton width="52px" height="52px" borderRadius="8px" />
      <div className={styles.cardLines}>
        <Skeleton width="140px" height="14px" />
        <Skeleton width="100px" height="12px" style={{ marginTop: '6px' }} />
      </div>
      <Skeleton width="32px" height="32px" borderRadius="50%" style={{ marginLeft: 'auto' }} />
    </div>
  );
}

/**
 * Skeleton for a slot card on the booking page.
 */
export function SlotCardSkeleton() {
  return (
    <div className={styles.slotRow}>
      <Skeleton width="58px" height="58px" borderRadius="10px" />
      <div className={styles.cardLines}>
        <Skeleton width="130px" height="14px" />
        <Skeleton width="90px"  height="12px" style={{ marginTop: '6px' }} />
      </div>
      <div className={styles.slotRight}>
        <Skeleton width="48px" height="14px" />
        <Skeleton width="60px" height="10px" style={{ marginTop: '6px' }} />
      </div>
    </div>
  );
}