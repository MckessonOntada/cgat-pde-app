import React, { useState } from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { CHANNEL_TYPE, FormList, ORDER_STAGES } from './Constants';
import { useNavigate, useParams } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';
import style from './OrderStepper.module.scss';
import useOrder from '../../orders/useOrder';

function OrderStepper({ status, patientDetailsRequired = false, channelType }) {
  const { t } = useTranslate();
  const forms = React.useMemo(() => {
    const stageNames = [
      ORDER_STAGES.THERAPY_SELECTION,
      ORDER_STAGES.ACCOUNT_SELECTION
    ];
    debugger;
    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      stageNames.push(ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS);
      stageNames.push(ORDER_STAGES.PAYER_DETAILS);
    } else if (patientDetailsRequired) {
      stageNames.push(ORDER_STAGES.PATIENT_DETAILS);
    }

    stageNames.push(
      ORDER_STAGES.ADDITIONAL_DETAILS,
      ORDER_STAGES.ORDER_SUMMARY
    );

    const steps = stageNames.map((stage, index) => ({
      id: CommonUtils.generateUniqueCode(stage),
      order: index + 1,
      name: stage,
      label: t(`stepper.label.${stage}`)
    }));
    return steps;
  }, [channelType, patientDetailsRequired]);

  const navigate = useNavigate();

  const filteredStepperItems = forms.filter((form) => {
    if (!patientDetailsRequired && form.name === ORDER_STAGES.PATIENT_DETAILS) {
      return false;
    }
    return true;
  });

  const currentStage = {
    THERAPY_SELECTION: 1,
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

  const handleOnStepClick = (e) => {
    const nearestListItem = e.target.closest('li');
    if (nearestListItem) {
      const ulElement = nearestListItem.parentElement;
      const index = Array.from(ulElement.children).indexOf(nearestListItem) + 1;

      if (index > 0 && index !== activeIndex) {
        e.preventDefault();
        const newState = Object.keys(currentStage).find(
          (key) => currentStage[key] === index
        );
        if (currentStage[newState] < currentStage[status]) {
          if (index === 1) navigate(`/orders/edit-order/${orderId}`);
          else {
            const navLink = {
              ACCOUNT_DETAILS: `/orders/${orderId}/accounts`,
              PATIENT_DETAILS: `/orders/${orderId}/patient`,
              ADDITIONAL_DETAILS: `/orders/${orderId}/additional-details`,
              ORDER_SUMMARY: `/orders/${orderId}/summary`
            }[newState];
            navigate(navLink);
          }
        }
      }
    }
  };

  return (
    <div className={style['custom-order-stepper']} onClick={handleOnStepClick}>
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
