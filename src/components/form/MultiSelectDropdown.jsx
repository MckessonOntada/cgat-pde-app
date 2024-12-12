import React from 'react';
import { Label, SearchableDropdown, Required } from '@mckesson/mcp-component-library';
import { getNestedValue } from './util';

const MultiSelectDropdown = (props) => {
  const { id, label, value, isRequired, onChange, error, ...rest } = props;

  return (
    <div className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <SearchableDropdown
        {...props}
        id=""
        isSuccess
        value={field.value}
        error={!!error}
        isRequired={false}
        onChange={(values) => {
          form.setFieldValue(
            `${field.name}`,
            values.filter((item) => item.isChecked).map((item) => item.value)
          );
        }}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
};

export default MultiSelectDropdown;
