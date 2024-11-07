import React from 'react';
import { InputField as BaseInputField, Label } from '@mckesson/mcp-component-library';
import { useTranslate } from '../../../../translations/useTranslation';

export default function InputField(props) {
  const { field, form, children, className, label, ...rest } = props;
  const { t } = useTranslate();
  return (
    <div style={{ display: 'grid' }}>
      <Label htmlFor={field.name} className="label-heading">
        {label}
        {props.isRequired ? <span className="requiredIcon">✱</span> : null}
      </Label>
      <BaseInputField
        {...rest}
        id={field.name}
        name={field.name}
        value={field.value}
        register={() => ({
          onChange: field.onChange,
          onBlur: field.onBlur
        })}
        errors={form.errors}
        errorMessage={form.errors[field.name]}
        showError={!form.isValid}
        size="lg"
      />
      {!form.errors[field.name] && form.touched[field.name] && (
        <TextError className="error-placeholder" />
      )}
    </div>
  );
}
