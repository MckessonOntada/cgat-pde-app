import React from 'react';
import { CheckboxGroup, TextError, Label } from '@mckesson/mcp-component-library';

export default function CheckBox(props) {
  const {
    field,
    form,
    isChecked,
    isDisabled,
    value,
    caption,
    label,
    onChange,
    direction = 'column',
    isRequired = false,
    shouldSplitField = false,
    ...rest
  } = props;
  const fieldNameParts = shouldSplitField && field?.name?.includes('.') ? field.name.split('.') : null;
  const rootFieldName = fieldNameParts ? fieldNameParts[0] : field?.name;
  const subFieldName = fieldNameParts ? fieldNameParts[1] : null;

  const isTouched = subFieldName ? form.touched?.[rootFieldName]?.[subFieldName] || form.touched?.[field?.name] : form.touched?.[field?.name];

  const error = isTouched ? (subFieldName ? form.errors?.[rootFieldName]?.[subFieldName] || form.errors?.[field.name] : form.errors?.[field.name]) : null;

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    form.setFieldValue(field.name, isChecked);
    if (onChange) onChange(event);
  };

  return (
    <div>
      <div className="row-space-between-center">
        <Label htmlFor={name} className="label-heading">
          {label}
          {isRequired && <span className="required"> *</span>}
        </Label>
      </div>
      <CheckboxGroup
        {...rest}
        items={[
          {
            isDisabled,
            value,
            label: caption,
            onChange: (event) => handleChange(event),
            isChecked: field.value ? field.value : false
          }
        ]}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
