import { useState, useMemo, useEffect } from 'react';

import ChildSelector from './components/ChildSelector/ChildSelector';
import FilterStrip   from './components/FilterStrip/FilterStrip';
import DaySelector   from './components/DaySelector/DaySelector';
import SlotList      from './components/SlotList/SlotList';
import BookingFooter from './components/BookingFooter/BookingFooter';

import { TIME_FILTERS, generateWeekDays } from '../../data/bookingData';
import { filterSlots } from '../../utils/bookingUtils';
import { getChildren } from '../../services/childService';
import { getLessons  } from '../../services/lessonService';
import { createBooking } from '../../services/bookingService';

import styles from './BookingPage.module.css';

const WEEK_DAYS = generateWeekDays();

function BookingPage() {
  // ── State ──────────────────────────────────────────────
  const [selectedDay,    setSelectedDay]    = useState(0);
  const [activeFilter,   setActiveFilter]   = useState('all');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [child,        setChild]        = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [isBooking,    setIsBooking]    = useState(false);

  // ── Load child and lessons when selected day changes ──
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        // Load the user's first child profile
        // Later this becomes a child selector when multiple children are supported
        const { children } = await getChildren();
        if (children.length > 0) {
          const c = children[0];
          setChild({
            id:            c.child_id,
            name:          c.name,
            ageGroup:      c.experience_level,
            ageGroupRange: '',
            dateOfBirth:   c.date_of_birth,
          });
        }

        // Build ISO date string for the selected day
        const date = new Date();
        date.setDate(date.getDate() + selectedDay);
        const dateStr = date.toISOString().split('T')[0];

        const { slots: fetchedSlots } = await getLessons({ date: dateStr });

        // Map backend response to the shape the slot components expect
        setSlots(
          fetchedSlots.map((s) => ({ ...s, dayIndex: selectedDay }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedDay]);

  // ── Derived data ───────────────────────────────────────
  const visibleSlots = useMemo(
    () => filterSlots(slots, activeFilter, selectedDay),
    [slots, activeFilter, selectedDay]
  );

  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId]
  );

  // ── Handlers ───────────────────────────────────────────
  function handleDayChange(dayIndex) {
    setSelectedDay(dayIndex);
    setSelectedSlotId(null);
  }

  function handleFilterChange(filterId) {
    setActiveFilter(filterId);
    setSelectedSlotId(null);
  }

  function handleSlotSelect(slotId) {
    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
    setBookingError(null);
  }

  async function handleConfirm() {
    if (!selectedSlot || !child) return;
    setIsBooking(true);
    setBookingError(null);

    try {
      await createBooking({ childId: child.id, lessonId: selectedSlot.id });
      alert('Lesson booked successfully!');
      setSelectedSlotId(null);
    } catch (err) {
      // Show error inline so the user does not lose their selection
      setBookingError(err.message);
    } finally {
      setIsBooking(false);
    }
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Book a Class</h1>
      </header>

      <main className={styles.content}>

        {isLoading && (
          <div style={{ padding: '16px 20px', background: 'var(--color-navy)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Loading…</p>
          </div>
        )}

        {child && !isLoading && <ChildSelector child={child} />}

        {error && (
          <p style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--color-red)' }}>
            {error}
          </p>
        )}

        <FilterStrip
          filters={TIME_FILTERS}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <DaySelector
          days={WEEK_DAYS}
          selectedDay={selectedDay}
          onDayChange={handleDayChange}
        />

        <SlotList
          slots={visibleSlots}
          sectionTitle={WEEK_DAYS[selectedDay]?.fullLabel ?? ''}
          selectedSlotId={selectedSlotId}
          onSlotSelect={handleSlotSelect}
        />

        {bookingError && (
          <p style={{ padding: '8px 20px', fontSize: '13px', color: 'var(--color-red)', textAlign: 'center' }}>
            {bookingError}
          </p>
        )}

        <div className={styles.footerSpacer} />
      </main>

      <BookingFooter
        selectedSlot={selectedSlot}
        child={child}
        dayLabel={WEEK_DAYS[selectedDay]?.fullLabel ?? ''}
        onConfirm={handleConfirm}
        isLoading={isBooking}
      />
    </div>
  );
}

export default BookingPage;