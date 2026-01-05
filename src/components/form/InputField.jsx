import React, { useRef } from 'react';
import { InputField as BaseInputField, Label, TextError, Tooltip } from '@mckesson/mcp-component-library';
import { highlightFieldOnLabelClick } from './util';
import { ReactComponent as IconInfo } from '@src/assets/svg/info-2.svg';
export default function InputField(props) {
  const {
    name,
    labelControls,
    value = '',
    label,
    placeholder,
    onChange,
    error,
    onBlur = () => {},
    infoText = null,
    isRequired,
    helpText = null,
    ...rest
  } = props;
  const fieldContainerRef = useRef(null);
  return (
    <div className="grid" onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <div className="row-space-between-center">
        <Label htmlFor={name} className="label-heading">
          {label}
          {isRequired && <span className="required"> *</span>}
          {infoText && (
            <span className="info-icon">
              <Tooltip body={infoText} placement="top">
                <div type="button" aria-label="information">
                  <IconInfo />
                </div>
              </Tooltip>
            </span>
          )}
        </Label>
        {labelControls}
      </div>

      <BaseInputField
        id={name}
        name={name}
        placeholder={placeholder}
        register={() => ({
          onChange,
          onBlur,
          value
        })}
        errors={{ [name]: error }}
        showError={!!error}
        {...rest}
      />
      {helpText && <span className="help-text">{helpText}</span>}
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
