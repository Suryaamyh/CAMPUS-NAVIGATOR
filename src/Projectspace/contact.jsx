import React from 'react';
import styles from './contact.module.css'; 

const Contact = () => {
  return (
    <div className={styles.contactSection}>
      <h2>Contact Form </h2>
      <div className={styles.contactContainer}>
        <form className={styles.contactForm}>
          <h3>Message Us</h3>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Enter Your Email..." required />
          <textarea rows="3" placeholder="Write Message Here..." required />
          <button type="submit">SEND</button>
        </form>

        <div className={styles.contactMap}>
          <iframe
            title="Campus Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.336905435426!2d82.0057!3d17.0906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a45b00000001%3A0x1111111111111111!2sKL%20Rao%20Bhavan%2C%20Billgates%20Bhavan%2C%20Cotton%20Bhavan%2C%20Abdul%20Kalam%20Bhavan!5e0!3m2!1sen!2sin!4v1717060000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;