import { useState, useMemo } from 'react';

import ChildSelector from './components/ChildSelector/ChildSelector';
import FilterStrip    from './components/FilterStrip/FilterStrip';
import DaySelector    from './components/DaySelector/DaySelector';
import SlotList       from './components/SlotList/SlotList';
import BookingFooter  from './components/BookingFooter/BookingFooter';

import {
  MOCK_CHILD,
  MOCK_SLOTS,
  TIME_FILTERS,
  generateWeekDays,
} from '../../data/bookingData';

import { filterSlots } from '../../utils/bookingUtils';
import styles from './BookingPage.module.css';

// Generate once — days are based on today's date and won't change mid-session
const WEEK_DAYS = generateWeekDays();

function BookingPage() {
  const [selectedDay, setSelectedDay]       = useState(0);
  const [activeFilter, setActiveFilter]     = useState('all');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // useMemo avoids re-filtering on every render when unrelated state changes
  const visibleSlots = useMemo(
    () => filterSlots(MOCK_SLOTS, activeFilter, selectedDay),
    [activeFilter, selectedDay]
  );

  const selectedSlot = useMemo(
    () => MOCK_SLOTS.find((s) => s.id === selectedSlotId) ?? null,
    [selectedSlotId]
  );

  // ── Handlers ───────────────────────────────────────────
  function handleDayChange(dayIndex) {
    setSelectedDay(dayIndex);
    // Clear selection when the day changes to avoid confusion
    setSelectedSlotId(null);
  }

  function handleFilterChange(filterId) {
    setActiveFilter(filterId);
    setSelectedSlotId(null);
  }

  function handleSlotSelect(slotId) {
    // Toggle off if the same slot is tapped again
    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  }

  function handleConfirm() {
    // Placeholder — will navigate to payment page in a later sprint
    alert(`Booking confirmed for slot ${selectedSlotId}! Payment flow coming soon.`);
  }

  // ── Render ────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Page header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Book a Class</h1>
      </header>

      {/* Scrollable content area */}
      <main className={styles.content}>

        {/* Child context strip */}
        <ChildSelector child={MOCK_CHILD} />

        {/* Time-of-day filter pills */}
        <FilterStrip
          filters={TIME_FILTERS}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Day selection strip */}
        <DaySelector
          days={WEEK_DAYS}
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
        />

        {/* Slot cards */}
        <SlotList
          slots={visibleSlots}
          sectionTitle={WEEK_DAYS[selectedDay]?.fullLabel ?? ''}
          selectedSlotId={selectedSlotId}
          onSlotSelect={handleSlotSelect}
        />

        <div className={styles.footerSpacer} />
      </main>

      {/* Sticky confirm footer — only renders when a slot is selected */}
      <BookingFooter
        selectedSlot={selectedSlot}
        child={MOCK_CHILD}
        dayLabel={WEEK_DAYS[selectedDay]?.fullLabel ?? ''}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

export default BookingPage;