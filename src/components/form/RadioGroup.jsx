import React from 'react';
import { RadioGroup as BaseRadioGroup, Label, TextError } from '@mckesson/mcp-component-library';

// TODO: Handle radio group validations & errors
export default function RadioGroup(props) {
  const { field, form, isRequired, caption, ...rest } = props;
  //  const error = form.errors[field.name] && form.touched[field.name];

  const fieldNameParts = field.name.includes('.') ? field.name.split('.') : null;
  const rootFieldName = fieldNameParts ? fieldNameParts[0] : field.name;
  const subFieldName = fieldNameParts ? fieldNameParts[1] : null;
  const isTouched = subFieldName ? form.touched?.[rootFieldName]?.[subFieldName] || form.touched?.[field.name] : form.touched?.[field.name];

  const error = isTouched
    ? subFieldName
      ? form.errors[rootFieldName]?.[subFieldName] || form.errors[field.name]
      : form.errors[field.name]
    : null;
  return (
    <div>
      <Label className="label-heading">
        {caption}
        {isRequired && <span className="required"> *</span>}
      </Label>
      <BaseRadioGroup error={!!error} onChangeValue={(value) => form.setFieldValue(field.name, value)} value={field.value} {...rest} />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
