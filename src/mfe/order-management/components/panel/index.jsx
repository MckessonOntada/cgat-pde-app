import React from 'react';
import styles from './assets/style/Panel.module.scss';

const Panel = ({ children, border = '1px solid #ddd', padding = '16px', style = {} }) => {
  return (
    <div className={styles.wrapper} style={{ border, padding, ...style }}>
      {children}
    </div>
  );
};

export default Panel;
