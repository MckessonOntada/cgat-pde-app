import React from 'react';
import { useFormikContext } from 'formik';
import { techIssueOptions } from '../constants';
import CardSelector from '../CardSelector';
import { useTranslate } from '@src/translations/useTranslation';

const TechIssueForm = () => {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  return (
    <CardSelector
      step={2}
      title={t('contactUs.affectedModule')}
      options={techIssueOptions}
      value={values.affectedModule}
      onChange={(val) => setFieldValue('affectedModule', val)}
    />
  );
};

export default TechIssueForm;
