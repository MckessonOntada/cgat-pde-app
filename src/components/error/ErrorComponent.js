import styles from './assets/styles/ErrorComponent.module.scss';
import React from 'react';

function ErrorComponent({ variant, type, header, body, bodyFooter }) {
  return (
    <React.Fragment>
      {variant === 'center' && (
        <div
          className={`${styles['error-center']} ${
            type === 'access-denied' ? styles['access-denied'] : ''
          }`}>
          <div className={styles.errorContainer}>
            <div className={styles.headerContainer}>
              <h4 className={styles.headerText}>{header}</h4>
            </div>
            <div className={styles.bodyContainer}>
              <div className={styles.bodyText}>{body}</div>
              {bodyFooter && <div className={styles.bodyFooter}>{bodyFooter}</div>}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default ErrorComponent;
