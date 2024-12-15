import React, { useState, useEffect, useRef } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const introRef = useRef(null);
  const featuresRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [fontSize, setFontSize] = useState(1);

  const toggleMenu = () => {
    setIsMenuAnimating(true);
    setMenuOpen(!menuOpen);
    setTimeout(() => setIsMenuAnimating(false), 300);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const LoadingSpinner = () => (
    <div className={styles.loadingContainer}>
      {/* Hero Section Skeleton */}
      <div className={styles.skeletonHero}>
        <div className={styles.skeletonHeading}></div>
        <div className={styles.skeletonSubheading}></div>
        <div className={styles.skeletonButtons}>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className={styles.skeletonFeatures}>
        <div className={styles.skeletonGrid}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonText}></div>
        <div className={styles.skeletonText} style={{ width: '60%' }}></div>
      </div>
    </div>
  );

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const SearchOverlay = () => {
    const searchResults = [
      { icon: 'fas fa-compass', title: 'Upcoming Activities', link: '/UpcomingActivites' },
      { icon: 'fas fa-landmark', title: 'Historical Places', link: '/historical-places' },
      { icon: 'fas fa-map', title: 'Upcoming Itineraries', link: '/UpcomingItineraries' },
      { icon: 'fas fa-sign-in-alt', title: 'Sign In', link: '/signin' },
      { icon: 'fas fa-user', title: 'Sign Up as Tourist', link: '/signup' },
      { icon: 'fas fa-briefcase', title: 'Sign Up as Business', link: '/signupextra' },
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInputChange = (e) => {
      setSearchQuery(e.target.value);
      searchInputRef.current?.focus();
    };

    return (
      <div 
        className={`${styles.searchOverlay} ${isSearchOpen ? styles.searchOpen : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchHeader}>
            <div className={styles.searchInputWrapper}>
              <i className="fas fa-search"></i>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search... (Press 'Esc' to close)"
                value={searchQuery}
                onChange={handleInputChange}
                className={styles.searchInput}
              />
            </div>
            <button 
              className={styles.closeSearch}
              onClick={() => setIsSearchOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className={styles.searchResults}>
            {searchResults.map((result, index) => (
              <Link
                key={index}
                to={result.link}
                className={styles.searchResult}
                onClick={() => setIsSearchOpen(false)}
              >
                <i className={result.icon}></i>
                <span>{result.title}</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            ))}
          </div>

          <div className={styles.searchTip}>
            <span>Press <kbd>/</kbd> to search, <kbd>Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    );
  };

  const TextSizeControl = () => (
    <div className={styles.textSizeControl}>
      <button 
        onClick={() => setFontSize(prev => Math.max(0.8, prev - 0.1))}
        className={styles.textSizeButton}
        aria-label="Decrease text size"
      >
        <span className={styles.sizeText}>a</span>
      </button>
      <button 
        onClick={() => setFontSize(1)}
        className={styles.textSizeButton}
        aria-label="Reset text size"
      >
        <span className={styles.sizeText}>Aa</span>
      </button>
      <button 
        onClick={() => setFontSize(prev => Math.min(1.3, prev + 0.1))}
        className={styles.textSizeButton}
        aria-label="Increase text size"
      >
        <span className={styles.sizeText}>A</span>
      </button>
    </div>
  );

  return (
    <>
      <div 
        className={styles.progressBar}
        style={{ width: `${scrollProgress}%` }}
      />
      <SearchOverlay />
      <TextSizeControl />
      <header className={`${styles.header} fixed-top`}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <img src={Logo} alt="Safarny Logo" className={styles.logo} />
            <h1 className={styles.title}>Safarny</h1>
          </div>
          
          <button 
            className={`${styles.burgerMenu} ${menuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>

          {menuOpen && (
            <div 
              className={styles.menuOverlay} 
              onClick={toggleMenu}
            />
          )}

          <div className={`${styles.nav} ${menuOpen ? styles.navOpen : ''} ${isMenuAnimating ? styles.animating : ''}`}>
            <Link to="/GuidePageGuest" className={styles.button}>Guide Page</Link>
            <Link to="/signin" className={styles.button}>Sign In</Link>
            
            <div className={styles.dropdown}>
              <button 
                className={`${styles.button} ${styles.dropdownToggle}`}
                onClick={toggleDropdown}
              >
                Sign Up Options <i className="fas fa-caret-down ms-2"></i>
              </button>
              <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.show : ''}`}>
                <Link to="/signup" className={styles.dropdownItem}>
                  <i className="fas fa-user me-2"></i>
                  Sign Up as Tourist
                </Link>
                <Link to="/signupextra" className={styles.dropdownItem}>
                  <i className="fas fa-briefcase me-2"></i>
                  Sign Up as Business
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.sideNav}>
        <button 
          onClick={() => scrollToSection(introRef)}
          className={styles.sideNavButton}
          aria-label="Scroll to Home"
        >
          <div className={styles.navCircle}>
            <span className={styles.navIcon}>
              <i className="fas fa-home"></i>
            </span>
            <span className={styles.navLabel}>Home</span>
          </div>
        </button>
        <button 
          onClick={() => scrollToSection(featuresRef)}
          className={styles.sideNavButton}
          aria-label="Scroll to Features"
        >
          <div className={styles.navCircle}>
            <span className={styles.navIcon}>
              <i className="fas fa-compass"></i>
            </span>
            <span className={styles.navLabel}>Explore</span>
          </div>
        </button>
      </div>

      <div 
        className={styles.container}
        style={{ 
          '--font-size-multiplier': fontSize 
        }}
      >
        <main className="container py-5">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <section 
                ref={introRef}
                className={`${styles.intro} text-center min-vh-100 d-flex align-items-center justify-content-center`}
              >
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

              <section 
                ref={featuresRef}
                className={`${styles.features} py-5`}
              >
                <div className="row g-4">
                  {isLoading ? (
                    <>
                      <div className="col-md-4"><SkeletonCard /></div>
                      <div className="col-md-4"><SkeletonCard /></div>
                      <div className="col-md-4"><SkeletonCard /></div>
                    </>
                  ) : (
                    [
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
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
