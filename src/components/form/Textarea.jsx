import React from 'react';
import { TextareaInput, Label, TextError, Required } from '@mckesson/mcp-component-library';

export default function Textarea(props) {
  const {
    id,
    label,
    labelControls,
    value,
    error,
    isRequired,
    maxCharLimit = 1000,
    displayType = 'outline',
    onChange,
    onBlur,
    ...rest
  } = props;

  return (
    <div className="grid">
      <div className="row-space-between-center">
        <Label htmlFor={id} className="label-heading">
          {label}
          {isRequired && <Required id="Required">Required</Required>}
        </Label>
        {labelControls}
      </div>
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
