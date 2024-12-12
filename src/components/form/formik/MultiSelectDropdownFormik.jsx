import React from 'react';
import { getNestedValue } from '../util';
import MultiSelectDropdown from '../MultiSelectDropdown';

const MultiSelectDropdownFormik = (props) => {
  const { field, form, fieldlabel, isRequired } = props;
  const { name, value } = field;
  const { setFieldValue, errors, touched } = form;

  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);
  return (
    <MultiSelectDropdown
      id={name}
      label={fieldlabel}
      isSuccess
      value={value}
      error={isFieldTouched && errorMessage}
      isRequired={isRequired}
      onChange={(values) => {
        setFieldValue(
          `${name}`,
          values.filter((item) => item.isChecked).map((item) => item.value)
        );
      }}
      {...props}
    />
  );
};

export default MultiSelectDropdownFormik;
