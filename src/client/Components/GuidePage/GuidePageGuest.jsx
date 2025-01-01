import React, { useState, useEffect } from 'react';
import styles from "./GuidePageGuest.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import photo from '/src/client/Assets/Img/Sign up.png';
// import photo1 from '/src/client/Assets/Img/Home.png';
import sign1 from '/src/client/Assets/Img/Click sign up.png';
import sign2 from '/src/client/Assets/Img/Click sign up options.png';
import { motion } from 'framer-motion';

const GuidePage = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalScroll) * 100;
            setScrollProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            number: 1,
            title: "Sign Up",
            content: "Click on the Sign Up Options button in the top right corner then click on Sign Up as Tourist to begin your journey with us",
            images: [sign2, sign1],
            tip: null
        },
        {
            number: 2,
            title: "Fill Required Information",
            content: "Complete all the required fields as shown below:",
            images: [photo],
            tip: "Make sure to use a valid email address for account verification."
        },
        {
            number: 3,
            title: "Terms and Conditions",
            content: "Read our terms and conditions carefully before proceeding",
            images: [],
            tip: "Take your time to understand our policies and guidelines."
        },
        {
            number: 4,
            title: "Complete Registration",
            content: "Click on the Sign Up button to complete your registration",
            images: [],
            tip: "You'll receive a confirmation email after successful registration."
        }
    ];

    const scrollToStep = (stepNumber) => {
        const element = document.getElementById(`step-${stepNumber}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveStep(stepNumber);
        }
    };

    return (
        <div className={styles.container}>
            <div 
                className={styles.progressBar}
                style={{ width: `${scrollProgress}%` }}
            />
            <Header />
            <main className={styles.main}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className={styles.title}>Steps to enjoy the trip</h1>
                    <p className={styles.subtitle}>Please read the following steps carefully to get started</p>
                </motion.div>

                <div className={styles.stepsNavigation}>
                    {steps.map((step) => (
                        <button
                            key={step.number}
                            className={`${styles.stepDot} ${activeStep === step.number ? styles.active : ''}`}
                            onClick={() => scrollToStep(step.number)}
                        >
                            {step.number}
                        </button>
                    ))}
                </div>

                <ul className={styles.instructionList}>
                    {steps.map((step) => (
                        <motion.li
                            key={step.number}
                            id={`step-${step.number}`}
                            className={styles.instructionItem}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: step.number * 0.1 }}
                            viewport={{ once: true }}
                            onViewportEnter={() => setActiveStep(step.number)}
                        >
                            <div className={styles.stepHeader}>
                                <span className={styles.stepNumber}>{step.number}</span>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                            </div>
                            <p className={styles.stepContent}>
                                {step.content}
                            </p>
                            {step.images.length > 0 && (
                                <motion.div 
                                    className={styles.imageContainer}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {step.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Step ${step.number} illustration ${index + 1}`}
                                            className={styles.stepImage}
                                            loading="lazy"
                                        />
                                    ))}
                                </motion.div>
                            )}
                            {step.tip && (
                                <motion.div 
                                    className={styles.tip}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    💡 Tip: {step.tip}
                                </motion.div>
                            )}
                        </motion.li>
                    ))}
                </ul>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;