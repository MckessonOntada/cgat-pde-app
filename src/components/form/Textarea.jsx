import { Label, TextareaInput, TextError } from '@mckesson/mcp-component-library';
import { useRef } from 'react';
import { highlightFieldOnLabelClick } from './util';

export default function Textarea(props) {
  const { id, label, labelControls, value, error, isRequired, maxCharLimit = 1000, displayType = 'outline', onChange, onBlur, ...rest } = props;
  const fieldContainerRef = useRef(null);

  return (
    <div className="grid" onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <div className="row-space-between-center">
        <Label htmlFor={id} className="label-heading">
          {label}
          {isRequired && <span className="required"> *</span>}
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
        minRows={3}
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
