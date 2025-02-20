import React, { useRef } from 'react';
import { CustomDatepicker, Label, TextError } from '@mckesson/mcp-component-library';
import { getNestedValue } from './util';

export default function DatePicker(props) {
  const { id = '', value = '', label, error, onChange, isShowLabel = false, isRequired, form, field, ...rest } = props

  const handleInputBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  const isFieldTouched = getNestedValue(form.touched, field.name);
  const errorMessage = getNestedValue(form.errors, field.name);
  return (
    <div id={id} className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <span className='required'> *</span>}
      </Label>
      <CustomDatepicker
        id={id}
        name={id}
        value={value}
        onChangeFn={onChange}
        size="lg"
        errors={isFieldTouched && errorMessage}
        onBlur= {handleInputBlur}
        isShowLabel={isShowLabel}
        showRequiredIcon={isRequired}
        {...rest}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
}
