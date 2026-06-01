import React from 'react';
import { RadioGroup as BaseRadioGroup, Label, TextError } from '@mckesson/mcp-component-library';

export default function RadioGroup(props) {
  const { field, form, isRequired, caption, onChangeValue, ...rest } = props;
  const fieldMeta = form.getFieldMeta(field.name);
  const isTouched = fieldMeta.touched || form.submitCount > 0;
  const error = isTouched ? fieldMeta.error : null;
  return (
    <div className="radio-button-wrapper">
      <Label className="label-heading">
        {caption}
        {isRequired && <span className="required"> *</span>}
      </Label>
      <div>
        <BaseRadioGroup error={!!error} onChangeValue={(value) => form.setFieldValue(field.name, value)} value={field.value} {...rest} />
        {error && <TextError errorMessage={error} />}
      </div>
    </div>
  );
}
