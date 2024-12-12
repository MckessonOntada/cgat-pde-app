import React from 'react';
import { getNestedValue } from '../util';
import PhoneInput from '../PhoneInput';

export default function PhoneInputFormik(props) {
  const { field, form, label, className, ...rest } = props;
  const { name, value } = field;
  const { touched, errors, setFieldValue, setFieldTouched } = form;

  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

  return (
    <PhoneInput
      id={`${name}`}
      label={label}
      isRequired={true}
      mask="(XXX) XXX-XXXX"
      onChangeFn={(value) => setFieldValue(name, value)}
      onBlurFn={() => setFieldTouched(name, true)}
      value={value}
      className={`phone-input-field ${isFieldTouched && errorMessage ? 'outline-error' : ''}`}
      error={isFieldTouched && errorMessage}
      {...rest}
    />
  );
}
