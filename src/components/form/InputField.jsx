import React, { useRef } from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library';
import { highlightFieldOnLabelClick } from './util';

export default function InputField(props) {
  const { name, value = '', label, placeholder, onChange, error, onBlur = () => {}, isRequired, ...rest } = props;

  const fieldContainerRef = useRef(null);

  return (
    <div className="grid" onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <Label htmlFor={name} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
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
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
