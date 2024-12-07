import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Homepage.module.css';
import image1 from '/src/client/Assets/Img/image1.jpg';
import image2 from '/src/client/Assets/Img/image2.jpg';
import image3 from '/src/client/Assets/Img/image3.jpg';
import image4 from '/src/client/Assets/Img/image4.jpg';
import image5 from '/src/client/Assets/Img/image5.jpg';
import image6 from '/src/client/Assets/Img/image6.jpg';
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
      <header className={`${styles.header} fixed-top`}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <img src={Logo} alt="Safarny Logo" className={styles.logo} />
            <h1 className={styles.title}>Safarny</h1>
          </div>
          
          <button 
            className={styles.burgerMenu}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            ☰
          </button>

          <div className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link to="/signin" className={styles.button}>Sign In</Link>
            <Link to="/signup" className={styles.button}>Sign Up</Link>
            <Link to="/signupextra" className={styles.button}>Sign Up Extra</Link>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <main className="container py-5">
          <section className={`${styles.intro} text-center min-vh-100 d-flex align-items-center justify-content-center`}>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 className={`${styles.mainHeading} display-3 fw-bold mb-4 animate__animated animate__fadeIn`}>
                  Plan Your Perfect Trip
                </h1>
                <h5 className={`${styles.subHeading} lead mb-5 animate__animated animate__fadeIn animate__delay-1s`}>
                  Our all-in-one travel platform is designed to make your vacation planning effortless and exciting!
                </h5>
              </div>
            </div>
          </section>

          <section className="py-5">
            <div className="row g-4">
              {[
                { image: image4, title: "Upcoming Activities", link: "/UpcomingActivites" },
                { image: image5, title: "Historical Places", link: "/historical-places" },
                { image: image6, title: "Upcoming Itineraries", link: "/UpcomingItineraries" },
              ].map((feature, index) => (
                <div className="col-md-4" key={index}>
                  <Link 
                    to={feature.link} 
                    className={`${styles.card} text-decoration-none`}
                  >
                    <div className={styles.cardInner}>
                      <div className={styles.cardImage}>
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="img-fluid"
                        />
                      </div>
                      <div className={styles.cardOverlay}>
                        <h5 className={styles.cardTitle}>{feature.title}</h5>
                        <div className={styles.cardArrow}>→</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
