import React from 'react';
import { CheckboxGroup } from '@mckesson/mcp-component-library';

export default function CheckBox(props) {
  const { field, form, items } = props;
  const error = form.errors[field.name] && form.touched[field.name];

  const handleChange = (event, index) => {
    // Get the current checked items from the form state
    const currentCheckedValues = field.value || [];

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

    form.setFieldValue(field.name, updatedCheckedValues);
  };

  return (
    <CheckboxGroup
      {...props}
      error={!!error}
      errorMessage={error ? form.errors[field.name] : ''}
      items={items.map((item, index) => ({
        ...item,
        onChange: (event) => handleChange(event, index),
        isChecked: field.value ? field.value.includes(item.value) : false
      }))}
    />
  );
}
