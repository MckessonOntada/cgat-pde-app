import React, { useState } from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import { FormList } from './Constants';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';

function OrderStepper() {
  const { t } = useTranslate();
  const { formState, currentStage } = useManageOrder();
  const [patientDetailsRequired, setPatientDetailsRequired] = useState(false);
  const forms = FormList(t);

  React.useEffect(() => {
    setPatientDetailsRequired(formState.activeRecord?.patientDetailsRequired ?? false);
  }, [formState.activeRecord]);

  const currentOrderStage = ORDER_STAGES[formState.activeRecord?.currentStage] || 0;

  const filteredStepperItems = forms.filter((form) => {
    if (!patientDetailsRequired && form.name === 'patientDetails') {
      return false;
    }
    return true;
  });

  return (
    <Stepper
      activeIndex={patientDetailsRequired ? currentStage + 1 : currentStage}
      dividerText="of"
      mobileLabel={t('labels.steps')}
      stepHeaders={filteredStepperItems.map((f) => ({ label: f.label }))}
    />
  );
}

export default OrderStepper;
