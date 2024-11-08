import React from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library'; 
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function InputField(props) {
  const { field, form, children, className, label, ...rest } = props;
  const { t } = useTranslate();
  console.log('form.errors',form.errors, form.touched) 
  console.log ('field.name',field.name);

  const filteredErrors = Object.keys(form.errors)
  .filter(key => form.touched[`input-${key}`] || form.touched[key])  // Only include errors for fields that have been touched
  .reduce((acc, key) => {
    acc[key] = form.errors[key];
    return acc;
  }, {});

console.log('Filtered Errors:', filteredErrors);
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
          onBlur: field.onBlur,
        })}
        errors={filteredErrors}
       // errorMessage={filteredErrors[field.name]}
        showError={!form.isValid}
        size="lg"
      />
      
      {filteredErrors[field.name]  && (
        <TextError errorMessage={form.errors[field.name]} /> 
      )}

      {!filteredErrors[field.name] && (
        <TextError className="error-placeholder" />
      )}
      
    </div>
  );
}
