import React from "react";
import { InputField as BaseInputField } from "@mfe/ui-components";
import PropTypes from "prop-types";

export default function InputField(props) {
  const { field, form } = props; 
  // Enhance to integrate remaining props
  return (
    <BaseInputField
      {...props}
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
