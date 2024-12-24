import React from 'react';
import { Stepper } from '@mckesson/mcp-component-library';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import { FormList } from './Constants';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';

function OrderStepper() {
  const { t } = useTranslate();
  const { formState, currentStage } = useManageOrder();
  const forms = FormList(t);

  React.useEffect(() => {
    const { patientDetailsRequired = false } = formState.activeRecord || {};
  }, [formState.activeRecord]);

  const currentOrderStage = ORDER_STAGES[formState.activeRecord?.currentStage] || 0;

  return (
    <Stepper
      activeIndex={currentStage + 1}
      dividerText="of"
      mobileLabel={t('labels.steps')}
      stepHeaders={forms.map((f) => ({ label: f.label }))}
    />
  );
}

export default OrderStepper;
