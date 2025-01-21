import React from 'react';
import { TextareaInput, Label, TextError, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

export default function Textarea(props) {
  const { id, label, value, error, isRequired, maxCharLimit = 1000, displayType = 'outline', onChange, onBlur, ...rest } = props;

  return (
    <div className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <TextareaInput
        id={id}
        name={id}
        onChangeFn={onChange}
        onBlurFn={onBlur}
        showError={!!error}
        displayType={displayType}
        maxCharLimit={maxCharLimit}
        value={value}
        {...rest}
      />
      {error && (
        <div style={{ marginTop: '-20px', display: 'inline-block' }}>
          <TextError errorMessage={error}></TextError>
        </div>
      )}
    </div>
  );
}
