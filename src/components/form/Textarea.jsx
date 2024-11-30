import React from 'react';
import { TextareaInput, Label, TextError, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

export default function Textarea(props) {
  const { field, form, fieldlabel } = props;
  const { t } = useTranslate();

  return (
    <div className="grid">
      <Label htmlFor={field.name} className="label-heading">
        {fieldlabel}
        {props.isRequired && <Required id="Required">Required</Required>}
      </Label>
      <TextareaInput {...props} {...field} onChangeFn={(value) => form.setFieldValue(field.name, value)} onBlurFn={field.onBlur} showError={!form.isValid} displayType={'outline'} maxCharLimit={props.maxCharLimit || 1000} />
      {form.errors[field.name] && form.touched[field.name] && (
        <div style={{ marginTop: '-20px', display: 'inline-block' }}>
          <TextError errorMessage={t(form.errors[field.name])}></TextError>{' '}
        </div>
      )}
    </div>
  );
}
