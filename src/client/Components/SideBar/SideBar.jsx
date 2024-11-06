import { Button } from '@mui/material';
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
          <Button className={styles.button} onClick={() => navigate('/admin')}>
            HomePage
          </Button>
          <Button className={styles.button} onClick={() => navigate('/tourguidesadmin')}>
            Tour Guides
          </Button>
          <Button className={styles.button} onClick={() => navigate('/touristsadmin')}>
            Tourists
          </Button>
          <Button className={styles.button} onClick={() => navigate('/sellersadmin')}>
            Sellers
          </Button>
          <Button className={styles.button} onClick={() => navigate('/advertisersadmin')}>
            Advertisers
          </Button>
          <Button className={styles.button} onClick={() => navigate('/adminlist')}>
            Admins
          </Button>
          <Button className={styles.button} onClick={() => navigate('/tourismgoverneradmin')}>
            Tourism Governor
          </Button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
