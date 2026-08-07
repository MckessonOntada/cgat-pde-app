import React from 'react';
import styles from './index.module.scss';
import { contactReasons } from '../constants';
import { Button } from '@mckesson/mcp-component-library';
import { useFormikContext } from 'formik';
import StepHeader from '../StepHeader';
import { useTranslate } from '@src/translations/useTranslation';

export function TabSelection({ alert, setAlert, isAuthenticated }) {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  const handleClick = (reason) => {
    setFieldValue('reason', reason);
    setFieldValue('affectedModule', '');
    setFieldValue('selectedTherapy', null);
    setFieldValue('selectedAccount', null);
    setFieldValue('therapy', '');
    setFieldValue('ndcNumber', '');
    setFieldValue('orderingChannel', '');
    setFieldValue('account', '');
    setFieldValue('description', '');

    if (!isAuthenticated) {
      if (reason === 2) {
        setAlert({
          type: 'warning',
          key: 'LOGIN_REQUIRED',
          description: t('contactUs.loginRequired.orderAlertMessage')
        });
      } else if (reason === 3) {
        setAlert({
          type: 'warning',
          key: 'LOGIN_REQUIRED',
          description: t('contactUs.loginRequired.invoiceAlertMessage')
        });
      } else {
        setAlert(null);
      }

      return;
    }

    if (alert?.key === 'NO_ACCOUNTS' || reason === 1) {
      setAlert(null);
    }
  };

  const availableReasons = React.useMemo(() => {
    if (isAuthenticated) {
      return contactReasons;
    }

    return contactReasons.filter((reason) => reason.id !== 4);
  }, [isAuthenticated]);

  return (
    <div className={styles.tabSelection}>
      <StepHeader step={isAuthenticated ? 1 : 2} title={t('contactUs.reasonForContact')} />

      <div className={styles.tabSelectionMenu}>
        {availableReasons.map((reason) => {
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
