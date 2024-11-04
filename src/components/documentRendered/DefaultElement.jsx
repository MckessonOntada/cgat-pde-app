import React from 'react';
import { Box, Link } from '@mui/material';

import { ReactComponent as FileTypeErrorSVG } from '../../assets/svg/common-file-type-warning.svg';
import { ReactComponent as NoDocumentSVG } from '../../assets/svg/no-document-filter.svg';
import styles from './assets/styles/DefaultElement.module.scss';

import { SERVICE_NOW_IT_SUPPORT_URL } from '../../config/AppConfig';

const renderErrorContent = (type) => {
  switch (type) {
    case 'nodata':
      return (
        <div className={styles.errorContainer}>
          System is unable to load document. <br />
          Please create{' '}
          <Link
            className={styles.textHighlight}
            href={SERVICE_NOW_IT_SUPPORT_URL}
            target="_blank"
            underline="hover">
            ServiceNow
          </Link>{' '}
          ticket to report this issue. Provide patient ID, date of service, and document type.
        </div>
      );
    case 'nodata/filter':
      return (
        <span>
          No documents match your filters.
          <br /> Remove filters to view relevant documents.
        </span>
      );
    default:
      return <span>This document file format is not supported by the system.</span>;
  }
};

function DefaultElement({ type = null }) {
  return (
    <Box className={`display-flex-center ${styles.warningContainer}`}>
      {type === 'nodata/filter' ? <NoDocumentSVG /> : <FileTypeErrorSVG />}
      <Box className={styles.warningContent}>{renderErrorContent(type)}</Box>
    </Box>
  );
}

export default DefaultElement;
