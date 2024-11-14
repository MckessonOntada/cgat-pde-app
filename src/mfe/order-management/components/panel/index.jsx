import React from 'react';
import styles from './assets/style/Panel.module.scss';

const Panel = ({ children, border = '1px solid #ddd', style = {}, className }) => {
  return (
    <div className={`${styles.wrapper} ${className}`} style={{ border, ...style }}>
      {children}
    </div>
  );
};

export default Panel;
