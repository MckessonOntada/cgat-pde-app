import React, { useState } from 'react';
import styles from './assets/styles/StatusIndicator.module.scss';

import { ReactComponent as MenuIcon } from '../../assets/svg/menu.svg';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const StatusIndicator = ({ status, displayText = true, showActions = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const PATIENT_FORM_STATUS = {
    NOT_STARTED: { class: styles.svgGrey, text: 'Not Started' },
    IN_PROGRESS: { class: styles.svgYellow, text: 'In Progress' },
    COMPLETED: { class: styles.svgGreen, text: 'Completed' }
  };

  const statusObj = PATIENT_FORM_STATUS[status];

  const dropdownTheme = createTheme({
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: '0px 0px 0px 8px'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: '1px solid var(--brand-color-text-dark-slate)',
            borderRadius: '4px',
            boxShadow: 'none',
            marginTop: '4px',
            padding: '0px',
            width: 'auto'
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: '0px',
            maxHeight: '146px'
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: '9px 16px',
            borderBottom: '1px solid var(--brand-color-text-cool-grey)',
            color: 'var(--brand-color-text-dark-slate)',
            whiteSpace: 'unset',
            wordBreak: 'break-all',
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            '&:last-child': {
              borderBottom: 'none'
            },
            '& span.sub-label': {
              color: 'var(--brand-color-text-light-slate) !important',
              fontWeight: 'var(--brand-font-weight-400) !important'
            },
            '&.Mui-focusVisible': {
              outline: 'none !important',
              background: 'var(--brand-color-secondary-active-yellow-3)',
              color: 'var(--brand-color-text-black)',
              fontWeight: 'var(--brand-font-weight-600)'
            },
            '&.Mui-focusVisible.Mui-selected': {
              outline: 'none !important',
              background: 'var(--brand-color-secondary-active-yellow-3)',
              color: 'var(--brand-color-text-black)',
              fontWeight: 'var(--brand-font-weight-600)'
            },
            '&.Mui-selected': {
              outline: 'none !important',
              background: 'var(--brand-color-secondary-active-yellow-3)',
              color: 'var(--brand-color-text-black)',
              fontWeight: 'var(--brand-font-weight-600)'
            },
            '&.Mui-selected span.sub-label': {
              color: 'var(--brand-color-text-black) !important',
              fontWeight: 'var(--brand-font-weight-400) !important'
            },
            '&:hover': {
              outline: 'none !important',
              background: 'var(--brand-color-secondary-active-yellow-3)',
              color: 'var(--brand-color-text-black)'
            }
          }
        }
      }
    }
  });

  return (
    <div className={styles.statusContainer}>
      <div className={`${statusObj?.class} ${styles.indicator}`}></div>

      {displayText ? <div className={styles.statusText}>{statusObj?.text}</div> : ''}

      {showActions ? (
        <ThemeProvider theme={dropdownTheme}>
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>Option 1</MenuItem>
            <MenuItem onClick={handleClose}>Option 2</MenuItem>
            <MenuItem onClick={handleClose}>Option 3</MenuItem>
          </Menu>
        </ThemeProvider>
      ) : (
        ''
      )}
    </div>
  );
};

export default StatusIndicator;
