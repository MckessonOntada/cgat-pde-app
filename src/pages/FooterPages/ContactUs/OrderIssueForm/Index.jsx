import React from 'react';
import { useFormikContext, Field } from 'formik';
import StepHeader from '../StepHeader';
import CardSelector from '../CardSelector';
import Components from '@src/components/form/Components';
import { ReactComponent as LinkedAccountsIcon } from '@src/assets/svg/linked_accounts.svg';
import { ReactComponent as OrderIcon } from '@src/assets/svg/order-outlined.svg';
import { therapyOptions } from '../constants';
import { useTranslate } from '@src/translations/useTranslation';

const accountOptions = [
  { label: '232312 - WINTERFELL CLINIC', value: '232312 - WINTERFELL CLINIC' },
  { label: '748392 - KING\'S LANDING HOSPITAL', value: '748392 - KING\'S LANDING HOSPITAL' },
  { label: '112233 - RIVENDELL MEDICAL CENTER', value: '112233 - RIVENDELL MEDICAL CENTER' }
];

const OrderIssueForm = () => {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  const selectedTherapy = therapyOptions.find((t) => t.value === values.therapy);
  const isCrosswalked = selectedTherapy ? selectedTherapy.isCrosswalked : false;

  const orderingChannels = [
    { id: 'BUY_AND_BILL', label: t('labels.BUY_AND_BILL'), icon: LinkedAccountsIcon },
    { id: 'SPECIALITY_PHARMA', label: t('labels.SPECIALITY_PHARMACY'), icon: OrderIcon }
  ];

  return (
    <div className="order-issue-form">
      <div style={{ marginBottom: '24px' }}>
        <StepHeader step={2} title={t('contactUs.selectTherapy')} />
        <Field
          name="therapy"
          component={Components.dropdown}
          placeholder={t('contactUs.selectOption')}
          options={therapyOptions}
          onChangeHandler={(val) => {
            setFieldValue('orderingChannel', '');
            setFieldValue('account', '');
          }}
        />
      </div>

      {values.therapy && isCrosswalked && (
        <div style={{ marginBottom: '24px' }}>
          <CardSelector
            step={3}
            title={t('contactUs.orderingChannel')}
            options={orderingChannels}
            value={values.orderingChannel}
            onChange={(val) => {
              setFieldValue('orderingChannel', val);
              setFieldValue('account', '');
            }}
          />
        </div>
      )}

      {values.therapy && (!isCrosswalked || values.orderingChannel) && (
        <div style={{ marginBottom: '24px' }}>
          <StepHeader step={isCrosswalked ? 4 : 3} title={t('contactUs.selectAccount')} />
          <Field
            name="account"
            component={Components.dropdown}
            placeholder={t('contactUs.selectOption')}
            options={accountOptions}
          />
        </div>
      )}
    </div>
  );
};

export default OrderIssueForm;
