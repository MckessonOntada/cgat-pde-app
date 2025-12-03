import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import { Field, useFormikContext } from 'formik';
import MultiSelectDropdown from '../inputs/MultiSelectDropdown';
import style from './style.module.scss';

export default function ParticipantSelector({ title, field }) {
  const { id, name, pillListerFn, label, searchFn, placeholder, isRequired, helperText, isMultiSelect, pillsCount } = field;

  const { values, setFieldValue } = useFormikContext();
  const participants = values[name] || [];

  const handleOnRemove = (removeId) => {
    setFieldValue(
      name,
      participants.filter((item) => item.value != removeId)
    );
  };

  return (
    <div className="participant-selector">
      <div className={style.section}>
        <Heading as="h2">{title}</Heading>

        <div>
          <div className="grid grid-gap-24 grid-cols-1">
            <Field
              id={id}
              name={name}
              label={label}
              placeholder={placeholder}
              isRequired={isRequired}
              searchFn={searchFn}
              component={MultiSelectDropdown}
              onRemoveClick={handleOnRemove}
              noSelectedCountMessage={placeholder}
              pillsLabels={pillListerFn ? participants.map(pillListerFn) : []}
              pillsCount={pillsCount}
              isPillsVisible
              variant="async"
              recordsCountToEnableSearch={5}
              size="lg"
              isMultiSelect={isMultiSelect}
            />
          </div>

          <div className="control-helper-text">{helperText}</div>
        </div>
      </div>
    </div>
  );
}
