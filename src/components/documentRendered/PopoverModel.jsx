import React, { useState } from 'react';
import Popover from '../app/popover';
import { TextareaInput, Button } from '@mckesson/mcp-component-library';

function PopoverModel({
  onSubmit,
  anchorEl,
  open,
  handleClose,
  textAreaLabel = '',
  description = '',
  submitButtonLabel = 'Submit',
  onReasonChange
}) {
  const [textAreaInput, setTextAreaInput] = useState('');

  const renderBody = (
    <>
      <div style={{ fontSize: '16px', fontWeight: 400, marginBottom: '16px' }}>{description}</div>
      <div style={{ marginBottom: '12px' }}>
        <TextareaInput
          id="popover-textarea-input"
          labelTemplate="thick"
          label={textAreaLabel}
          placeholder="Type something"
          maxCharLimit={5000}
          maxCharHelperText="Maximum 5,000 Characters"
          maxCharWarningLimit={4900}
          maxLimitReachedHelpertext="Character limit reached"
          onChangeFn={(val) => {
            onReasonChange(val);
            setTextAreaInput(() => val);
          }}
        />
        <br />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Button variant="secondary" size="md" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={() => onSubmit(textAreaInput)}>
          {submitButtonLabel}
        </Button>
      </div>
    </>
  );
  return <Popover open={open} anchorEl={anchorEl} handleClose={handleClose} content={renderBody} />;
}

export default PopoverModel;
