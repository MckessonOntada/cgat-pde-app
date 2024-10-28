import React from 'react';
import { Dropdown as BaseDropdown } from '@mckesson/mcp-component-library';

export default function Dropdown(props) {
  const { field, form } = props;
  const error = form.errors[field.name] && form.touched[field.name];
  return (
    <BaseDropdown
      {...props}
      value={field.value}
      error={!!error}
      errorMessage={error ? form.errors[field.name] : ''}
      onChange={value => {
        form.setFieldValue(field.name, value);
      }}
      size="lg"
    />
  );
}
