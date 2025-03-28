import React from 'react';
import styles from './CustomDataTable.module.scss';

function DataTableEmptyView({ text, ...props }) {
  return (
    <div className={`${styles.emptyTableContainer} print-screen-empty`}>
      <div className={styles.emptyTableDisplay}>{text}</div>
    </div>
  );
}

export default DataTableEmptyView;
