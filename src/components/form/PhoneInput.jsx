import React from 'react';
import { MaskedInput, TextError, Label, Required } from '@mckesson/mcp-component-library';
import './Components.scss';

export default function PhoneInput(props) {
  const { id, value, isRequired, error = '', onChange, onBlur, label, ...rest } = props;

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
    }
    return '';
  };
  return (
    <div className="grid align-PhoneInput">
      <Label htmlFor={`${id}`} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <MaskedInput
        id={id}
        name={id}
        mask="(XXX) XXX-XXXX"
        onChangeFn={onChange}
        onBlurFn={onBlur}
        value={formatPhoneNumber(value)}
        dataTestId="mobile-input"
        useUnmaskedValue={false}
        error={error}
        {...rest}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
