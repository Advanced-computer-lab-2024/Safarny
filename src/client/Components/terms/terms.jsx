import React from 'react';
import styles from './terms.module.css';
import Footer from '/src/client/Components/Footer/Footer';
import Header from '../Header/Header';

const Terms = () => {
    return (
        <div className={styles.container}>
            <h2>Terms and Conditions</h2>
            <p>Please read the following terms and conditions carefully:</p>
            <ul>
                <li>Your use of this site signifies your acceptance of our terms.</li>
                <li>Personal information you provide will be treated as per our privacy policy.</li>
                <li>Unauthorized access or misuse of our services is strictly prohibited.</li>
                <li>We reserve the right to modify these terms at any time without notice.</li>
            </ul>
            <p>Thank you for using our platform responsibly.</p>
        </div>
    );
};

export default Terms;