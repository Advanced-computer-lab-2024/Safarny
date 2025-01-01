import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from "./GuidePage.module.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import profile from '/src/client/Assets/Img/profile.png';
import Ranks from '/src/client/Assets/Img/Ranks.png';
// import Bar from '/src/client/Assets/Img/sidebar.png';
import act from '/src/client/Assets/Img/act.png';
import iti from '/src/client/Assets/Img/Iti2.png';
import places from '/src/client/Assets/Img/places2.png'; 
import open2 from '/src/client/Assets/Img/open2.png';
import create from '/src/client/Assets/Img/create2.png';
import view from '/src/client/Assets/Img/View2.png';
import products from '/src/client/Assets/Img/products2.png';
import orders from '/src/client/Assets/Img/orders.png';
import update from '/src/client/Assets/Img/Update2.png';
import flight from '/src/client/Assets/Img/flight2.png';
import hotel from '/src/client/Assets/Img/hotel2.png';
import trans from '/src/client/Assets/Img/trans2.png';
import book from '/src/client/Assets/Img/mybooks2.png';
import open from '/src/client/Assets/Img/open.png';
import open3 from '/src/client/Assets/Img/open3.png';
import open4 from '/src/client/Assets/Img/open4.png';
import pref from '/src/client/Assets/Img/pref.png';
import search from '/src/client/Assets/Img/Search2.png';
import Notifications from '/src/client/Assets/Img/notifications.png';
import cart from '/src/client/Assets/Img/Cart.png';
import purchased from '/src/client/Assets/Img/puchased.png';
import proceed1 from '/src/client/Assets/Img/proceed1.png';
import proceed2 from '/src/client/Assets/Img/proceed2.png';
import proceed3 from '/src/client/Assets/Img/proceed3.png';
import proceed4 from '/src/client/Assets/Img/proceed4.png';

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

    const scrollToStep = (stepNumber) => {
        const element = document.getElementById(`step-${stepNumber}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveStep(stepNumber);
        }
    };

    const steps = [
        {
            number: 1,
            title: "Getting Started",
            content: "All of your credentials and important information are displayed on this page for easy access:",
            images: [profile],
            tip: "Keep your credentials handy for quick reference throughout your journey."
        },
        {
            number: 2,
            title: "Navigation Guide",
            content: "Familiarize yourself with these essential navigation buttons in the side bar:",
            images: [open],
            tip: null
        },
        {
            number: 3,
            title: "Shop",
            content: "Click on Shop. Here you can check all of the products:",
            images: [products],
            tip: null,
            extraContent: [
                {
                    text: "Click on Purchased Products. Here you can check all of your purchased products:",
                    images: [purchased]
                },
                {
                    text: "Click on Cart from the Shop. Here you can check your cart:",
                    images: [cart]
                },
                {
                    text: "Click on Proceed to Checkout. Here you can buy the products from your cart:",
                    images: [proceed1, proceed2, proceed3, proceed4]
                }
            ]
        },
        {
            number: 4,
            title: "Notifications",
            content: "Click on Notifications. Here you can check all your received notifications:",
            images: [Notifications],
            tip: null
        },
        {
            number: 5,
            title: "Search",
            content: "Click on Search. Here you can search by certain category:",
            images: [search],
            tip: null
        },
        {
            number: 6,
            title: "Update Profile",
            content: "Click on Update Profile. Here you can edit your credentials however you want:",
            images: [update],
            tip: null
        },
        {
            number: 7,
            title: "Upcoming Activities",
            content: "Click on upcoming Events button then click on Activities:",
            images: [open2, act],
            tip: "Check this section regularly for updates to your scheduled activities."
        },
        {
            number: 8,
            title: "Upcoming Itineraries",
            content: "Click on upcoming Events button as seen in Upcoming Activities and choose Itineraries. Here you can see all of your upcoming Itineraries:",
            images: [iti],
            tip: "Check this section regularly for any updates to your scheduled itineraries."
        },
        {
            number: 9,
            title: "Upcoming Historical Places",
            content: "Click on upcoming Events button as seen in Upcoming Activities and choose Historical Places. Here you can see all of your upcoming historical places:",
            images: [places],
            tip: "Check this section regularly for any updates to your scheduled historical places."
        },
        {
            number: 10,
            title: "Create Complaints",
            content: "Click on Complaints button then click on create complaints:",
            images: [open3, create],
            tip: null
        },
        {
            number: 11,
            title: "View Complaints",
            content: "Click on Complaints button as seen in Create Complaints and choose View Complaints. Here you can see all of your complaints:",
            images: [view],
            tip: null
        },
        {
            number: 12,
            title: "Book Flight",
            content: "Click on Bookings and Services button then click on Book Flight. Here you can book all your flights:",
            images: [open4, flight],
            tip: null
        },
        {
            number: 13,
            title: "Book Hotel",
            content: "Click on Bookings and services button as seen in Book Flight and choose Book Hotels. Here you can book in the hotel that you want:",
            images: [hotel],
            tip: null
        },
        {
            number: 14,
            title: "Book Transport",
            content: "Click on Bookings and services button as seen in Book Flight and choose Book Transport. Here you can book the means of transport that you want:",
            images: [trans],
            tip: null
        },
        {
            number: 15,
            title: "My Bookings",
            content: "Click on Bookings and services button as seen in Book Flight and choose My Bookings. Here you can view all of your bookings:",
            images: [book],
            tip: null
        },
        {
            number: 16,
            title: "My Orders",
            content: "Click on Bookings and services button as seen in Book Flight and choose My Orders. Here you can view all of your orders:",
            images: [orders],
            tip: null
        },
        {
            number: 17,
            title: "My Preferences",
            content: "Click on Bookings and services button as seen in Book Flight and choose My Preferences. Here you can select your preferences:",
            images: [pref],
            tip: null
        },
        {
            number: 18,
            title: "Loyalty Badges",
            content: "Here are the Loyalty Badges and what they mean: Level 1 is Lowest after spending than 100,000 points, Level 2 is followed after spending 500,000 points and Level 3 is highest after spending more than 500,000 points",
            images: [Ranks],
            tip: null
        }
    ];

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
                    <h1 className={styles.title}>Welcome to Your Travel Guide</h1>
                    <p className={styles.subtitle}>Follow these simple steps to make the most of your journey</p>
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
                            <p className={styles.stepContent}>{step.content}</p>
                            {step.images && step.images.length > 0 && (
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
                            {step.extraContent && step.extraContent.map((extra, index) => (
                                <div key={index}>
                                    <p className={styles.stepContent}>{extra.text}</p>
                                    {extra.images && (
                                        <motion.div 
                                            className={styles.imageContainer}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {extra.images.map((img, imgIndex) => (
                                                <img
                                                    key={imgIndex}
                                                    src={img}
                                                    alt={`Additional illustration ${imgIndex + 1}`}
                                                    className={styles.stepImage}
                                                    loading="lazy"
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
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