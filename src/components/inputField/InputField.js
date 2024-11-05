import React from 'react';
import PropTypes from 'prop-types';
import styles from './assets/styles/InputField.module.scss';
import CommonUtils from '../../common/util/CommonUtils';
import { ReactComponent as InfoIcon } from '../../assets/svg/info.svg';
import { ReactComponent as ErrorIcon } from '../../assets/svg/error.svg';
import { Tooltip, Button } from '@mckesson/mcp-component-library';
export const InputField = (props) => {
  const {
    id,
    type,
    displayType,
    name,
    label,
    isRequired,
    isDisabled,
    isReadOnly,
    errors,
    validationFn,
    onChangeFn,
    onBlurFn,
    register,
    tooltipText,
    placeholder,
    maxLength,
    size,
    accept,
    autoFocus,
    style
  } = props;
  const computeSize = () => {
    let inputSize = styles[`${errors?.[name] ? 'sizeLgError' : 'sizeLg'}`];
    switch (size) {
      case 'lg':
        inputSize = styles[`${errors?.[name] ? 'sizeLgError' : 'sizeLg'}`];
        styles.sizeLg;
        break;
      case 'md':
        inputSize = styles[`${errors?.[name] ? 'sizeMdError' : 'sizeMd'}`];
        styles.sizeMd;
        break;
      case 'sm':
        inputSize = styles[`${errors?.[name] ? 'sizeSmError' : 'sizeSm'}`];
        styles.sizeSm;
        break;
      default:
        break;
    }
    return inputSize;
  };

  const computeIconStyle = () => {
    if (!errors?.[name]) {
      return '';
    }
    let iconStyle = styles.iconLg;
    switch (size) {
      case 'lg':
        iconStyle = styles.iconLg;
        break;
      case 'md':
        iconStyle = styles.iconMd;
        break;
      case 'sm':
        iconStyle = styles.iconSm;
        break;
      default:
        break;
    }
    return iconStyle;
  };

  return (
    <div>
      <div className={styles.labelContainer}>
        {label && (
          <label
            htmlFor={'input-' + id}
            data-testid={'label-testid-' + id}
            className={`${styles.label}`}>
            <div style={{ width: '100%' }}>
              <span title={label} className={`${styles.labelWrap}`}>
                {label}
              </span>
            </div>
            {/* {label}{' '} */}
            {isRequired && (
              <span className={styles.requiredIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none">
                  <circle cx="3" cy="3" r="3" fill="#DB3A29" />
                </svg>
              </span>
            )}
            {tooltipText && (
              <Tooltip
                body={tooltipText}
                key={'input-tooltip-' + id}
                placement="top"
                alignText="left">
                <span aria-label="information">
                  <InfoIcon />
                </span>
              </Tooltip>
            )}
          </label>
        )}
      </div>
      <div className={`${styles.inputFieldContainer}`}>
        <input
          id={'input-' + id}
          aria-required={isRequired}
          onInput={(e) => {
            type === 'number' ? (e.target.value = e.target.value.slice(0, maxLength)) : {};
          }}
          aria-describedby={errors?.[name] ? 'error-' + id : null}
          aria-invalid={CommonUtils.isNonEmptyObject(errors?.[name])}
          data-testid={'input-testid-' + id}
          type={type}
          className={`${styles.inputField} ${computeSize()} ${styles[displayType]} ${
            errors?.[name] ? styles[displayType + 'Error'] : ''
          }
          ${errors?.[name] ? styles.icon : ''} ${computeIconStyle()}
          
          `}
          style={style ? { ...style } : {}}
          disabled={isDisabled}
          readOnly={isReadOnly}
          {...register(name, {
            validate: (value) => (isDisabled || isReadOnly ? null : validationFn(value)),
            onChange: () => (isDisabled || isReadOnly ? null : onChangeFn(name)),
            onBlur: () => (isDisabled || isReadOnly ? null : onBlurFn())
          })}
          placeholder={isReadOnly ? '' : placeholder ? placeholder : ''}
          maxLength={maxLength ? maxLength.toString() : ''}
          autoFocus={autoFocus}
          {...(type === 'file' && { accept: accept })}
        />
      </div>
      {errors?.[name] && (
        <p data-testid={'error-testid-' + id} id={'error' + id} className={`${styles.errorText}`}>
          <ErrorIcon />
          {errors?.[name]?.message}
          <span className="sr-only">{errors?.[name]?.message}</span>
        </p>
      )}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  displayType: PropTypes.oneOf(['outline', 'underline']),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  errors: PropTypes.any,
  register: PropTypes.any,
  validationFn: PropTypes.func,
  onChangeFn: PropTypes.func,
  onBlurFn: PropTypes.func,
  placeholder: PropTypes.string,
  tooltipText: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  accept: PropTypes.string,
  autoFocus: PropTypes.bool
};
InputField.defaultProps = {
  type: 'text',
  displayType: 'outline',
  placeholder: '',
  label: '',
  tooltipText: '',
  isRequired: false,
  maxLength: '',
  size: 'lg',
  autoFocus: false,
  showClear: false,
  isInline: false
};
