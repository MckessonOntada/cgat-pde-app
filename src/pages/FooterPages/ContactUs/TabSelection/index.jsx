import React from 'react';
import styles from './index.module.scss';
import { contactReasons } from '../constants';
import { Button } from '@mckesson/mcp-component-library';
import { useFormikContext } from 'formik';
import StepHeader from '../StepHeader';
import { useTranslate } from '@src/translations/useTranslation';

export function TabSelection({ alert, setAlert }) {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  const handleClick = (reason) => {
    if (alert?.key === 'NO_ACCOUNTS' || reason === 1) {
      setAlert(null);
    }
    setFieldValue('reason', reason);
    setFieldValue('affectedModule', '');
    setFieldValue('selectedTherapy', null);
    setFieldValue('selectedAccount', null);
    setFieldValue('therapy', '');
    setFieldValue('ndcNumber', '');
    setFieldValue('orderingChannel', '');
    setFieldValue('account', '');
    setFieldValue('description', '');
  };

  return (
    <div className={styles.tabSelection}>
      <StepHeader step={1} title={t('contactUs.reasonForContact')} />

      <div className={styles.tabSelectionMenu}>
        {contactReasons.map((reason) => {
          const isActive = values.reason === reason.id;

          return (
            <Button
              key={reason.id}
              Icon={reason.Icon}
              className={`${styles.tabSelectionOption} ${isActive ? styles.tabSelectionOptionActive : ''}`}
              variant="secondary"
              onClick={() => handleClick(reason.id)}
              size="md">
              {t(reason.label)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
