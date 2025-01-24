import React from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library';

export default function InputField(props) {
  const { name, labelControls, value = '', label, placeholder, onChange, error, onBlur = () => {}, isRequired, ...rest } = props;

  return (
    <div className="grid">
      <div className="row-space-between-center">
        <Label htmlFor={name} className="label-heading">
          {label}
          {isRequired && <Required id="Required">Required</Required>}
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
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
