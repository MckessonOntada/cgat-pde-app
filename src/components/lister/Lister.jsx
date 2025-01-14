import React from 'react';
import PropTypes from 'prop-types';
import styles from './assets/Lister.module.scss';

const Lister = ({ heading, data }) => {
  return (
    <div className={styles.tableContainer}>
      {heading && <h3 className={styles.tableHeading}>{heading}</h3>}
      <table className={styles.table}>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCellTitle}>{row.title}</td>
              <td className={styles.tableCellValue}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Lister.propTypes = {
  heading: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};

Lister.defaultProps = {
  heading: ''
};

export default Lister;
