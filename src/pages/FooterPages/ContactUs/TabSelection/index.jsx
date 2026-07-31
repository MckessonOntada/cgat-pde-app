import React from 'react';
import './index.scss';
import { contactReasons } from '../constants';
import { Button } from '@mckesson/mcp-component-library';
import { useFormikContext } from 'formik';
import StepHeader from '../StepHeader';
import { useTranslate } from '@src/translations/useTranslation';

export function TabSelection() {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  const handleClick = (reason) => {
    setFieldValue('reason', reason);
    setFieldValue('affectedModule', '');
    setFieldValue('selectedTherapy', null);
    setFieldValue('therapy', '');
    setFieldValue('orderingChannel', '');
    setFieldValue('account', '');
    setFieldValue('description', '');
  };

  return (
    <div className="tab-selection">
      <StepHeader step={1} title={t('contactUs.reasonForContact')} />

      <div className="tab-selection__menu">
        {contactReasons.map((reason) => {
          const isActive = values.reason === reason.id;

          return (
            <Button
              key={reason.id}
              Icon={reason.Icon}
              className={`tab-selection__option ${isActive ? 'tab-selection__option--active' : ''}`}
              variant="secondary"
              onClick={() => handleClick(reason.id)}
              size="md">
              {reason.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
