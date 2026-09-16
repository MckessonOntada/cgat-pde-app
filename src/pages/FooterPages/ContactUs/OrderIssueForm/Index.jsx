import React from 'react';
import styles from '../ContactUs.module.scss';
import { useFormikContext, Field } from 'formik';
import StepHeader from '../StepHeader';
import CardSelector from '../CardSelector';
import Components from '@src/components/form/Components';
import { ReactComponent as BuyAndBillIcon } from '@src/assets/svg/buy-and-bill.svg';
import { ReactComponent as OrderIcon } from '@src/assets/svg/order-outlined.svg';
import { useTranslate } from '@src/translations/useTranslation';
import OrderService from '@src/api/commonService/OrderService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import useTherapies from '../useTherapies';
import AccountService from '@src/api/commonService/AccountService';

const CHANNEL_ICON_MAP = {
  BUY_AND_BILL: BuyAndBillIcon,
  SPECIALITY_PHARMA: OrderIcon
};

const CHANNEL_LABEL_MAP = {
  BUY_AND_BILL: 'labels.BUY_AND_BILL',
  SPECIALITY_PHARMA: 'labels.SPECIALITY_PHARMACY'
};

const OrderIssueForm = ({ reason, setAlert, alert }) => {
  const { t } = useTranslate();
  const [therapyQuery, setTherapyQuery] = React.useState('');
  const { therapyOptions, therapyTotalElements, isFetching, isFetched, isError: therapyApiError } = useTherapies(therapyQuery, reason, setAlert);
  const [accountQuery, setAccountQuery] = React.useState('');
  const isSystemAdminView = AuthUtils.isSystemAdmin() || AuthUtils.isCustomerCenter() || AuthUtils.isTreatmentCentreExecutive();
  const { values, setFieldValue } = useFormikContext();
  const selectedTherapy = values.selectedTherapy;
  const isCrosswalked = selectedTherapy?.isCrosswalked ?? false;

  const {
    data: channelConfigData,
    isFetching: loadingChannelConfig,
    isError: channelConfigError
  } = useQuery({
    queryKey: ['program-channel-config', selectedTherapy?.ndc],
    enabled: !!selectedTherapy?.ndc && isCrosswalked,
    queryFn: async () => OrderService.getProgramAndChannelConfig(selectedTherapy.ndc, {}),
    onError: () => {
      setAlert({
        type: 'error',
        key: 'CHANNEL_CONFIG_ERROR',
        description: 'errors.default'
      });
    },
    keepPreviousData: false
  });

  React.useEffect(() => {
    if (!isCrosswalked || !channelConfigData) return;
    setFieldValue('channelConfig', channelConfigData, false);
    const channels = channelConfigData.channels || [];
    if (channels.length === 1) {
      setFieldValue('orderingChannel', channels[0]);
    }
  }, [channelConfigData, isCrosswalked]);

  const availableChannels = channelConfigData?.channels || [];
  const showOrderingChannelStep = isCrosswalked && !loadingChannelConfig && availableChannels.length > 1;

  const orderingChannelOptions = availableChannels.map((channel) => ({
    id: channel,
    label: t(CHANNEL_LABEL_MAP[channel] || channel),
    icon: CHANNEL_ICON_MAP[channel] || OrderIcon
  }));

  const {
    data: accountResponse,
    isFetching: loadingAccounts,
    isFetched: accountFetched,
    isError: accountApiError
  } = useQuery({
    queryKey: ['sold-to-accounts', isSystemAdminView, selectedTherapy?.ndc, selectedTherapy?.channelType, values.orderingChannel, accountQuery],
    enabled: !!selectedTherapy?.ndc && (!isCrosswalked || !!values.orderingChannel),

    queryFn: async () => {
      if (isSystemAdminView) {
        const requestParams = {
          pageNo: 0,
          pageSize: 20,
          practiceId: 'all',
          allAccounts: true,
          partnerFunction: 'SOLD_TO',
          channelType: isCrosswalked ? values.orderingChannel : 'ALL'.toString(),
          ...(accountQuery && { query: accountQuery })
        };
        return await AccountService.getAccountList(requestParams, 0);
      }

      let query = '';

      if (selectedTherapy.isCrosswalked) {
        query = new URLSearchParams({
          channelType: values.orderingChannel,
          ndcChannelType: selectedTherapy.channelType,
          ...(accountQuery && { query: accountQuery })
        }).toString();
      } else {
        query = new URLSearchParams({
          channelType: selectedTherapy.channelType,
          ndcChannelType: selectedTherapy.channelType,
          ...(accountQuery && { query: accountQuery })
        }).toString();
      }

      return await OrderService.getSoldToAccounts(selectedTherapy.ndc, query);
    },
    onError: () => {
      setAlert({
        type: 'error',
        key: 'ACCOUNT_API_ERROR',
        description: 'errors.default'
      });
    },

    keepPreviousData: false
  });

  const accountOptions = (accountResponse?.content || []).map((account) => {
    const salesOrg = String(account.salesOrg || '').toUpperCase();

    return {
      value: String(account.id),
      label: account.accountNumber ? `${account.accountNumber} - ${account.accountName}` : account.accountName,
      salesOrg:
        salesOrg === '1100' || salesOrg === '2'
          ? '3PL'
          : salesOrg === '1000' || salesOrg === '1010'
          ? 'SD'
          : salesOrg === '3PL' || salesOrg === 'SD'
          ? salesOrg
          : null
    };
  });

  const noTherapies = !therapyApiError && isFetched && !isFetching && therapyQuery.trim() === '' && therapyOptions.length === 0;
  const shouldShowAccounts = values.therapy && (!isCrosswalked || values.orderingChannel) && !!accountResponse;
  const noAccounts = !accountApiError && shouldShowAccounts && accountFetched && !loadingAccounts && accountQuery.trim() === '' && accountOptions.length === 0;

  React.useEffect(() => {
    if (isFetching || loadingAccounts) {
      return;
    }

    if (noTherapies) {
      setAlert({
        type: 'error',
        key: 'NO_THERAPIES',
        description: 'contactUs.noTherapies.alertMessage'
      });

      return;
    }

    if (noAccounts) {
      setAlert({
        type: 'error',
        key: 'NO_ACCOUNTS',
        description: 'contactUs.noAccounts.alertMessage'
      });
    }
  }, [isFetching, loadingAccounts, noTherapies, noAccounts]);

  const accountStep = showOrderingChannelStep ? 4 : 3;

  return (
    <div className="order-issue-form">
      <div className={styles.formSectionGap}>
        <StepHeader step={2} title={t('contactUs.selectTherapy')} />
        <Field
          key={values.therapy}
          component={Components['multiSelectDropdown']}
          name="therapy"
          label=" "
          isMultiSelect={false}
          placeholder={t('contactUs.selectOption')}
          options={therapyOptions}
          value={values.therapy}
          onChange={(value) => {
            if (alert?.key === 'NO_ACCOUNTS' || alert?.key === 'ACCOUNT_API_ERROR' || alert?.key === 'SUBMIT_ERROR' || alert?.key === 'CHANNEL_CONFIG_ERROR') {
              setAlert(null);
            }
            const selected = therapyOptions.find((t) => String(t.value) === String(value));

            if (!selected) return;
            setFieldValue('therapy', value);
            setFieldValue('ndcNumber', selected?.ndc || '');
            setFieldValue('selectedTherapy', selected, false);
            setFieldValue('orderingChannel', '');
            setFieldValue('account', '');
            setFieldValue('description', '');
            setFieldValue('selectedAccount', null, false);
            setFieldValue('channelConfig', null, false);
          }}
          variant="async"
          onSearch={setTherapyQuery}
          recordsCountToEnableSearch={19}
          size="lg"
          isAsyncLoading={isFetching}
          asyncRecordsFound={therapyTotalElements}
        />
      </div>

      {values.therapy && showOrderingChannelStep && (
        <div className={styles.formSectionGap}>
          <CardSelector
            step={3}
            title={t('contactUs.orderingChannel')}
            options={orderingChannelOptions}
            value={values.orderingChannel}
            onChange={(val) => {
              if (alert?.key === 'NO_ACCOUNTS') {
                setAlert(null);
              }
              setFieldValue('orderingChannel', val);
              setFieldValue('account', '');
              setFieldValue('description', '');
              setAccountQuery('');
            }}
          />
        </div>
      )}

      {values.therapy && (!isCrosswalked || values.orderingChannel) && (
        <div className={styles.formSectionGap}>
          <StepHeader step={accountStep} title={t('contactUs.selectAccount')} />
          <Field
            component={Components['multiSelectDropdown']}
            name="account"
            label=" "
            isMultiSelect={false}
            placeholder={t('contactUs.selectOption')}
            options={accountOptions}
            value={values.account.toString()}
            onChange={(value) => {
              const selected = accountOptions.find((account) => String(account.value) === String(value));
              setFieldValue('account', selected?.label ?? value);

              setFieldValue('selectedAccount', selected, false);
              setFieldValue('description', '');
            }}
            variant="async"
            onSearch={setAccountQuery}
            isAsyncLoading={loadingAccounts}
            asyncRecordsFound={accountResponse?.totalElements ?? 0}
            recordsCountToEnableSearch={19}
          />
        </div>
      )}
    </div>
  );
};

export default OrderIssueForm;
