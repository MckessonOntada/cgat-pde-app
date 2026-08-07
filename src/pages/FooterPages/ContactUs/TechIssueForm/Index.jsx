import React from 'react';
import { useFormikContext } from 'formik';
import { techIssueOptions } from '../constants';
import CardSelector from '../CardSelector';
import { useTranslate } from '@src/translations/useTranslation';

const TechIssueForm = ({ step, title }) => {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  return (
    <CardSelector step={step} title={title} options={techIssueOptions} value={values.affectedModule} onChange={(val) => setFieldValue('affectedModule', val)} />
  );
};

export default TechIssueForm;
