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

  const menuItems = [
    { icon: <FiHome className={styles.icon} />, text: "Dashboard", path: '/admin' },
    { icon: <FiUserCheck className={styles.icon} />, text: "Tour Guides", path: '/tourguidesadmin' },
    { icon: <FiUsers className={styles.icon} />, text: "Tourists", path: '/touristsadmin' },
    { icon: <FiShoppingBag className={styles.icon} />, text: "Sellers", path: '/sellersadmin' },
    { icon: <FiRadio className={styles.icon} />, text: "Advertisers", path: '/advertisersadmin' },
    { icon: <FiShield className={styles.icon} />, text: "Admins", path: '/adminlist' },
    { icon: <FiFlag className={styles.icon} />, text: "Tourism Governor", path: '/tourismgoverneradmin' },
    { icon: <FiBarChart2 className={styles.icon} />, text: "Sales Report", path: '/salesReport' }
  ];

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
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className={styles.menuItem} 
            onClick={() => navigate(item.path)}
            data-tooltip={item.text}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
