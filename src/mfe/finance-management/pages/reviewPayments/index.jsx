import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import InfoCards from '@src/components/infoCards/InfoCards';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import SelectedInvoiceList from './SelectedInvoiceList';
import { useLocation, useNavigate } from 'react-router-dom';
import Credits from '../credits';
import { PaymentsCreditsProvider } from '../../context/PaymentsCreditsContext';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
// import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import ApiRoutes from '../../../../api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { FinanceUtils } from '@src/util/FinanceUtil';
import dayjs from 'dayjs';
import { RadioGroup } from '@src/components/radioGroup';

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { state } = location;
  const { includeinvoiceData } = state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount } = useAccountContext();
  const { showSnackbar } = useSnackbar();
  const [mergedData, setMergedData] = useState([]);
  const [selectedData, setSelectedData] = useState('');
  const [paymentOption, setPaymentOption] = useState('');

  const { data: paymentMethodsData = [], isError } = useQuery({
    queryKey: ['paymentMethodsreviewPayments'],
    queryFn: async () => {
      const url = `${ApiRoutes.PAYMENT_METHODS_LISTING(selectedAccount?.accountId)}`;
      const payload = {
        companyCode: selectedAccount?.companyCode,
        salesOrg: selectedAccount?.salesOrg,
        payerAccountNumber: selectedAccount?.accountNumber
      };
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      return res.data;
    },
    enabled: !!selectedAccount?.id,
    onError: (error) => {
      if (CommonUtils.isNonEmptyObject(error)) {
        showSnackbar({ description: t('paymentInvoices.paymentMethods.api.error'), type: 'error' });
      }
    }
  });

  useEffect(() => {
    if (paymentMethodsData.cards || paymentMethodsData.banks) {
      const merged = [
        ...paymentMethodsData.cards.map((card) => ({ type: 'Card', ...card })),
        ...paymentMethodsData.banks.map((bank) => ({ type: 'Bank', ...bank }))
      ];
      setMergedData(merged);
    }
  }, [paymentMethodsData]);

  useEffect(() => {
    if (location.state?.invoices && location.state?.invoices.length > 0) {
      const _data = location.state.invoices.map((item) => ({ ...item, paymentAmount: item.openAmount }));
      setSelectedInvoices(_data);
    }
  }, [location.state]);

  const paymentCard = {
    'Schedule option': 'Pay Today',
    'Net amount to be charged': '$8,129.91',
    'Payment method': '4600 - FIRST CITIZENS BANK & TRUST CO'
  };

  const backButtonClick = () => {
    const state = {};
    state.title = 'Confirm';
    state.body = 'Are you sure want to leave Review and Pay screen?';
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            navigate(-1);
            dispatch(closeModal());
          }}
        >
          Okay
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const getValue = (data) => {
    return data.map((item) => ({
      label:
        item.type === 'Bank'
          ? `${FinanceUtils.maskCardNumber(item.accountNumber)}, ${item.name}`
          : `${FinanceUtils.maskCardNumber(item.number)}, ${item.holderName}, ${item?.expirationDate}`,
      value:
        item.type === 'Bank'
          ? `${FinanceUtils.maskCardNumber(item.accountNumber)}, ${item.name}`
          : `${FinanceUtils.maskCardNumber(item.number)}, ${item.holderName}, ${item?.expirationDate}`,
      ...item
    }));
  };

  const getselectedValue = () => selectedData?.label;

  const invoicesSum = useMemo(() => {
    const _sum = selectedInvoices
      .filter((i) => i.paymentAmount)
      .reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.paymentAmount), 0);
    return parseFloat(_sum).toFixed(2);
  }, [selectedInvoices]);

  const creditsSum = useMemo(() => {
    let _sum = selectedCredits
      .filter((i) => i.billAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.billAmount), accumulator + parseFloat(currentValue.billAmount);
      }, 0);
    return parseFloat(_sum).toFixed(2);
  }, [selectedCredits]);

  const totalAmount = useMemo(() => {
    let _total = invoicesSum - creditsSum;
    return parseFloat(_total).toFixed(2);
  }, [invoicesSum, creditsSum]);

  const getRadioItems = () => {
    const isDisabledDueDate = location.state.includeinvoiceData
      ? location.state.includeinvoiceData.some((invoice) => dayjs(invoice.dueDate, 'DD/MM/YYYY').isBefore(dayjs()))
      : location.state?.invoices
      ? location.state.invoices.some((invoice) => dayjs(invoice.dueDate, 'DD/MM/YYYY').isBefore(dayjs()))
      : false;

    return selectedData
      ? [
          {
            isDisabled: false,
            label: 'Pay Today',
            value: 'Pay Today',
            subLabel:
              'Once submitted, the payment will be processed immediately and no further changes can be made. (Note: Payments submitted after 4.30 PM CT will be processed the next business day)'
          },
          {
            isDisabled: isDisabledDueDate,
            label: 'Pay on Due Date',
            value: 'Pay on Due Date',
            subLabel: 'Once submitted , you have the option to cancel the payment until 4:00 PM CT on the due date of the earliest invoice.'
          },
          {
            isDisabled: selectedData?.type !== 'Bank',
            label: 'Pay on Specific Date',
            value: 'Pay on Specific Date',
            subLabel:
              'Once submitted , you have the option to cancel the payment until 4:00 PM CT on the specified date of the earliest invoice.',
            subType: 'datePicker'
          }
        ]
      : [
          {
            isDisabled: false,
            label: 'Pay Today',
            value: 'Pay Today',
            subLabel:
              'Once submitted, the payment will be processed immediately and no further changes can be made. (Note: Payments submitted after 4.30 PM CT will be processed the next business day)'
          },
          {
            isDisabled: isDisabledDueDate,
            label: 'Pay on Due Date',
            value: 'Pay on Due Date',
            subLabel: 'Once submitted , you have the option to cancel the payment until 4:00 PM CT on the due date of the earliest invoice.'
          },
          {
            isDisabled: false,
            label: 'Pay on Specific Date',
            value: 'Pay on Specific Date',
            subLabel:
              'Once submitted , you have the option to cancel the payment until 4:00 PM CT on the specified date of the earliest invoice.',
            subType: 'datePicker'
          }
        ];
  };

  return (
    <div className="reviewPayments">
      <div className="reviewPaymentsContent">
        <div className="backNavigation">
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.Details.backToManageInvoices')}
          </Button>
        </div>
        <div className="header">
          <Heading as="h1" className="heading">
            {t('Review and Pay')}
          </Heading>
        </div>
        <div className="section">
          <div className="sectionHeader">{t('Account')}</div>
          <div className="sectionCard">
            <div className="accountNumber">0000000174</div>
            <div className="accountName">Ironwood Cancer And Research Center</div>
            <div className="accountAddress">1432 S Dobson Rd Ste 106, Mesa, AZ, 85202</div>
          </div>
        </div>
        <div className="section">
          <div className="sectionHeader">{'Payment Summary'}</div>
          <div className="sectionCard">
            {CommonUtils.isNonEmptyObject(paymentCard) &&
              Object.entries(paymentCard).map(([key, value]) => <InfoCards title={key} value={value} />)}
          </div>
        </div>
        <div>
          <SelectedInvoiceList selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>
        <div className="invoice-sum-container">
          <div className="label">{`${selectedInvoices.length} invoice(s), amount to be paid:`}</div>
          <div className="value">{`$${invoicesSum}`}</div>
        </div>
        <div className="MCP-module-wrapper">
          <div>
            <h1>Credits Available</h1>
          </div>
          <div id="tablist-container" className="MCP-module-body">
            <PaymentsCreditsProvider>
              <Credits selectedCredits={selectedCredits} setSelectedCredits={setSelectedCredits} selectableRows={true} />
            </PaymentsCreditsProvider>
          </div>
          <div className="invoice-sum-container">
            <div className="label">{`Total credit amount:`}</div> <div className="value">{`$${creditsSum}`}</div>
          </div>
        </div>
      </div>
      <div className="payment">
        <Heading as="h2">Payment</Heading>
        <div className="paymentMethodContainer">
          <div className="paymentMethod">Select a method</div>
          <AutoSuggestDropdown
            suggestionList={getValue(mergedData)}
            id="id"
            selectedVal={getselectedValue}
            getselectedValue={(val) => setSelectedData(val)}
            onChangeInput={() => {}}
            suggestionListContainerWidth="400px"
          />
        </div>
        <div className="paymentOptionContainer">
          <RadioGroup
            direction="column"
            id="radio-button-order-therapy-props.id"
            items={getRadioItems()}
            onChangeValue={(e) => setPaymentOption(e)}
            onOtherTextChange={() => {}}
            onSubRadioFieldChange={() => {}}
            radioBtnWidth="auto"
            value={paymentOption}
          />
        </div>
        <div className="invoice-sum-container">
          <div className="label">Amount to be charged to your Payment account:</div>
          <div className="value">{`$${totalAmount}`}</div>
        </div>
      </div>
      <div className="footer-section">
        <Button variant="secondary" onClick={() => {}} size="sm" disabled>
          Cancel
        </Button>
        <Button onClick={() => {}} size="sm" disabled>
          Preview Payment
        </Button>
      </div>
    </div>
  );
}

export default ReviewPayments;
