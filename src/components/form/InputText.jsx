import React, { useState, useEffect } from 'react';
import { TextError, Tooltip } from '@mckesson/mcp-component-library';
import PropTypes from 'prop-types';
import styles from './InputText.module.scss';
import { ReactComponent as IconInfo } from '@src/assets/svg/info-2.svg';

const InputText = ({
  id,
  value: propValue,
  type = 'text',
  label = '',
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  error,
  helperText = '',
  placeholder = '',
  maxLength = null,
  min,
  max,
  startIcon,
  endIcon,
  prefix,
  suffix,
  autoFocus = false,
  showError = true,
  isShowCharacterLimit = false,
  maxCharLimit = 0,
  onChange,
  onBlur,
  onInputChange,
  onInputBlur,
  preventCharacters = [],
  size = 'lg',
  displayType = 'outline',
  requiredLabel = '*',
  errorTextEllipsis = false,
  translateClass,
  isShowLabel = true,
  labelTemplate = 'default',
  infoText,
  onKeyPress,
  ...props
}) => {
  const [value, setValue] = useState(propValue || '');
  const [contentLength, setContentLength] = useState(value.length);

  useEffect(() => {
    setValue(propValue || '');
    setContentLength(propValue ? propValue.length : 0);
  }, [propValue]);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (type === 'number' && maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    setValue(newValue);
    setContentLength(newValue.length);
    onChange && onChange(newValue);
    onInputChange && onInputChange(newValue);
  };

  const handleBlur = (e) => {
    onBlur && onBlur(e);
    onInputBlur && onInputBlur(e);
  };

  const handleKeyPress = (e) => {
    if (preventCharacters.includes(e.key)) {
      e.preventDefault();
    }
  };

  const hasError = error;

  return (
    <div className={`${styles.wrapper} ${styles[displayType]} ${styles[size]}`}>
      {isShowLabel && label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {infoText && (
            <span className="info-icon">
              <Tooltip body={infoText} placement="top">
                <div type="button" aria-label="information">
                  <IconInfo />
                </div>
              </Tooltip>
            </span>
          )}
          {isRequired && <span className="required">{requiredLabel}</span>}
        </label>
      )}

      <div className={`${styles.inputFieldContainer}`}>
        <div className={`${styles.inputFlex} ${hasError && styles.errorField}  ${isReadOnly && styles.disabled}`}>
          {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
          {prefix && <div className={styles.prefix}>{prefix}</div>}

          <input
            id={id}
            type={type}
            value={value}
            disabled={isDisabled}
            readOnly={isReadOnly}
            placeholder={placeholder || ''}
            maxLength={maxLength || undefined}
            min={min}
            max={max}
            autoFocus={autoFocus}
            className={`${styles.inputElement} ${hasError ? styles.errorInput : ''}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyPress={onKeyPress}
            onKeyDown={handleKeyPress}
            {...props}
          />

          {suffix && <div className={styles.suffix}>{suffix}</div>}
          {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
        </div>
      </div>

      {error && <TextError errorMessage={error} />}

      {isShowCharacterLimit && (
        <div className={styles.characterLimit}>
          {contentLength}/{maxCharLimit}
        </div>
      )}

      {helperText && (
        <div className={`${styles.helperTextContainer} ${translateClass?.helperText}`}>
          <p className={styles.helperText}>{helperText}</p>
        </div>
      )}
    </div>
  );
};

InputText.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  showError: PropTypes.bool,
  isShowCharacterLimit: PropTypes.bool,
  maxCharLimit: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputBlur: PropTypes.func,
  preventCharacters: PropTypes.array,
  size: PropTypes.string,
  displayType: PropTypes.string,
  requiredLabel: PropTypes.string,
  errorTextElipsis: PropTypes.bool,
  translateClass: PropTypes.object,
  isShowLabel: PropTypes.bool,
  labelTemplate: PropTypes.string
};

export default InputText;
