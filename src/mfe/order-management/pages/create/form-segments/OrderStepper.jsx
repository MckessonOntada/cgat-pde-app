import React from 'react';
import { StepperMui } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { CHANNEL_TYPE, ORDER_STAGES } from './Constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';
import style from './OrderStepper.module.scss';
import { RoutePaths } from '@src/routes/constants';

function OrderStepper({ status, patientDetailsRequired = false, channelType }) {
  const { t } = useTranslate();
  const { orderId } = useParams();

  const navLinks = React.useMemo(() => {
    const baseRoute = RoutePaths.pathOrderManagement;
    return {
      ACCOUNT_DETAILS: `${baseRoute}/create/${orderId}/account-details`,
      PATIENT_DETAILS: `${baseRoute}/create/${orderId}/patient-details`,
      PATIENT_AND_PROVIDER_DETAILS: `${baseRoute}/create/${orderId}/patient-details`,
      PAYER_DETAILS: `${baseRoute}/create/${orderId}/payer-details`,
      ADDITIONAL_DETAILS: `${baseRoute}/create/${orderId}/additional-details`,
      ORDER_SUMMARY: `${baseRoute}/create/${orderId}/summary`
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
  const locationState = location?.state ?? {};
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

  const handleOnStepClick = (i) => {
    const { name: stepByTitle } = filteredStepperItems[i - 1];
    if (stepByTitle === 'ACCOUNT_SELECTION') stepByTitle = ORDER_STAGES.ACCOUNT_DETAILS;

    if (stepByTitle) {
      if (currentStage[stepByTitle] <= currentStage[status]) {
        const newNavLink = navLinks[stepByTitle];
        if (currentStage[status] > 1 && stepByTitle === 'THERAPY_SELECTION')
          navigate(`${RoutePaths.pathOrderManagement}/edit/${orderId}`, {
            state: { ...locationState, isBack: true }
          });
        else {
          navigate(`${newNavLink}`, {
            state: { ...locationState }
          });
        }
      }
    }
  };

  return (
    <div className={style['custom-order-stepper']}>
      <div>
        <code
          style={{
            background: '#fff',
            padding: '8px',
            fontSize: '18px',
            lineHeight: '32px'
          }}>
          {JSON.stringify(location.state)}
        </code>
      </div>
      <StepperMui
        activeIndex={activeIndex}
        dividerText="of"
        mobileLabel={t('labels.steps')}
        stepHeaders={filteredStepperItems.map((f) => ({ label: f.label }))}
        onStepClick={handleOnStepClick}
      />
    </div>
  );
}

export default OrderStepper;
