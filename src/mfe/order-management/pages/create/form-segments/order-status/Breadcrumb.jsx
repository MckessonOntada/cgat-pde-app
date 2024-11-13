import React from 'react';
import styles from './Breadcrumb.module.scss';

const Breadcrumb = ({ items = ['Approval', 'Fulfillment', 'Shipment', 'Final Delivery'] }) => {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => (
        <div key={index} className={styles.breadcrumbItem}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
