import React from 'react';
import DatePicker from '../DatePicker';
import { getNestedValue } from '../util';

export default function DatePickerFormik({ ...props }) {
  const { field, form } = props;
  const { name, value } = field;
  const { setFieldValue, errors, touched } = form;

  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

  const onChange = (value) => {
    setFieldValue(name, value);
  };

  return <DatePicker value={value} error={isFieldTouched && errorMessage} onChange={onChange} size="lg" {...props} />;
}
