import React from 'react';
import { useFormikContext, Field } from 'formik';
import StepHeader from '../StepHeader';
import CardSelector from '../CardSelector';
import Components from '@src/components/form/Components';
import { ReactComponent as BuyAndBillIcon } from '@src/assets/svg/buy-and-bill.svg';
import { ReactComponent as OrderIcon } from '@src/assets/svg/order-outlined.svg';
import { useTranslate } from '@src/translations/useTranslation';
import OrderService from '@src/api/commonService/OrderService';

const OrderIssueForm = ({ therapyOptions, setTherapyQuery, isFetching }) => {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();
  const [accountOptions, setAccountOptions] = React.useState([]);
  const [loadingAccounts, setLoadingAccounts] = React.useState(false);

  const selectedTherapy = values.selectedTherapy;
  const isCrosswalked = selectedTherapy?.isCrosswalked ?? false;
  const orderingChannels = [
    { id: 'BUY_AND_BILL', label: t('labels.BUY_AND_BILL'), icon: BuyAndBillIcon },
    { id: 'SPECIALITY_PHARMA', label: t('labels.SPECIALITY_PHARMACY'), icon: OrderIcon }
  ];

  React.useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedTherapy?.ndc) {
        setAccountOptions([]);
        return;
      }

      if (selectedTherapy.isCrosswalked && !values.orderingChannel) {
        setAccountOptions([]);
        return;
      }

      try {
        setLoadingAccounts(true);

        let query = '';

        if (selectedTherapy.isCrosswalked) {
          query = new URLSearchParams({
            channelType: values.orderingChannel,
            ndcChannelType: selectedTherapy.channelType
          }).toString();
        } else if (!selectedTherapy.isCrosswalked) {
          query = new URLSearchParams({
            channelType: selectedTherapy.channelType,
            ndcChannelType: selectedTherapy.channelType
          }).toString();
        }
        const response = await OrderService.getSoldToAccounts(selectedTherapy.ndc, query);

        const options = (response?.content || []).map((account) => ({
          value: account.id,
          label: account.accountName
        }));

        setAccountOptions(options);
      } catch (err) {
        console.error(err);
        setAccountOptions([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [selectedTherapy, values.orderingChannel]);

  return (
    <div className="order-issue-form">
      <div style={{ marginBottom: '24px' }}>
        <StepHeader step={2} title={t('contactUs.selectTherapy')} />
        <Field
          component={Components['multiSelectDropdown']}
          name="therapy"
          label=" "
          isMultiSelect={false}
          placeholder={t('contactUs.selectOption')}
          options={therapyOptions}
          value={values.therapy}
          onChange={(value) => {
            const selected = therapyOptions.find((t) => String(t.value) === String(value));

            if (!selected) {
              return;
            }

            setFieldValue('therapy', value);
            setFieldValue('selectedTherapy', selected, false);

            setFieldValue('orderingChannel', '');
            setFieldValue('account', '');
            setFieldValue('description', '');
            setAccountOptions([]);
          }}
          variant="async"
          onSearch={setTherapyQuery}
          recordsCountToEnableSearch={3}
          size="lg"
          isAsyncLoading={isFetching}
          asyncRecordsFound={therapyOptions.length}
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
              setFieldValue('description', '');
              setAccountOptions([]);
            }}
          />
        </div>
      )}

      {values.therapy && (!isCrosswalked || values.orderingChannel) && (
        <div style={{ marginBottom: '24px' }}>
          <StepHeader step={isCrosswalked ? 4 : 3} title={t('contactUs.selectAccount')} />
          <Field name="account" component={Components.dropdown} placeholder={t('contactUs.selectOption')} options={accountOptions} />
        </div>
      )}
    </div>
  );
};

export default OrderIssueForm;
