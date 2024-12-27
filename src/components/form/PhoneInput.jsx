import React, { useEffect, useRef, useState } from 'react';
import { MaskedInput, TextError, Label, Required } from '@mckesson/mcp-component-library';
import './Components.scss';

export default function PhoneInput(props) {
  const { id, value, isRequired, error = '', onChangeFn, onBlur, label, ...rest } = props;
  const [isFieldDirty, setIsFieldDirty] = useState(false);

  const phoneInputRef = useRef();

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
    }
    return '';
  };

  useEffect(() => {
    if (value && !isFieldDirty) {
      const inputElement = phoneInputRef.current.querySelector('input');

      setTimeout(() => {
        try {
          inputElement.value = formatPhoneNumber(value);
        } catch (e) {}
      }, 200);
    }
  }, [value]);

  return (
    <div className="grid align-PhoneInput" ref={phoneInputRef}>
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <MaskedInput
        {...rest}
        id={id}
        name={id}
        mask="(XXX) XXX-XXXX"
        onChangeFn={(e) => {
          setIsFieldDirty(true);
          onChangeFn(e);
        }}
        onBlurFn={onBlur}
        value={formatPhoneNumber(value)}
        dataTestId="mobile-input"
        useUnmaskedValue={false}
        error={error}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
