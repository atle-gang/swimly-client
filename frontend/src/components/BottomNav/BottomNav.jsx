import { NavLink } from 'react-router-dom';
import { CalendarDays, CreditCard, User } from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { to: '/booking', label: 'Book',    Icon: CalendarDays },
  { to: '/pricing', label: 'Pricing', Icon: CreditCard   },
  { to: '/profile', label: 'Profile', Icon: User         },
];

function BottomNav() {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={22} strokeWidth={1.8} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;