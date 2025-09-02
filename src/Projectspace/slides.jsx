import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './slides.module.css';


const originalSlides = [
  { image: './campus.jpg' },
  { image: './cottonbhavan.jpg' }
];

const Slides = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slides, setSlides] = useState(originalSlides);

  // Detect mobile and reorder slides only on first render
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setSlides([
        { image: './cottonbhavan.jpg' },
        { image: './campus.jpg' },
         
      ]);
    }
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (i) => {
    if (i === index) return;
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  useEffect(() => {
    if (isHovered) return;
   const interval = setInterval(nextSlide, 4000); // changes every 2 seconds

    return () => clearInterval(interval);
  }, [index, isHovered]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.slideWrapper}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}

            className={styles.slide}
            style={{ backgroundImage: `url(${slides[index].image})` }}
          >
            <div className={styles.overlayIndicators}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`${styles.underscore} ${i === index ? styles.active : ''}`}
                >
                  _
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Slides;
