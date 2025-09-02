import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentData } from './data.js';
import html2pdf from 'html2pdf.js';

import styles from './Findmap.module.css';

const Findmap = () => {
  const [hallticket, setHallticket] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState({ hallticket: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = hallticket.trim();
    if (!/^[A-Za-z0-9]{8,}$/.test(trimmed)) {
      setError('Hall ticket must be at least 8 characters long and contain only letters and numbers.');
      return;
    }
    setError('');
    setSubmittedData({ hallticket: trimmed });
    setSubmitted(true);
    setHallticket('');
  };

  const handleClose = () => setSubmitted(false);

  useEffect(() => {
    document.body.style.overflow = submitted ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [submitted]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.5,
      filename: `${result.hallticket}_info.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };


  const result = studentData.find(
    (student) => student.hallticket.toLowerCase() === submittedData.hallticket.toLowerCase()
  );

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {submitted && !error && (
          <div className={styles.blurOverlay}>
            <div className={styles.resultsCard} id="resultsCard">
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close result card"
              >
                ×
              </button>

              <h3 className={styles.cardTitle}>Exam Details</h3>

              {result ? (
                <>
                  <div style={{ display: 'none' }}>
                   
                    <div id="pdf-content" className={styles.pdfContent}>
                       <h2>Exam Details</h2>
                       <div className={styles.pdf}>
                      <div className={styles.pdfdetails}>
                        
                        <p><strong>HallTicket Number :</strong> {result.hallticket}</p>
                        <p><strong>Name :</strong> {result.name}</p>
                        <p><strong>Exam :</strong> {result.exam}</p>
                        <p><strong>Block :</strong> {result.block}</p>
                        <p><strong>Room Number :</strong> {result.room}</p>
                      </div>
                      <div className={styles.pdfphoto}> 
                        <img src={result.photoUrl} alt="Student" style={{ width: '150px' ,height:'150px' }} />
                      </div>
                      </div>

                    </div>

                  </div>

                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>HallTicket Number:</span>
                    <span className={styles.resultValue}>{result.hallticket}</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Name:</span>
                    <span className={styles.resultValue}>{result.name}</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Exam:</span>
                    <span className={styles.resultValue}>{result.exam}</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Block:</span>
                    <span className={styles.resultValue}>{result.block}</span>
                  </div>
                  <div className={styles.resultRow}>
                    <span className={styles.resultLabel}>Room Number:</span>
                    <span className={styles.resultValue}>{result.room}</span>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <img
                      src={result.photoUrl}
                      alt={`${result.name}'s photo`}
                      style={{ width: '120px', height: '100px', borderRadius: '3%' }}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button className={styles.downloadButton} onClick={handleDownloadPDF}>
                      Download PDF
                    </button>

                    <Link
                      to={`/find-route/${result.hallticket}`}
                      className={styles.routeButton}
                    >
                      Find Route
                    </Link>
                  </div>
                </>
              ) : (
                <p className={styles.error}>No student found for this hallticket.</p>
              )}
            </div>
          </div>
        )}

        <div className={styles.formCard}>
          <h2>FIND YOUR EXAM BLOCK</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              id="hallticket"
              type="text"
              placeholder="enter HallTicket number"
              value={hallticket}
              onChange={(e) => setHallticket(e.target.value.toUpperCase())}
              required
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'hallticket-error' : undefined}
              className={error ? styles.inputError : ''}
              style={{ textTransform: 'uppercase' }}
            />
            {error && (
              <p id="hallticket-error" className={styles.error}>
                {error}
              </p>
            )}
            <button type="submit" aria-label="Search exam block">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Findmap;
