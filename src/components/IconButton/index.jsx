import React from 'react';
import styles from './style.module.scss';

function IconButton({ icon: Icon, ariaLabel, color = 'default', className = '', ...rest }) {
  const iconNode = typeof Icon === 'function' ? <Icon aria-hidden="true" /> : Icon;

  const colorClass = color !== 'default' ? styles[color] : '';

  return (
    <button type="button" aria-label={ariaLabel} className={`${styles.iconButton} ${colorClass} ${className}`} {...rest}>
      {iconNode}
    </button>
  );
}

export default IconButton;
