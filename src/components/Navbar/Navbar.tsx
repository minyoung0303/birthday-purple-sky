import styles from './Navbar.module.css';
import type { NavSection } from '../../types';

interface NavItem {
  key: NavSection;
  label: string;
}

interface NavbarProps {
  activeSection: NavSection;
  navItems: readonly NavItem[];
  onNavigate: (section: NavSection) => void;
}

function Navbar({ activeSection, navItems, onNavigate }: NavbarProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>우리 대장 생일 축하</div>
        <div className={styles.menu}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.link} ${
                activeSection === item.key ? styles.active : ''
              }`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;