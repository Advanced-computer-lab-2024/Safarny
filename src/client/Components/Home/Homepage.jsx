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
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const descriptions = [
    "Plan your trips with personalized recommendations.",
    "Book flights, hotels, and more seamlessly.",
    "Manage your travel budget smartly.",
    "Discover hidden gems and local attractions.",
    "Get real-time updates and notifications.",
    "Follow detailed itineraries from expert guides.",
    "Shop for exclusive travel-related items."
  ];

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
    <div className={styles.container}>
      <header className={styles.header}>
      <img src={Logo} alt="Safarny Logo" className={styles.logo} />
        <h1>Safarny</h1>
        <nav className={styles.nav}>
          <div className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
            <Link to="/signin" className={styles.button}>Sign In</Link>
            <Link to="/signup" className={styles.button}>Sign Up</Link>
            <Link to="/signupextra" className={styles.button}>Sign Up Extra</Link>
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Plan Your Perfect Trip</h1>
          <h5>Our all-in-one travel platform is designed to make your vacation planning effortless and exciting!</h5>
        </section>
        <section className={styles.features}>
          {[image1, image2, image3, image4, image5, image6, image7].map((image, index) => (
            <div
              key={index}
              className={`${styles.card} ${expandedCard === index ? styles.expandedCard : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className={styles.cardImage}>
                <img src={image} alt={`Feature ${index + 1}`} />
              </div>
              <p>{[
                "Personalized Travel Planning",
                "Seamless Booking",
                "Smart Budgeting",
                "Discover Local Gems",
                "Real-Time Notifications",
                "Tour Guides Itineraries",
                "Exclusive Gift Shop"
              ][index]}</p>
              {expandedCard === index && (
                <div className={styles.description}>
                  <p>{descriptions[index]}</p>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
