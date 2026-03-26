import BottomNav from '../BottomNav/BottomNav';
import styles from './AppLayout.module.css';
 
function AppLayout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
 
export default AppLayout;
