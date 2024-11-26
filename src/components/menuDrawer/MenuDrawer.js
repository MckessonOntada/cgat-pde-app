import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from '@mckesson/mcp-component-library';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ReactComponent as MenuIcon } from '../../assets/svg/menu.svg';
import styles from './assets/styles/MenuDrawer.module.scss';
import CommonUtils from '@src/util/CommonUtils';

function MenuDrawer({
  id,
  options,
  size,
  onClick,
  actionText = false,
  menuIcon,
  isDisabled,
  children
}) {
  const getMenuItemSizeStyle = () => {
    let style = {};

    switch (size) {
      case 'sm':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--extra-small)',
          lineHeight: 'var(--brand-line-height--medium)',
          letterSpacing: ' 0.001em'
        };
        break;
      case 'md':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--small)',
          lineHeight: 'var(--brand-line-height--large)'
        };
        break;
      case 'lg':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--small)',
          lineHeight: 'var(--brand-line-height--large)'
        };
    }
    return {
      ...style
    };
  };

  const dropdownTheme = createTheme({
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: '0px'
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
            width: 'auto',
            minWidth: '160px'
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
            ...getMenuItemSizeStyle(),
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
            '&.Mui-disabled': {
              pointerEvents: 'auto'
            },
            '&:hover': {
              outline: 'none !important',
              background: 'var(--brand-color-secondary-active-yellow-3)',
              color: 'var(--brand-color-text-black)',
              fontWeight: 'var(--brand-font-weight-600)'
            }
          }
        }
      }
    }
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const TooltipMenuItem = ({ body, disabled, label }) => {
    return (
      <Tooltip body={body} placement="left" alignText="left" maxW="240px">
        <MenuItem disabled={disabled} className={styles.disabledMenuItem}>
          {label}
        </MenuItem>
      </Tooltip>
    );
  };

  return (
    <ThemeProvider theme={dropdownTheme}>
      <IconButton
        // key={id}
        aria-controls="simple-menu"
        aria-haspopup="true"
        disabled={isDisabled}
        sx={{ display: 'flex', flexDirection: 'column', padding: '2px 4px', borderRadius: '5px' }}
        onClick={handleClick}>
        {actionText ? (
          <div className={styles.tableActionButton}>{actionText}</div>
        ) : menuIcon ? (
          [menuIcon]
        ) : (
          <MenuIcon />
        )}
        {children}
      </IconButton>
      {CommonUtils.isNonEmptyObject(options) && (
        <Menu
          id={id}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          {options?.map((val, idx) => {
            const menuItemDisabled = val?.disabled ? styles.disabledMenuItem : '';
            return val?.showToolTip ? (
              <TooltipMenuItem
                key={`${id}-${idx}-tooltipMenu`}
                body={val?.toolTipBody}
                disabled={val?.disabled}
                label={val.label}
              />
            ) : (
              <MenuItem
                key={`${id}-${idx}`}
                disabled={val?.disabled ? val?.disabled : false}
                className={menuItemDisabled}
                onClick={() => {
                  if (!val?.disabled) {
                    setAnchorEl(null);
                    onClick(val?.value);
                    handleClose();
                  }
                }}>
                {val.label}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </ThemeProvider>
  );
}

MenuDrawer.propTypes = {
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Displayed label for the menu item
      value: PropTypes.any.isRequired,
      disabled: PropTypes.bool, // Whether the menu item is disabled (optional)
      showToolTip: PropTypes.bool, // Whether to show a tooltip for the menu item (optional)
      toolTipBody: PropTypes.string // Tooltip content for the menu item (optional)
    })
  ),
  size: PropTypes.oneOf(['lg', 'md', 'sm']).isRequired,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool
};

export default MenuDrawer;
