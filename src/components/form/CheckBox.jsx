import React from 'react';
import { CheckboxGroup, TextError, Label } from '@mckesson/mcp-component-library';

export default function CheckBox(props) {
  const { field, form, items, label, direction = 'column', isRequired = false, shouldSplitField = false, ...rest } = props;
  const fieldNameParts = shouldSplitField && field?.name?.includes('.') ? field.name.split('.') : null;
  const rootFieldName = fieldNameParts ? fieldNameParts[0] : field?.name;
  const subFieldName = fieldNameParts ? fieldNameParts[1] : null;

  const isTouched = subFieldName
    ? form.touched?.[rootFieldName]?.[subFieldName] || form.touched?.[field?.name]
    : form.touched?.[field?.name];

  // Get the error only if the field is touched
  const error = isTouched
    ? subFieldName
      ? form.errors?.[rootFieldName]?.[subFieldName] || form.errors?.[field.name]
      : form.errors?.[field.name]
    : null;

  const handleChange = (event, index) => {
    // Get the current checked items from the form state
    const currentCheckedValues = Array.isArray(field.value) ? field.value : [];

    const valueToAddOrRemove = items[index].value;
    const isChecked = event.target.checked;

    let updatedCheckedValues;

    if (isChecked) {
      // If checked, add the value to the array
      updatedCheckedValues = [...currentCheckedValues, valueToAddOrRemove];
    } else {
      // If unchecked, remove the value from the array
      updatedCheckedValues = currentCheckedValues.filter((value) => value !== valueToAddOrRemove);
    }

    if (fieldNameParts) {
      form.setFieldValue(rootFieldName, { value: updatedCheckedValues });
    } else {
      form.setFieldValue(field.name, updatedCheckedValues);
    }
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
        direction={direction}
        items={items.map((item, index) => ({
          ...item,
          onChange: (event) => handleChange(event, index),
          isChecked: field.value ? field.value.includes(item.value) : false
        }))}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
