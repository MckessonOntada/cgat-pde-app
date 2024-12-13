import React from 'react';
import '../Components.scss';
import { getNestedValue } from '../util';
import InputField from '../InputField';

export default function InputFieldFormik(props) {
  const { field, form, label, placeholder, isRequired, ...rest } = props;
  const { name, value } = field;
  const { errors, touched, setFieldValue, setFieldTouched } = form;
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

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
    <InputField
      name={name}
      label={label}
      placeholder={placeholder}
      value={value}
      error={isFieldTouched && errorMessage}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      isRequired={isRequired}
      size={'lg'}
      {...rest}
    />
  );
}
