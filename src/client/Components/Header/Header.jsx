import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '/src/client/Assets/Img/Logo.png';

const Header = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        header.classList.add('bg-light', 'bg-opacity-75');
      } else {
        header.classList.remove('bg-light', 'bg-opacity-75');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="navbar navbar-light fixed-top">
      <div className="container-fluid">
        <div
          className="navbar-brand d-flex align-items-center"
          role="button"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={Logo}
            alt="Safarny Logo"
            height="50"
            className="me-2"
          />
          <span className='text-light'>Safarny</span>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleBackClick}
        >
          Back
        </button>
      </div>
    </nav>
  );
};

export default Header;
