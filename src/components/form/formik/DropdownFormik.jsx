import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { getNestedValue } from '../util';
import Dropdown from '../Dropdown';

export default function DropdownFormik(props) {
  const { t } = useTranslate();
  const {
    field,
    form,
    fieldlabel,
    isRequired,
    onChangeHandler = () => {},
    selected
  } = props;
  const { name, value } = field;
  const { setFieldValue, errors, touched } = form;
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);
  const dropdownValue = value || selected || '';

  return (
    <Dropdown
      id={name}
      label={fieldlabel}
      value={dropdownValue}
      isRequired={isRequired}
      error={isFieldTouched && errorMessage}
      onChange={(value) => {
        setFieldValue(name, value);
        onChangeHandler(value);
        if (typeof props.onChange === 'function') {
          props.onChange(value);
        }
      }}
      size="lg"
      {...props}
    />
  );
}
