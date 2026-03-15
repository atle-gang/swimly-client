import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PricingHero       from './components/PricingHero/PricingHero';
import ViewToggle        from './components/ViewToggle/ViewToggle';
import SingleLessonCard  from './components/SingleLessonCard/SingleLessonCard';
import PackList          from './components/PackList/PackList';
import PricingFooter     from './components/PricingFooter/PricingFooter';

import { SINGLE_LESSON, CREDIT_PACKS, PRICING_VIEWS } from './pricingData';
import styles from './PricingPage.module.css';

function PricingPage() {
  const navigate = useNavigate();

  const [activeView, setActiveView]       = useState('single');
  // Default selection to the featured pack so the footer CTA is always meaningful
  const [selectedPackId, setSelectedPackId] = useState(
    CREDIT_PACKS.find((p) => p.featured)?.id ?? null
  );

  function handlePrimaryAction() {
    // Placeholder — wire to payment flow in a later sprint
    if (activeView === 'single') {
      alert('Redirecting to single lesson booking…');
      navigate('/booking');
    } else {
      alert(`Purchasing ${selectedPackId} pack — payment flow coming soon!`);
    }
  }

  function handleSecondaryAction() {
    // Toggle to the other view when the secondary button is pressed
    setActiveView((v) => (v === 'single' ? 'packs' : 'single'));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Pricing</h1>
      </header>

      <main className={styles.content}>
        <PricingHero />

        <ViewToggle
          options={PRICING_VIEWS}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Conditionally render the active view */}
        {activeView === 'single' ? (
          <div className={styles.section}>
            <SingleLessonCard
              lesson={SINGLE_LESSON}
            />
          </div>
        ) : (
          <PackList
            packs={CREDIT_PACKS}
            selectedPackId={selectedPackId}
            onPackSelect={setSelectedPackId}
          />
        )}

        <div className={styles.footerSpacer} />
      </main>

      <PricingFooter
        activeView={activeView}
        selectedPackId={selectedPackId}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={handleSecondaryAction}
      />
    </div>
  );
}

export default PricingPage;