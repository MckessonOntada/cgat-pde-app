import React from 'react';
import { TextareaInput,Label,TextError,Required } from '@mckesson/mcp-component-library';

export default function Textarea(props) {
  const { field, form, fieldlabel } = props;
  console.log('form',form);
  return (
    <div className="grid">
      <Label htmlFor={field.name} className="label-heading">
        {fieldlabel}
        {props.isRequired && <Required id="Required">Required</Required>}
      </Label>
      <TextareaInput
        {...props}
        {...field}
        onChangeFn={value => form.setFieldValue(field.name, value)}
        onBlurFn={field.onBlur}
        errors={form.errors}
        errorMessage={form.error}
        showError={!form.isValid}
        displayType={'outline'}
        maxCharLimit={props.maxCharLimit || 1000}
      />
      {form.errors[field.name] && form.touched[field.name] && (
         <TextError errorMessage={form.error}></TextError> 
      )}
     
    </div>
  );
}
