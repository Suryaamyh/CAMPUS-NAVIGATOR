import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaBars, FaTimes, FaArrowUp } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './maphead.module.css';

const Maphead = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const location = useLocation(); // Get current path

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setShowScrollBtn(window.scrollY > 150);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => location.pathname === path ? styles.active : '';

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="logo.jpeg" alt="Logo" />
          <h4>
            ADITYA <FaMapMarkedAlt className={styles.mapIcon} /> UNIVERSITY
          </h4>
        </div>

        <div className={styles.menuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {isMobile ? (
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={styles.mobileMenu}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <ul className={styles.mobileOpt}>
                  <li className={styles.optItem}>
                    <Link to="/home" onClick={closeMenu} className={isActive('/home')}>Home</Link>
                  </li>
                  <li className={styles.optItem}>
                    <Link to="/findmap" onClick={closeMenu} className={isActive('/findmap')}>Find Map</Link>
                  </li>
                  <li className={styles.optItem}>
                    <Link to="/places" onClick={closeMenu} className={isActive('/Places')}>Places</Link>
                  </li>
                  <li className={styles.optItem}>
                    <Link to="/contact" onClick={closeMenu} className={isActive('/contact')}>Contact</Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className={styles.desktopMenu}>
            <ul className={styles.desktopOpt}>
              <li className={styles.optItem}>
                <Link to="/home" onClick={scrollToTop} className={isActive('/home')}>Home</Link>
              </li>
              <li className={styles.optItem}>
                <Link to="/findmap" onClick={scrollToTop} className={isActive('/findmap')}>Find Route</Link>
              </li>
              <li className={styles.optItem}>
                <Link to="/places" onClick={scrollToTop} className={isActive('/places')}>Places</Link>
              </li>
              <li className={styles.optItem}>
                <Link to="/contact" onClick={scrollToTop} className={isActive('/contact')}>Admin</Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showScrollBtn && (
        <button className={styles.scrollToTopBtn} onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Maphead;
