import React, { useRef } from 'react';
import { InputField as BaseInputField, Label, TextError } from '@mckesson/mcp-component-library';
import { highlightFieldOnLabelClick } from './util';

export default function InputField(props) {
  const { name, labelControls, value = '', label, placeholder, onChange, error, onBlur = () => {}, isRequired, ...rest } = props;
  const fieldContainerRef = useRef(null);
  return (
    <div className="grid" onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <div className="row-space-between-center">
        <Label htmlFor={name} className="label-heading">
          {label}
          {isRequired && <span className='required'> *</span>}
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
