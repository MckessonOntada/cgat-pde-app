import React from 'react';
import { getNestedValue } from '../util';
import TimeField from '../TimeField';

export default function TimeFieldFormik(props) {
  const { field, form, isRequired, placeholder, label, ...rest } = props;
  const { name, value } = field;
  const { errors, touched, setFieldValue, setFieldTouched } = form;
  const errorMessage = getNestedValue(errors, name);
  const isTouched = getNestedValue(touched, name);
  const handleOnChange = (event) => {
    if (typeof props.onChange === 'function') {
      props.onChange(event);
    }
    setFieldValue(`${name}`, event.target.value);
  };

  const handleOnBlur = (event) => {
    setFieldTouched(`${name}`, true);
  };

  return (
    <TimeField
      name={name}
      label={label}
      placeholder={placeholder}
      value={value}
      error={isTouched && errorMessage}
      handleOnChange={handleOnChange}
      handleOnBlur={handleOnBlur}
      isRequired={isRequired}
      form={form}
      {...rest}
    />
  );
}
