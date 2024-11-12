import React from 'react';
import { Dropdown as BaseDropdown, Label, TextError, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'
import { getNestedValue } from './util';

export default function Dropdown(props) {
  const { t } = useTranslate();
  const { field, form, fieldlabel } = props;

  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);  
  //  const error = form.errors[field.name] && form.touched[field.name];
  
  const error = errorMessage && isFieldTouched;
  return (
    <div className='grid'>
      <Label htmlFor={field.name} className="label-heading">
        {fieldlabel}
        {props.isRequired && <Required id="Required">
          Required
        </Required>}
      </Label>
      <BaseDropdown
        {...props}
        value={field.value}
        error={!!error} 
        onChange={value => {
          form.setFieldValue(field.name, value);
        }}
        size="lg" 
      />
      {isFieldTouched && errorMessage && (
        <TextError errorMessage={errorMessage} />
      )}
    </div>
  );
}
