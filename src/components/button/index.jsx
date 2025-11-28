import React from 'react';
import clsx from 'clsx';
import styles from './style.module.scss';

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth,
  disabled,
  className,
  ...rest
}) {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[color], styles[size], fullWidth && styles.fullWidth, disabled && styles.disabled, className)}
      disabled={disabled}
      {...rest}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
}
