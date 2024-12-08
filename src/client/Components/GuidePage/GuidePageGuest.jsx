import React from 'react';
import styles from "./GuidePageGuest.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/Sign up.png';
import photo1 from '/src/client/Assets/Img/Home.png';
import sign1 from '/src/client/Assets/Img/Click sign up.png';
import sign2 from '/src/client/Assets/Img/Click sign up options.png';

const GuidePage  = () => {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Steps to enjoy the trip</h1>
                <p className={styles.subtitle}>Please read the following steps carefully to get started</p>

                <ul className={styles.instructionList}>
                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>1</span>
                            <h3 className={styles.stepTitle}>Sign Up</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on the Sign Up button to begin your journey with us by clicking on the Sign Up Options button then Sign Up as Tourist
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={sign2}
                                alt="Sign up process"
                                className={styles.stepImage}
                            />
                            <img
                                src={sign1}
                                alt="Sign up process"
                                className={styles.stepImage}
                            />
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>2</span>
                            <h3 className={styles.stepTitle}>Fill Required Information</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Complete all the required fields as shown below:
                        </p>
                        <div className={styles.imageContainer}>
                            <img
                                src={photo}
                                alt="Registration form"
                                className={styles.stepImage}
                            />
                        </div>
                        <div className={styles.tip}>
                            💡 Tip: Make sure to use a valid email address for account verification.
                        </div>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>3</span>
                            <h3 className={styles.stepTitle}>Terms and Conditions</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Read our terms and conditions carefully before proceeding
                        </p>
                    </li>

                    <li className={styles.instructionItem}>
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>4</span>
                            <h3 className={styles.stepTitle}>Complete Registration</h3>
                        </div>
                        <p className={styles.stepContent}>
                            Click on the Sign Up button to complete your registration
                        </p>
                        <div className={styles.tip}>
                            💡 Tip: You'll receive a confirmation email after successful registration.
                        </div>
                    </li>
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage ;