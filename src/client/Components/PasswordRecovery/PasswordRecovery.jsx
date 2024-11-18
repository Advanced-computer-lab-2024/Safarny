import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './PasswordRecovery.module.css';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRecoverPassword = (e) => {
    e.preventDefault();

    // Simulating OTP message
    setMessage('An OTP has been sent to this email, please check your email.');
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Password Recovery</h2>

        {/* Show message if OTP is sent */}
        {message && <p className={styles.successMessage}>{message}</p>}

        <form onSubmit={handleRecoverPassword} className={styles.form}>
          <label className={styles.label}>
            Enter Your Email:
            <input
              className={styles.input}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={styles.button}>
            Recover Password
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default PasswordRecovery;
