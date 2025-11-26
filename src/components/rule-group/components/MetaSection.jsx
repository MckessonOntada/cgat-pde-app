import React from 'react';
import { Field, useFormikContext } from 'formik';
import Components from '@src/components/form/Components';
import { Heading } from '@mckesson/mcp-component-library';
import style from './style.module.scss';

export default function MetaSection({ title, field }) {
  const { id, name, label, helper } = field;
  return (
    <div className={style.section}>
      <Heading as="h2">{title}</Heading>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <div>
          <Field {...{ id, name, name, label }} placeholder=" " isRequired component={Components['input']} maxLength={50} />
          <div className="control-helper-text">{helper}</div>
        </div>
      </div>
    </div>
  );
}
