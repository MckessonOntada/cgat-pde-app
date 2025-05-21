import React, { useState } from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { CHANNEL_TYPE, FormList, ORDER_STAGES } from './Constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';
import style from './OrderStepper.module.scss';

function OrderStepper({ status, patientDetailsRequired = false, channelType }) {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navLinks = React.useMemo(() => {
    return {
      ACCOUNT_DETAILS: `/orders/${orderId}/accounts`,
      PATIENT_DETAILS: `/orders/${orderId}/patient`,
      'PATIENT_&_PROVIDER_DETAILS': `/orders/${orderId}/patient`,
      PAYER_DETAILS: `/orders/${orderId}/payer`,
      ADDITIONAL_DETAILS: `/orders/${orderId}/additional-details`,
      ORDER_SUMMARY: `/orders/${orderId}/summary`
    };
  }, []);
  const forms = React.useMemo(() => {
    const stageNames = [ORDER_STAGES.THERAPY_SELECTION, ORDER_STAGES.ACCOUNT_DETAILS];
    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      stageNames.push(ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS);
      stageNames.push(ORDER_STAGES.PAYER_DETAILS);
    } else if (patientDetailsRequired) {
      stageNames.push(ORDER_STAGES.PATIENT_DETAILS);
    }

    stageNames.push(ORDER_STAGES.ADDITIONAL_DETAILS, ORDER_STAGES.ORDER_SUMMARY);

    const steps = stageNames.map((stage, index) => ({
      id: CommonUtils.generateUniqueCode(stage),
      order: index + 1,
      name: stage,
      label: t(`stepper.label.${stage}`)
    }));
    return steps;
  }, [channelType, patientDetailsRequired]);

  const navigate = useNavigate();
  const location = useLocation();

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
    'PATIENT_&_PROVIDER_DETAILS': 3,
    PATIENT_AND_PROVIDER_DETAILS: 3,
    PAYER_DETAILS: 4,
    ADDITIONAL_DETAILS: 5,
    ORDER_SUMMARY: 6
  };

  if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && status === ORDER_STAGES.PATIENT_DETAILS) status = ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS;

  const activeIndex = filteredStepperItems.find((step) => step.name === status)?.order || 1;

  const handleOnStepClick = (e) => {
    const nearestListItem = e.target.closest('li');
    if (nearestListItem) {
      const stepItemTitle = nearestListItem.querySelector('[class*="Stepper-module--stepsItemTitle"]');
      if (stepItemTitle) {
        let stepByTitle = stepItemTitle.innerText?.toUpperCase().split(' ').join('_');
        if (stepByTitle === 'ACCOUNT_SELECTION') stepByTitle = ORDER_STAGES.ACCOUNT_DETAILS;
        if (stepByTitle) {
          if (currentStage[stepByTitle] <= currentStage[status]) {
            const newNavLink = navLinks[stepByTitle];
            if (currentStage[status] > 1 && stepByTitle === 'THERAPY_SELECTION')
              navigate(`/orders/edit-order/${orderId}`, {
                state: { fromTab: location?.state?.fromTab }
              });
            else {
              navigate(newNavLink, {
                state: { fromTab: location?.state?.fromTab }
              });
            }
          }
        }
      }
    }
  };

  return (
    <div className={style['custom-order-stepper']} onClick={handleOnStepClick}>
      <Stepper activeIndex={activeIndex} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={filteredStepperItems.map((f) => ({ label: f.label }))} />
    </div>
  );
}

export default OrderStepper;
