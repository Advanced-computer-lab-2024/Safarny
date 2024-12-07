import React, { useState } from 'react';
import styles from './PasswordRecovery.module.css';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';

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

  const renderStepIndicator = () => {
    return (
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${step === 'email' ? styles.active : ''} ${step === 'otp' || step === 'password' ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <span>Email</span>
        </div>
        <div className={`${styles.step} ${step === 'otp' ? styles.active : ''} ${step === 'password' ? styles.completed : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <span>Verify</span>
        </div>
        <div className={`${styles.step} ${step === 'password' ? styles.active : ''}`}>
          <div className={styles.stepNumber}>3</div>
          <span>Reset</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className="container">
        <div className={styles.recoveryCard}>
          <div className={styles.cardHeader}>
            <h2>Password Recovery</h2>
            <p style={{color: 'white'}}>Follow the steps to reset your password</p>
          </div>

          {renderStepIndicator()}

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-info'} ${styles.alertCustom}`}>
              {message}
            </div>
          )}

          <div className={styles.formContainer}>
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <div className={styles.inputWithIcon}>
                    <i className="fas fa-envelope"></i>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="form-control"
                    />
                  </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Recovery Code
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="otp">Verification Code</label>
                  <div className={styles.inputWithIcon}>
                    <i className="fas fa-key"></i>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="Enter the code sent to your email"
                      className="form-control"
                    />
                  </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                  <i className="fas fa-check-circle me-2"></i>
                  Verify Code
                </button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <div className={styles.inputWithIcon}>
                    <i className="fas fa-lock"></i>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter new password"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className={styles.inputWithIcon}>
                    <i className="fas fa-lock"></i>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm new password"
                      className="form-control"
                    />
                  </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                  <i className="fas fa-save me-2"></i>
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordRecovery;