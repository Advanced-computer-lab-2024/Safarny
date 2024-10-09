import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Logo from '/src/client/Assets/Img/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(`.${styles.header}`);
      if (window.scrollY > 50) {
        header.classList.add(styles.translucent);
      } else {
        header.classList.remove(styles.translucent);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={styles.header}>
      <img src={Logo} alt="Safarny Logo" className={styles.logo} />
      <h1>Safarny</h1>
      <button className={styles.burger} onClick={toggleMenu}>
        <span className={styles.burgerIcon}>&#9776;</span>
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <button onClick={handleBackClick} className={styles.button}>Back</button>
        <Link to="/" className={styles.button}>Homepage</Link>
      </nav>
    </header>
  );
};

export default Header;
