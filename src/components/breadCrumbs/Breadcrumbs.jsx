import React from 'react';
import PropTypes from 'prop-types';
import styles from './assets/styles/BreadCrumbs.module.scss';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumb}>
        {items.map((item, index) => (
          <li key={index} className={styles.breadcrumbitem}>
            {index !== 0 && <span className={styles.separator}> / </span>}
            {item.url ? (
              <Link className={styles.linkItem} to={item.url}>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string
    })
  ).isRequired
};
