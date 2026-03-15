import styles from './PricingHero.module.css';
 
function PricingHero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Simple, clear pricing</h1>
      <p className={styles.subtitle}>
        No hidden fees. No lock-in.
        <br />
        Pay per lesson or save with a credit pack.
      </p>
    </div>
  );
}
 
export default PricingHero;