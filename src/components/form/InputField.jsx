import React from 'react';
import {InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library'; 
import './Components.scss' 
import { getNestedValue } from './util'; 

export default function InputField(props) {
  const { field, form, children, className, label, maxLength,...rest } = props;
  
  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);
  

  // To set the Value for field. There is no name Present in Input Component
  const handleOnChange = (event) => {    
    form.setFieldValue(`${field.name}`, event.target.value);
  };
  const handleOnBlur = (event) => {
    form.setFieldTouched(`${field.name}`, true); 
  };

  return (
    <div className='grid'>
      <Label htmlFor={field.name} className="label-heading">
        {label}
        {props.isRequired && <Required id="Required">
          Required
        </Required>}
      </Label>
      <BaseInputField
        {...rest}
        id={field.name}
        name={field.name}
        register={() => ({  
          onChange:handleOnChange,
          onBlur:handleOnBlur,
        })}
        value={{value: field.value}}
        showError={!form.isValid}
        size="lg"
        maxLength={maxLength}
      
      />

      {isFieldTouched && errorMessage && (
        <TextError errorMessage={errorMessage} />
      )}

    </div>
  );
}
