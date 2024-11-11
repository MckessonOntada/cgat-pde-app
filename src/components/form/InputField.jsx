import React from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library'; 
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function InputField(props) {
  const { field, form, children, className, label, maxLength, ...rest } = props; 
  
  // To set the Value for field. There is no name Present in Input Component
  const handleOnChange = (event) => {
   form.setFieldValue(`${field.name}`,event.target.value); 
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
        value={field.value}
        register={() => ({
          onChange: handleOnChange,
          onBlur: handleOnBlur,
        })}
        showError={!form.isValid}
        size="lg"
        maxLength={maxLength} 
      />
      {
        // input- is appended to name in ui-components library for touched fields. If submitted then no input- is appended
        (form.touched[`input-${field.name}`] || form.touched[field.name])  && <TextError errorMessage={form.errors[field.name]} />
      }
    </div>
  );
}
