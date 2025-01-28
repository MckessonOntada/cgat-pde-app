import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import Textarea from '../Textarea';
import { getNestedValue } from '../util';

export default function TextareaFormik(props) {
  const { field, form, fieldlabel, labelControls, isRequired, maxCharLimit, isReadOnly, onChange } = props;
  const { t } = useTranslate();
  const { name, onBlur } = field;

  const { errors, touched, setFieldValue } = form;
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);

  return (
    <Textarea
      name={name}
      label={fieldlabel}
      labelControls={labelControls}
      onChangeFn={onChange ? onChange : (value) => setFieldValue(name, value)}
      onBlurFn={onBlur}
      isRequired={isRequired}
      error={isFieldTouched && errorMessage}
      displayType={'outline'}
      isReadOnly={isReadOnly}
      maxCharLimit={maxCharLimit}
      {...field}
    />
  );
}
