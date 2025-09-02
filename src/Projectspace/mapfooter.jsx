import React from 'react';
import styles from './mapfooter.module.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.glow}>CAMPUS NAVIGATOR</h2>
      <div className={styles.contact}>
        <p><FaEnvelope /> campusnavigator@aditya.edu.in</p>
        <p><FaPhone /> +91 98765 43210</p>
      </div>
      <p className={styles.copy}>© {new Date().getFullYear()} Aditya University</p>
    </footer>
  );
};

export default Footer;
