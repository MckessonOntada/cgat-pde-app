import React from 'react';
import { RadioGroup as BaseRadioGroup, Label } from '@mckesson/mcp-component-library';

// TODO: Handle radio group validations & errors
export default function RadioGroup(props) {
  const { field, form, isRequired, caption, ...rest } = props;
  const error = form.errors[field.name] && form.touched[field.name];
  
  return (
    <div>
      <Label className="label-heading">
        {caption}
        {isRequired && <span className='required'> *</span>}
      </Label>
      <BaseRadioGroup
        error={!!error}
        errorMessage={error ? form.errors[field.name] : ''}
        onChangeValue={value => form.setFieldValue(field.name, value)}
        value={field.value}
        {...rest}
      />
    </div>
  );
}
