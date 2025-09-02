import React from 'react';
import styles from './BlockDetails.module.css';
import candidate1 from './krishnaveni.jpeg';
import candidate2 from './24P31F00E4.png';
import candidate3 from './praveen.jpeg';
import candidate4 from './thubphotodj.jpg';



const BlockDetails = ({ hallticket }) => {
  const result = studentData.find(
    (student) => student.hallticket === hallticket
  );

  return (
    <div className={styles.detailsContainer}>
      {result ? (
        <div className={styles.detailsWrapper}>

        
          <div className={styles.candidateInfo}>
            <img
              src={result.photoUrl}
              alt={`Photo of ${result.name}`}
              className={styles.candidatePhoto}
            />
            <p className={styles.candidateName}>{result.name}</p>
          </div>

          <div className={styles.textDetails}>
            <h3>Exam Details</h3>
            <p><strong>HallTicket Number:</strong> {result.hallticket}</p>
            <p><strong>Exam:</strong> {result.exam}</p>
            <p><strong>Block:</strong> {result.block}</p>
            <p><strong>Room Number:</strong> {result.room}</p>
          </div>
        </div>
      ) : (
        <p className={styles.error}>No matching data found for <strong>{hallticket}</strong>.</p>
      )}
    </div>
  );
};

export default BlockDetails;
