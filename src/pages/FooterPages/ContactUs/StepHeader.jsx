import React from 'react';
import styles from './ContactUs.module.scss';

const StepHeader = ({ step, title }) => {
  return (
    <div className={styles.stepHeader}>
      <div className={styles.stepHeaderNumber}>{step}</div>

      <h2 className={styles.stepHeaderTitle}>{title}</h2>
    </div>
  );
};

export default StepHeader;
