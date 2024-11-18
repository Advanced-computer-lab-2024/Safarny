import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';
import image1 from '/src/client/Assets/Img/image1.jpg';
import image2 from '/src/client/Assets/Img/image2.jpg';
import image3 from '/src/client/Assets/Img/image3.jpg';
import image4 from '/src/client/Assets/Img/image4.jpg';
import image5 from '/src/client/Assets/Img/image5.jpg';
import image6 from '/src/client/Assets/Img/image6.jpg';
import image7 from '/src/client/Assets/Img/image7.jpg';
import Logo from '/src/client/Assets/Img/logo.png';
import Footer from '/src/client/components/Footer/Footer';

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>Safarny</h1>
          <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        </div>
        <button className={styles.burgerMenu} onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/signin" className={styles.button}>Sign In</Link>
          <Link to="/signup" className={styles.button}>Sign Up</Link>
          <Link to="/signupextra" className={styles.button}>Sign Up Extra</Link>
          <Link to="/UpcomingActivites" className={styles.button}>Upcoming Activities</Link>
          <Link to="/historical-places" className={styles.button}>Upcoming Historical Places</Link>
          <Link to="/UpcomingItineraries" className={styles.button}>Upcoming Itineraries</Link>
        </nav>
      </header>
      <div className={styles.container}>
        <main className={styles.main}>
          <section className={styles.intro}>
            <h1 className={styles.mainHeading}>Plan Your Perfect Trip</h1>
            <h5 className={styles.subHeading}>Our all-in-one travel platform is designed to make your vacation planning effortless and exciting!</h5>
          </section>
          <section className={styles.features}>
            {[image1, image2, image3, image4, image5, image6, image7].map((image, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={image} alt={`Feature ${index + 1}`} className={styles.image} />
                </div>
                <p className={styles.cardTitle}>
                  {[
                    "Personalized Travel Planning",
                    "Seamless Booking",
                    "Smart Budgeting",
                    "Discover Local Gems",
                    "Real-Time Notifications",
                    "Tour Guides Itineraries",
                    "Exclusive Gift Shop",
                  ][index]}
                </p>
              </div>

            ))}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
