import React from 'react';

import styles from './assets/styles/BreadCrumbs.module.scss';
import { Breadcrumbs, Typography } from '@mui/material';

function BreadCrumbs(props) {
  let { seperator, fontSize, fontWeight, children } = props;
  return (
    <Breadcrumbs
      separator={
        <Typography fontSize={fontSize} fontWeight={fontWeight}>
          {seperator}
        </Typography>
      }
      className={styles.navigationBreadcrumb}>
      {children}
    </Breadcrumbs>
  );
}

export default BreadCrumbs;
