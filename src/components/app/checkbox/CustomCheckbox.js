import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, FormControlLabel } from '@mui/material';

import { ReactComponent as RemoveCheck } from '../../../assets/svg/checkbox-remove.svg';
import { ReactComponent as IndeterminateIcon } from '../../../assets/svg/checkbox-indeterminate.svg';
import { ReactComponent as CheckedIcon } from '../../../assets/svg/checkbox-checked.svg';
import { ReactComponent as UncheckedIcon } from '../../../assets/svg/checkbox-unchecked.svg';
import { ReactComponent as UncheckedDisabledIcon } from '../../../assets/svg/checkbox-unchecked-disabled.svg';

function CustomCheckbox(props) {
  const {
    id,
    label,
    indeterminate,
    checked,
    disabled,
    onChange,
    isReadOnly,
    deleted,
    formLabel,
    isFirstColumn
  } = props;
  return (
    <FormControlLabel
      sx={{
        margin: 0,
        '& .MuiTypography-root': {
          fontFamily: `var(--brand-font-family-primary)`,
          fontSize: `var(--brand-font-size--extra-small)`,
          fontWeight: `var(--brand-font-weight-600)`,
          lineHeight: `var(--brand-line-height--medium)`
        }
      }}
      control={
        <Checkbox
          id={`${id}-item`}
          label={label || ''}
          indeterminate={indeterminate}
          sx={{
            '& .MuiSvgIcon-root': { fontSize: 24 },
            '& .MuiTypography-root': {
              fontSize: `var(--brand-font-size--extra-small)`,
              fontWeight: `var(--brand-font-weight-600)`,
              lineHeight: `var(--brand-line-height--medium)`,
              letterSpacing: '0.012px'
            }
          }}
          icon={isFirstColumn ? <UncheckedIcon fill={'white'} /> : <UncheckedDisabledIcon />}
          checked={checked}
          checkedIcon={
            <CheckedIcon
              fill={
                isFirstColumn
                  ? disabled
                    ? 'var(--brand-color-primary-disabled-blue)'
                    : 'var(--brand-color-primary-blue)'
                  : 'var(--brand-color-primary-disabled-blue)'
              }
            />
          }
          onChange={!isReadOnly && onChange}
          size="medium"
          disabled={disabled}
          indeterminateIcon={
            deleted ? (
              <RemoveCheck
                fill={
                  isFirstColumn
                    ? 'var(--brand-color-primary-blue)'
                    : 'var(--brand-color-primary-disabled-blue)'
                }
              />
            ) : (
              <IndeterminateIcon
                fill={
                  isFirstColumn
                    ? 'var(--brand-color-primary-blue)'
                    : 'var(--brand-color-primary-disabled-blue)'
                }
              />
            )
          }
        />
      }
      label={formLabel || ''}
    />
  );
}

CustomCheckbox.defaultProps = {
  isFirstColumn: false
};

export { CustomCheckbox };
