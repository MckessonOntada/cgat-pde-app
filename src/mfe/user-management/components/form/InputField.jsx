import React from 'react';
import { InputField as BaseInputField } from '@mckesson/mcp-component-library';
import PropTypes from 'prop-types';

export default function InputField(props) {
  const { field, form, children, className, ...rest } = props;
  // Enhance to integrate remaining props
  return (
    <BaseInputField
      {...rest}
      id={field.name}
      name={field.name}
      value={field.value}
      register={() => ({
        onChange: field.onChange,
        onBlur: field.onBlur,
      })}
      errors={form.errors}
      errorMessage={form.errors[field.name]}
      showError={!form.isValid}
      size="lg"
    />
  );
}
