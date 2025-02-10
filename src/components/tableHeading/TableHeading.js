import React from 'react';
import styles from './TableHeading.module.scss';

function TableHeading({ heading, controls, secondaryView, secondaryViewHeading, secondaryViewControls, style }) {
  return (
    <div className={`${styles.tableHeadingContainer} ${secondaryView && styles.tableHeadingContainerSeconday}`} style={style}>
      {!secondaryView ? (
        <>
          <h2 className="">{heading}</h2>
          {controls}
        </>
      ) : (
        <>
          {secondaryViewHeading}
          {secondaryViewControls}
        </>
      )}
    </div>
  );
}

export default TableHeading;
