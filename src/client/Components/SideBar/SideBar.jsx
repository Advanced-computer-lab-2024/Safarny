import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiMenu,
  FiHome,
  FiUsers,
  FiUserCheck,
  FiShoppingBag,
  FiRadio,
  FiShield,
  FiFlag,
  FiBarChart2
} from 'react-icons/fi';
import styles from './SideBar.module.css';

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <button 
          className={styles.menuBtn} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <FiMenu size={24} />
        </button>
        <span className={styles.title}>Safarny Admin</span>
      </div>

      <div className={styles.menuItems}>
        <button className={styles.menuItem} onClick={() => navigate('/admin')}>
          <FiHome className={styles.icon} />
          <span>Dashboard</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/tourguidesadmin')}>
          <FiUserCheck className={styles.icon} />
          <span>Tour Guides</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/touristsadmin')}>
          <FiUsers className={styles.icon} />
          <span>Tourists</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/sellersadmin')}>
          <FiShoppingBag className={styles.icon} />
          <span>Sellers</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/advertisersadmin')}>
          <FiRadio className={styles.icon} />
          <span>Advertisers</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/adminlist')}>
          <FiShield className={styles.icon} />
          <span>Admins</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/tourismgoverneradmin')}>
          <FiFlag className={styles.icon} />
          <span>Tourism Governor</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/salesReport')}>
          <FiBarChart2 className={styles.icon} />
          <span>Sales Report</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
