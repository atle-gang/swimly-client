import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LogOut, Plus, User, Baby, CalendarDays, X } from "lucide-react"
import { useAuth } from "../../context/useAuth"
import { getChildren } from "../../services/childService"
import { getBookings, cancelBooking } from "../../services/bookingService"
import styles from "./ProfilePage.module.css"

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [children, setChildren] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelling, setCancelling] = useState(null) // booking_id being cancelled

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      try {
        const [childRes, bookingRes] = await Promise.all([
          getChildren(),
          getBookings(),
        ])
        setChildren(childRes.children)
        // Only show confirmed upcoming bookings
        setBookings(bookingRes.bookings.filter((b) => b.status === "CONFIRMED"))
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  function handleLogout() {
    logout()
    navigate("/login")
  }

  async function handleCancelBooking(bookingId) {
    setCancelling(bookingId)
    try {
      await cancelBooking(bookingId)
      // Remove the cancelled booking from the list without refetching
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId))
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelling(null)
    }
  }

  function formatLessonDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Profile</h1>
      </header>

      <main className={styles.content}>
        {/* ── Account section ── */}
        <section className={styles.section}>
          <div className={styles.accountCard}>
            <div className={styles.avatarCircle}>
              <User size={24} strokeWidth={1.8} />
            </div>
            <div className={styles.accountInfo}>
              <p className={styles.accountName}>{user?.username ?? "Parent"}</p>
              <p className={styles.accountEmail}>{user?.email ?? ""}</p>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} strokeWidth={1.8} />
              <span>Log out</span>
            </button>
          </div>
        </section>

        {error && <p className={styles.errorMsg}>{error}</p>}

        {/* ── Children section ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>
              <Baby size={13} strokeWidth={2} />
              My Children
            </p>
            {/* Pass returnTo so intake form comes back to profile after submit */}
            <Link to="/intake?returnTo=/profile" className={styles.addBtn}>
              <Plus size={14} strokeWidth={2.5} />
              Add child
            </Link>
          </div>

          {isLoading ? (
            <p className={styles.emptyMsg}>Loading…</p>
          ) : children.length === 0 ? (
            <div className={styles.emptyCard}>
              <p className={styles.emptyMsg}>No child profiles yet.</p>
              <Link to="/intake?returnTo=/profile" className={styles.emptyLink}>
                Add your first child →
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {children.map((child) => {
                const dob = new Date(child.date_of_birth)
                const now = new Date()
                const months =
                  (now.getFullYear() - dob.getFullYear()) * 12 +
                  (now.getMonth() - dob.getMonth())
                const ageLabel =
                  months < 12
                    ? `${months} months`
                    : `${Math.floor(months / 12)} yr${Math.floor(months / 12) !== 1 ? "s" : ""}`

                return (
                  <div key={child.child_id} className={styles.childCard}>
                    <div className={styles.childAvatar}>
                      <Baby size={18} strokeWidth={1.8} />
                    </div>
                    <div className={styles.childInfo}>
                      <p className={styles.childName}>{child.name}</p>
                      <p className={styles.childMeta}>
                        {ageLabel} · {child.experience_level}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Bookings section ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>
              <CalendarDays size={13} strokeWidth={2} />
              Upcoming Bookings
            </p>
          </div>

          {isLoading ? (
            <p className={styles.emptyMsg}>Loading…</p>
          ) : bookings.length === 0 ? (
            <div className={styles.emptyCard}>
              <p className={styles.emptyMsg}>No upcoming bookings.</p>
              <Link to="/booking" className={styles.emptyLink}>
                Book a lesson →
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {bookings.map((booking) => (
                <div key={booking.booking_id} className={styles.bookingCard}>
                  <div className={styles.bookingTimeBlock}>
                    <span className={styles.bookingTime}>
                      {booking.lesson?.lesson_time}
                    </span>
                    <span className={styles.bookingDate}>
                      {formatLessonDate(booking.lesson?.lesson_date)}
                    </span>
                  </div>
                  <div className={styles.bookingInfo}>
                    <p className={styles.bookingClass}>
                      {booking.lesson?.class_name}
                    </p>
                    <p className={styles.bookingMeta}>
                      {booking.child?.name} · {booking.lesson?.instructor}
                    </p>
                  </div>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancelBooking(booking.booking_id)}
                    disabled={cancelling === booking.booking_id}
                    aria-label="Cancel booking"
                  >
                    {cancelling === booking.booking_id ? (
                      "…"
                    ) : (
                      <X size={16} strokeWidth={2} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={{ height: "24px" }} />
      </main>
    </div>
  )
}

export default ProfilePage
