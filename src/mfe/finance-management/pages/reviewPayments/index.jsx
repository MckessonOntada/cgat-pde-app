import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import SelectedInvoiceList from './SelectedInvoiceList';
import { useLocation, useNavigate } from 'react-router-dom';
import Credits from '../credits';
import { PaymentsCreditsProvider } from '../../context/PaymentsCreditsContext';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useQuery } from 'react-query';
import ApiRoutes from '../../../../api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import { FinanceUtils } from '@src/util/FinanceUtil';
import dayjs from 'dayjs';
import { PaymentOptionsControls } from '@src/mfe/finance-management/pages/reviewPayments/paymentControlOptions';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import CreditsSelected from './CreditsSelected';

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { state } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount } = useAccountContext();
  const { showSnackbar } = useSnackbar();
  const [mergedData, setMergedData] = useState([]);
  const [selectedData, setSelectedData] = useState('');
  const [paymentOption, setPaymentOption] = useState('');
  const REVIEW_MODE = state?.reviewMode || false;

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
    if (location.state?.invoices && location.state?.invoices.length > 0 && !REVIEW_MODE) {
      const _data = location.state.invoices.map((item) => ({ ...item, paymentAmount: item.paymentAmount || item.openAmount }));
      setSelectedInvoices(_data);
    }
    if (state?.creditsSelected?.length > 0 && !REVIEW_MODE) {
      setSelectedCredits(state.creditsSelected);
    }
    state?.selectedData && setSelectedData(state.selectedData);
    state?.paymentOption && setPaymentOption(state.paymentOption);
    if (REVIEW_MODE) {
      setSelectedInvoices(state.invoices || []);
    }
  }, [location.state]);

  const backButtonClick = () => {
    if (REVIEW_MODE) {
      navigate('.', { state: { ...state, reviewMode: false }, replace: true });
    } else {
      const state = {};
      state.title = t('paymentInvoices.reviewPayments.confirm');
      state.body = <div className="MCP-modal-body">{t('paymentInvoices.reviewPayments.confirmationDialogue')}</div>;
      state.footer = (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {t('paymentInvoices.reviewPayments.cancel')}
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              navigate(-1);
              dispatch(closeModal());
            }}>
            {t('paymentInvoices.reviewPayments.OK')}
          </Button>
        </div>
      );
      dispatch(openModal(state));
    }
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
    return parseFloat(_total > 0 ? _total : 0).toFixed(2);
  }, [invoicesSum, creditsSum]);

  const getRadioItems = () => {
    const isDisabledDueDate = location.state?.includeinvoiceData
      ? location.state?.includeinvoiceData.some((invoice) => dayjs(invoice.dueDate, 'DD/MM/YYYY').isBefore(dayjs()))
      : location.state?.invoices
      ? location.state?.invoices.some((invoice) => dayjs(invoice.dueDate, 'DD/MM/YYYY').isBefore(dayjs()))
      : false;

    return selectedData
      ? [
          {
            isDisabled: false,
            label: t('paymentInvoices.reviewPayments.payToday'),
            value: t('paymentInvoices.reviewPayments.payToday'),
            subLabel: t('paymentInvoices.reviewPayments.payTodayDesc')
          },
          {
            isDisabled: isDisabledDueDate,
            label: t('paymentInvoices.reviewPayments.payDuedate'),
            value: t('paymentInvoices.reviewPayments.payDuedate'),
            subLabel: t('paymentInvoices.reviewPayments.payDuedateDesc')
          },
          {
            isDisabled: selectedData?.type === 'Bank',
            label: t('paymentInvoices.reviewPayments.paySpecfic'),
            value: t('paymentInvoices.reviewPayments.paySpecfic'),
            subLabel: t('paymentInvoices.reviewPayments.paySpecficDesc'),
            subType: 'datePicker'
          }
        ]
      : [
          {
            isDisabled: true,
            label: t('paymentInvoices.reviewPayments.payToday'),
            value: t('paymentInvoices.reviewPayments.payToday'),
            subLabel: t('paymentInvoices.reviewPayments.payTodayDesc')
          },
          {
            isDisabled: true,
            label: t('paymentInvoices.reviewPayments.payDuedate'),
            value: t('paymentInvoices.reviewPayments.payDuedate'),
            subLabel: t('paymentInvoices.reviewPayments.payDuedateDesc')
          },
          {
            isDisabled: true,
            label: t('paymentInvoices.reviewPayments.paySpecfic'),
            value: t('paymentInvoices.reviewPayments.paySpecfic'),
            subLabel: t('paymentInvoices.reviewPayments.paySpecficDesc'),
            subType: 'datePicker'
          }
        ];
  };

  const _validatePaymentAmount = () => {
    let _valid = selectedInvoices.find((item) => item.paymentAmount > item.openAmount || item.paymentAmount <= 0 || !item.paymentAmount);
    return !_valid;
  };

  const onPreviewPayment = () => {
    if (REVIEW_MODE) {
      navigate('/record/invoices/confirmationPayments', {
        state: {
          ...state,
          invoices: selectedInvoices,
          creditsSelected: selectedCredits,
          selectedPayment: selectedData,
          paymentOption: paymentOption,
          amount: FinanceUtils.formatCurrency(invoicesSum),
          creditAmount: FinanceUtils.formatCurrency(creditsSum),
          amountPaid: FinanceUtils.formatCurrency(totalAmount),
          reviewMode: true,
          totalCreditAmount: FinanceUtils.formatCurrency(selectedCredits.reduce((sum, bill) => sum + bill.billAmount, 0))
        },
        replace: true
      });
    } else {
      let valid = _validatePaymentAmount();
      if (valid) {
        navigate('.', {
          state: {
            ...state,
            invoices: selectedInvoices,
            creditsSelected: selectedCredits,
            reviewMode: true,
            paymentOption: paymentOption,
            selectedPayment: selectedData
          },
          replace: true
        });
      } else {
        dispatch(
          showSnackbar({
            description: 'Invalid payment amount entered',
            type: 'error'
          })
        );
      }
    }
  };
  const disablePreview = () => {
    return !selectedData || !paymentOption;
  };

  return (
    <div className="reviewPayments">
      <div className="reviewPaymentsContent">
        <div className="backNavigation">
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.reviewPayments.BackToManagePayments')}
          </Button>
        </div>
        <div className="header">
          <Heading as="h1" className="heading">
            {t('paymentInvoices.heading.ReviewAndPay')}
          </Heading>
        </div>
        <div className="section">
          <div className="sectionHeader">{t('paymentInvoices.Details.Account')}</div>
          {selectedAccount && (
            <div className="sectionCard">
              <div className="accountNumber">{selectedAccount.accountNumber}</div>
              <div className="accountName">{selectedAccount.accountName}</div>
              <div className="accountAddress">
                {selectedAccount.street}, {selectedAccount.state}, {selectedAccount.city}, {selectedAccount.country},{' '}
                {selectedAccount.zipCode}
              </div>
            </div>
          )}
        </div>
        {REVIEW_MODE && (
          <div className="section">
            <div className="sectionHeader">{t('paymentInvoices.reviewPayments.paymentSummary')}</div>
            <DetailMetrics
              data={{
                [t('paymentInvoices.reviewPayments.scheduleOption')]: state.paymentOption,
                [t('paymentInvoices.reviewPayments.netAmount')]: FinanceUtils.formatCurrency(totalAmount),
                [t('paymentInvoices.reviewPayments.paymentMethod')]: `${
                  selectedData?.number?.slice(-4) || selectedData?.accountNumber?.slice(-4)
                } - ${selectedData?.userDefinedName || selectedData?.name}`
              }}
            />
          </div>
        )}
        <div className="selectedInvoices-container section">
          <div className="sectionHeader">
            {REVIEW_MODE ? t('paymentInvoices.reviewPayments.invoiceSelected') : t('paymentInvoices.reviewPayments.invoice')}
          </div>
          <SelectedInvoiceList selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>
        {!REVIEW_MODE && (
          <div className="invoice-sum-container">
            <div className="label"> {t('paymentInvoices.reviewPayments.selectedInvoice', { count: selectedInvoices.length })}</div>
            <div className="value">
              <span className="currencySymbol">$</span>
              {`${FinanceUtils.formatCurrency(invoicesSum).slice(1)}`}
            </div>
          </div>
        )}
        {(!REVIEW_MODE || (REVIEW_MODE && state?.creditsSelected?.length > 0)) && (
          <div className="MCP-module-wrapper section">
            <div className="sectionHeader">
              {REVIEW_MODE ? t('paymentInvoices.reviewPayments.creditsSelected') : t('paymentInvoices.reviewPayments.creditsAvail')}
            </div>
            <div id="tablist-container" className="MCP-module-body">
              {REVIEW_MODE ? (
                <CreditsSelected />
              ) : (
                <PaymentsCreditsProvider>
                  <Credits selectedCredits={selectedCredits} setSelectedCredits={setSelectedCredits} selectableRows={true} />
                </PaymentsCreditsProvider>
              )}
            </div>
            {!REVIEW_MODE && (
              <div className="invoice-sum-container">
                <div className="label">{`Total credit amount:`}</div>{' '}
                <div className="value">
                  <span className="currencySymbol">$</span>
                  {`${FinanceUtils.formatCurrency(creditsSum).slice(1)}`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {!REVIEW_MODE && (
        <div>
          <div className="paymentSectionHeader">{t('paymentInvoices.reviewPayments.payment')}</div>
          <div className="payment">
            <div className="paymentMethodContainer">
              <div className="paymentMethod">{t('paymentInvoices.reviewPayments.selectMethod')}</div>
              <AutoSuggestDropdown
                suggestionList={getValue(mergedData)}
                id="id"
                selectedVal={getselectedValue}
                getselectedValue={(val) => {
                  setSelectedData(val);
                  setPaymentOption('');
                }}
                onChangeInput={() => {}}
                suggestionListContainerWidth="400px"
              />
            </div>
            <div className="paymentOptionContainer">
              <PaymentOptionsControls
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
              <div className="label">{t('paymentInvoices.reviewPayments.invoiceDesc')}</div>
              <div className="value">
                <span className="currencySymbol">$</span>
                {`${FinanceUtils.formatCurrency(totalAmount).slice(1)}`}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="footer-section">
        <Button variant="secondary" onClick={() => navigate('../')} size="sm">
          {t('paymentInvoices.reviewPayments.cancel')}
        </Button>
        {REVIEW_MODE ? (
          <Button onClick={onPreviewPayment} size="sm">
            {`${t('paymentInvoices.reviewPayments.pay')} ${FinanceUtils.formatCurrency(totalAmount)}`}
          </Button>
        ) : (
          <Button onClick={onPreviewPayment} size="sm" disabled={disablePreview()}>
            {t('paymentInvoices.reviewPayments.previewPayment')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ReviewPayments;
