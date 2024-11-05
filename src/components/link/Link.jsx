import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './assets/Link.module.scss';

const Link = ({ to, icon, iconPosition = 'left', children, ...rest }) => {
  const renderIcon = () => (
    icon ? <span className="icon-wrapper" aria-hidden="true">{icon}</span> : null
  );

  return (
    <RouterLink 
      to={to} 
      className={styles.linkWrapper}
      {...rest}
      aria-label={children}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className="link-text">{children}</span>
      {iconPosition === 'right' && renderIcon()}
    </RouterLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
};

export default Link;
