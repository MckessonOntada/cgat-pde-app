import { Box, Typography } from '@mui/material';
import styles from './assets/styles/ErrorComponent.module.scss';
import React from 'react';

function ErrorComponent({ variant, type, header, body, bodyFooter }) {
  return (
    <React.Fragment>
      {variant === 'center' && (
        <Box
          className={`${styles['error-center']} ${
            type === 'access-denied' ? styles['access-denied'] : ''
          }`}>
          <Box className={styles.errorContainer}>
            <Box className={styles.headerContainer}>
              <Typography className={styles.headerText}>{header}</Typography>
            </Box>
            <Box className={styles.bodyContainer}>
              <Box className={styles.bodyText}>{body}</Box>
              {bodyFooter && <Box className={styles.bodyFooter}>{bodyFooter}</Box>}
            </Box>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}

export default ErrorComponent;
