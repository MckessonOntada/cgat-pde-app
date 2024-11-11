import React from 'react';
import { TextareaInput } from '@mckesson/mcp-component-library';

export default function Textarea(props) {
  const { field, form } = props;
  return (
    <>
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
        <div style={{ color: 'red', fontSize: '20px', fontWeight: '500' }}>{form.errors[field.name]}</div>
      )}
    </>
  );
}
