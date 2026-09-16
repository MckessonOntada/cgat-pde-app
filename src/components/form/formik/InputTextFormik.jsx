import React from 'react';
import { getNestedValue } from '../util';
import InputText from '../InputText';

export default function InputTextFormik(props) {
  const { field, form, label, placeholder, isRequired, ...rest } = props;
  const { name, value } = field;
  const { errors, touched, setFieldValue, setFieldTouched } = form;

  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

  const handleOnChange = (val) => {
    setFieldValue(name, val);
    if (typeof props.onChange === 'function') {
      props.onChange(val);
    }
  };

  const handleOnBlur = (event) => {
    setFieldTouched(name, true);
    if (typeof props.onBlur === 'function') {
      props.onBlur(event);
    }
  };

  return (
    <InputText
      name={name}
      label={label}
      placeholder={placeholder}
      value={value}
      isRequired={isRequired}
      error={isFieldTouched && errorMessage}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      {...rest}
    />
  );
}
