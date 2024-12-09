import React from 'react';
import { Label, SearchableDropdown } from '@mckesson/mcp-component-library';
import { getNestedValue } from './util';

const MultiSelectDropdown = (props) => {
  const { field, form, fieldlabel } = props;

  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);
  const error = errorMessage && isFieldTouched;
  return (
    <div className="grid">
      <Label htmlFor={field.name} className="label-heading">
        {fieldlabel}
        {props.isRequired && <Required id="Required">Required</Required>}
      </Label>
      <SearchableDropdown
        {...props}
        id=""
        isSuccess
        value={field.value}
        error={!!error}
        isRequired={false}
        onChange={(values) => {
          form.setFieldValue(`${field.name}`, values.filter(item => item.isChecked).map(item => item.value));
        }}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
};

export default MultiSelectDropdown;
