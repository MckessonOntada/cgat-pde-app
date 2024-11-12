import React, { useEffect } from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library'; 
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function InputField(props) {
  const { field, form, children, className, label, ...rest } = props;

  const { initialValues } = form;

  // To set the Value for field. There is no name Present in Input Component
  const handleOnChange = (event) => {
   form.setFieldValue(`${field.name}`,event.target.value); 
  };

  // To set initial value
  useEffect(() => {
    if(!!initialValues[field.name]){
      form.setFieldValue(`${field.name}`,event.target.value); 
    }
  },[initialValues])
  
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
        onChangeFn={handleOnChange}
        register={() => ({
          onChange: handleOnChange,
          onBlur: field.onBlur,
        })}
        showError={!form.isValid}
        size="lg"
      />
      <div className='error-placeholder'>
      {
        // input- is appended to name in ui-components library for touched fields. If submitted then no input- is appended
        (form.touched[`input-${field.name}`] || form.touched[field.name])  && <TextError errorMessage={form.errors[field.name]} />
      }
      </div>
    </div>
  );
}
