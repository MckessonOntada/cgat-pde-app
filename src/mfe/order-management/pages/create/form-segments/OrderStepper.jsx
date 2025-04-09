import React, { useState } from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { FormList, ORDER_STAGES } from './Constants';

function OrderStepper({ status, patientDetailsRequired = false }) {
  const { t } = useTranslate();
  const forms = FormList(t);
  const filteredStepperItems = forms.filter((form) => {
    if (!patientDetailsRequired && form.name === ORDER_STAGES.PATIENT_DETAILS) {
      return false;
    }
    return true;
  });

  const currentStage = {
    ACCOUNT_DETAILS: 2,
    PATIENT_DETAILS: 3,
    ADDITIONAL_DETAILS: 4,
    ORDER_SUMMARY: 5
  };

  if (!patientDetailsRequired) {
    if (status === ORDER_STAGES.PATIENT_DETAILS) {
      status = ORDER_STAGES.ADDITIONAL_DETAILS;
    }
    currentStage.PATIENT_DETAILS = -1;
    currentStage.ADDITIONAL_DETAILS = 3;
    currentStage.ORDER_SUMMARY = 4;
  }

  const activeIndex = currentStage[status] || 1;

  return (
    <div onClick={handleOnStepClick}>
      <Stepper
        activeIndex={activeIndex}
        dividerText="of"
        mobileLabel={t('labels.steps')}
        stepHeaders={filteredStepperItems.map((f) => ({ label: f.label }))}
      />
    </div>
  );
}

export default OrderStepper;
