import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Drawer.module.scss';
import useWindowSize from '@src/hooks/UseWindowSize';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const SM_BREAKPOINT = 576;
const FloatingDrawer = ({ open, onClose, anchor = 'left', swipeable = false, heading= false, width, controls= false, children }) => {
  const drawerRef = useRef();
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < SM_BREAKPOINT;
  const { t } = useTranslate();
  useEffect(() => {
    if (open) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleSwipe = useCallback(
    (event) => {
      if (!swipeable) return;
      const threshold = 30;
      if (
        (anchor === 'left' && event.deltaX > threshold) ||
        (anchor === 'right' && event.deltaX < -threshold) ||
        (anchor === 'top' && event.deltaY > threshold) ||
        (anchor === 'bottom' && event.deltaY < -threshold)
      ) {
        handleClose();
      }
    },
    [anchor, swipeable, handleClose]
  );

  const drawerStyles = useMemo(() => {
    const baseStyle = {
      transform: open ? 'translate(0, 0)' : '',
      transition: 'transform 0.3s ease'
    };

    switch (anchor) {
      case 'left':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          height: '100vh',
          width: isMobileView ? '80%' : 'auto',
          transform: open ? 'translateX(0)' : 'translateX(-100%)'
        };
      case 'right':
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          height: '100vh',
          width: isMobileView ? '80%' : 'auto',
          transform: open ? 'translateX(0)' : 'translateX(100%)'
        };
      case 'top':
        return { ...baseStyle, left: 0, top: 0, height: 'auto', width: '100vh', transform: open ? 'translateY(0)' : 'translateY(-100%)' };
      case 'bottom':
        return { ...baseStyle, left: 0, bottom: 0, height: 'auto', width: '100vh', transform: open ? 'translateY(0)' : 'translateY(100%)' };
      default:
        return {};
    }
  }, [open, anchor, isMobileView]);

  useEffect(() => {
    if (open && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, a, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) focusableElements[0].focus();
    }
  }, [open]);

  return (
    <>
      {open && <div className={styles.drawerBackdrop} onClick={handleClose} role="presentation" aria-hidden="true" />}

      <aside
        className={styles.drawerModule}
        style={drawerStyles}
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()} // Prevents closing on click inside
        onTouchMove={swipeable ? handleSwipe : null}
        aria-modal="true"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-content"
      >
        <div className={styles.drawerWrapper} style={width ? { width: width } : {}}>
          {heading && 
            <div className={styles.header}>
              <Heading as="h3">{heading}</Heading>
              <Button variant="tertiary" onClick={handleClose} textButton IconClose>
                <IconClose />
              </Button>
            </div>
          }
          <div className={styles.body}>
            {children} 
          </div>
          {controls && 
            <div className={styles.footer}>
              {controls}
            </div>
          }
        </div>
      </aside>
    </>
  );
};

FloatingDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  swipeable: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default FloatingDrawer;
