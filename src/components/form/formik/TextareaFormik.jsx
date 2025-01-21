import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import Textarea from '../Textarea';

export default function TextareaFormik(props) {
  const { field, form, fieldlabel, isRequired, maxCharLimit, isReadOnly } = props;
  const { t } = useTranslate();
  const { name, onBlur } = field;
  const { setFieldValue, touched, errors } = form;

  return (
    <Textarea
      name={name}
      label={fieldlabel}
      onChangeFn={(value) => setFieldValue(name, value)}
      onBlurFn={onBlur}
      isRequired={isRequired}
      error={touched[name] && errors[name] ? t(errors[name]) : ''}
      displayType={'outline'}
      isReadOnly={isReadOnly}
      maxCharLimit={maxCharLimit}
      {...field}
    />
  );
}
