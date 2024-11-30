import React, { useState } from 'react';
import styles from './PasswordRecovery.module.css';

const PasswordRecovery = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStep('otp');
        setMessage('OTP sent to your email');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        setStep('password');
        setMessage('OTP verified successfully');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      if (response.ok) {
        setMessage('Password reset successfully');
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Password Recovery</h2>
        <p className={styles.description}>Reset your password in three easy steps</p>
        {message && <div className={styles.message}>{message}</div>}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>Send OTP</button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="otp" className={styles.label}>Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>Verify OTP</button>
          </form>
        )}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword" className={styles.label}>New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;

