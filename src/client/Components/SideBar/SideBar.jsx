// import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './SideBar.module.css';

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? '←' : '→'}
      </div>
      {isOpen && (
        <div className={styles.buttonsContainer}>
          <button className={styles.button} onClick={() => navigate('/admin')}>
            HomePage
          </button>
          <button className={styles.button} onClick={() => navigate('/tourguidesadmin')}>
            Tour Guides
          </button>
          <button className={styles.button} onClick={() => navigate('/touristsadmin')}>
            Tourists
          </button>
          <button className={styles.button} onClick={() => navigate('/sellersadmin')}>
            Sellers
          </button>
          <button className={styles.button} onClick={() => navigate('/advertisersadmin')}>
            Advertisers
          </button>
          <button className={styles.button} onClick={() => navigate('/adminlist')}>
            Admins
          </button>
          <button className={styles.button} onClick={() => navigate('/tourismgoverneradmin')}>
            Tourism Governor
          </button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
