import React from 'react';
import { RadioGroup as BaseRadioGroup } from '@mckesson/mcp-component-library';

// TODO: Handle radio group validations & errors
export default function RadioGroup(props) {
  const { field, form } = props;
  const error = form.errors[field.name] && form.touched[field.name];
  return (
    <BaseRadioGroup
      {...props}
      error={!!error}
      errorMessage={error ? form.errors[field.name] : ''}
      onChangeValue={value => form.setFieldValue(field.name, value)}
      value={field.value}
    />
  );
}
