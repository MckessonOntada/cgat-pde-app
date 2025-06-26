import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import SelectedInvoiceList from './SelectedInvoiceList';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaymentsCreditsProvider } from '../../context/PaymentsCreditsContext';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useMutation, useQuery } from 'react-query';
import ApiRoutes from '../../../../api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { FinanceUtils } from '@src/util/FinanceUtil';
import dayjs from 'dayjs';
import { PaymentOptionsControls } from '@src/mfe/finance-management/pages/reviewPayments/paymentControlOptions';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import CreditsSelected from './CreditsSelected';
import { onConfirmPayment } from '../utils/actions';
import { paymentMethod } from '../utils/constants';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import SelectCreditsListing from './SelectCreditsListing';
import { FooterContext } from '@src/components/footer/FooterContext';
import Alert from '@src/components/cgat-alert/Alert';

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { state } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount } = useAccountContext();
  const [mergedData, setMergedData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [paymentOption, setPaymentOption] = useState('');
  const REVIEW_MODE = state?.reviewMode || false;
  const [selectedSpecificDate, setSelectedSpecificDate] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [totalCreditsCount, settotalCreditsCount] = useState(0);
  const disablePay = useRef(false);
  const [SpecificDateError, setSpecificDateError] = useState('');
  const { controlRef } = useContext(FooterContext);
  const [totalCreditsAmount, settotalCreditsAmount] = useState(0);
  const [disablecreditSelection, setDisablecreditSelection] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState('0.00');

  const showAlert = (type, message) => {
    setAlert({ type });
    setIsAlertVisible(true);
    setAlertDescription(message);
  };
  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const { data: paymentMethodsData = [], isError } = useQuery({
    queryKey: ['paymentMethodsreviewPayments', selectedAccount?.accountNumber],
    queryFn: async () => {
      const url = `${ApiRoutes.PAYMENT_METHODS_LISTING('selectedAccount.accountNumber')}`;
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
        showAlert('error', t('paymentInvoices.paymentMethods.api.error'));
      }
    }
  });

  useEffect(() => {
    if (paymentMethodsData.cards || paymentMethodsData.banks) {
      const merged = [
        // ...paymentMethodsData.cards.map((card) => ({ accType: paymentMethod.CREDIT_CARD, ...card })),
        ...paymentMethodsData.banks.map((bank) => ({ accType: paymentMethod.BANK, ...bank }))
      ].map((item) => ({
        label:
          item.accType === paymentMethod.BANK
            ? `${FinanceUtils.maskCardNumber(item.accountNumber)}, ${item.name}`
            : `${FinanceUtils.maskCardNumber(item.number)}, ${item.holderName}, ${item?.expirationDate}`,
        value:
          item.accType === paymentMethod.BANK
            ? `${FinanceUtils.maskCardNumber(item.accountNumber)}, ${item.name}`
            : `${FinanceUtils.maskCardNumber(item.number)}, ${item.holderName}, ${item?.expirationDate}`,
        ...item
      }));
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
    state?.selectedPayment && setSelectedData(state.selectedPayment);
    state?.paymentOption && setPaymentOption(state.paymentOption);
    state?.totalCreditsCount && settotalCreditsCount(state?.totalCreditsCount);
    state?.selectedSpecificDate && setSelectedSpecificDate(state.selectedSpecificDate);
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

  const leastDueDateInvoice = useMemo(() => {
    return selectedInvoices?.length > 0
      ? selectedInvoices.reduce((min, current) => (dayjs(current.dueDate, 'DD/MM/YYYY').isBefore(dayjs(min.dueDate, 'DD/MM/YYYY')) ? current : min))
      : null;
  }, [selectedInvoices]);

  const isPartialPayment = useMemo(() => {
    if (selectedInvoices?.length > 0) {
      let _totalAmount = 0;
      let _totalpaymentAmount = 0;
      selectedInvoices?.map((item) => {
        _totalAmount = _totalAmount + parseFloat(item.openAmount);
        _totalpaymentAmount = _totalpaymentAmount + parseFloat(item.paymentAmount);
      });
      return _totalpaymentAmount < _totalAmount ? true : false;
    } else {
      return false;
    }
  }, [selectedInvoices]);

  const paymentAmountSum = useMemo(() => {
    const _sum = selectedInvoices.filter((i) => i.paymentAmount).reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.paymentAmount), 0);
    setPaymentOption('');
    setSpecificDateError('');
    return parseFloat(_sum).toFixed(2);
  }, [selectedInvoices]);

  const creditsSum = useMemo(() => {
    let _sum = selectedCredits
      .filter((i) => i.openAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.openAmount), accumulator + parseFloat(currentValue.openAmount);
      }, 0);
    setPaymentOption('');
    setSpecificDateError('');
    return parseFloat(_sum).toFixed(2);
  }, [selectedCredits]);

  const totalAmount = useMemo(() => {
    let _total = paymentAmountSum - creditsSum;
    return parseFloat(_total > 0 ? _total : 0).toFixed(2);
  }, [paymentAmountSum, creditsSum]);

  const validateSpecificDate = (value) => {
    if (value && (!dayjs(value).isValid() || !dayjs().isBefore(dayjs(value, 'MM/DD/YYYY')))) {
      setSpecificDateError(`Selected date should not be the past date`);
    }
    if (value && dayjs(value, 'MM/DD/YYYY').isAfter(dayjs(leastDueDateInvoice.dueDate, 'DD/MM/YYYY'))) {
      let _formatDate = dayjs(leastDueDateInvoice.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
      setSpecificDateError(`Selected date should be on or before  due date: ${_formatDate}`);
    }
  };

  const getRadioItems = () => {
    const dueDateIsInPast = leastDueDateInvoice && dayjs(leastDueDateInvoice.dueDate, 'DD/MM/YYYY').isBefore(dayjs());

    return selectedData
      ? [
          {
            isDisabled: false,
            label: t('paymentInvoices.reviewPayments.payToday'),
            value: t('paymentInvoices.reviewPayments.payToday'),
            subLabel: t('paymentInvoices.reviewPayments.payTodayDesc')
          },
          {
            isDisabled: dueDateIsInPast || isPartialPayment || parseFloat(totalAmount) <= 0 || parseFloat(creditsSum) > 0,
            label: t('paymentInvoices.reviewPayments.payDuedate'),
            value: t('paymentInvoices.reviewPayments.payDuedate'),
            subLabel: t('paymentInvoices.reviewPayments.payDuedateDesc')
          },
          {
            isDisabled: dueDateIsInPast || isPartialPayment || parseFloat(creditsSum) > 0,
            label: t('paymentInvoices.reviewPayments.paySpecfic'),
            value: t('paymentInvoices.reviewPayments.paySpecfic'),
            subLabel: t('paymentInvoices.reviewPayments.paySpecficDesc'),
            subType: 'datePicker',
            onSubTypeChange: (value) => {
              setSelectedSpecificDate(value);
              setSpecificDateError('');
              if (value && dayjs(value).isValid() && dayjs(value, 'MM/DD/YYYY').isAfter(dayjs(leastDueDateInvoice.dueDate, 'DD/MM/YYYY'))) {
                let _formatDate = dayjs(leastDueDateInvoice.dueDate, 'DD/MM/YYYY').format('MM/DD/YYYY');
                setSpecificDateError(`Selected date should be on or before due date: ${_formatDate}`);
              }
            },
            disablePast: true,
            subTypeValue: selectedSpecificDate,
            onBlurSubType: (e) => {
              const value = e.target.value;
              setSpecificDateError('');
              validateSpecificDate(value);
            },
            errorMsg: SpecificDateError
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

  const {
    mutate: payInvoices,
    isLoading,
    data
  } = useMutation(
    async (payload) => {
      const url = `${ApiRoutes.GET_PAY_AMOUNT_URL(selectedAccount.accountNumber)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.POST, payload);
      return res.data;
    },
    {
      onSuccess: (response, payload) => {
        if (response) {
          dispatch(closeModal());
          let _paymentDate = Object.values(payload.paymentSchedule);
          navigate('/record/invoices/confirmationPayments', {
            state: {
              ...state,
              confirmationNumber: response.confirmationNo,
              paymentDate: _paymentDate && _paymentDate[0],
              invoices: selectedInvoices,
              creditsSelected: selectedCredits,
              selectedPayment: selectedData,
              amount: FinanceUtils.formatCurrency(paymentAmountSum),
              creditAmount: FinanceUtils.formatCurrency(creditsSum),
              amountPaid: FinanceUtils.formatCurrency(totalAmount),
              reviewMode: true,
              totalCreditAmount: FinanceUtils.formatCurrency(selectedCredits.reduce((sum, bill) => sum + bill.openAmount, 0))
            },
            replace: true
          });
        } else {
          showAlert('error', 'Something went wrong while processing payment');
        }
      },
      onError: (error, payload) => {
        dispatch(closeModal());
        let _paymentDate = Object.values(payload.paymentSchedule);
        navigate('/record/invoices/confirmationPayments', {
          state: {
            ...state,
            paymentDate: _paymentDate && _paymentDate[0],
            selectedPayment: selectedData,
            paymentError: true
          }
        });
      },

      retry: false
    }
  );

  const onPreviewPayment = () => {
    if (REVIEW_MODE) {
      const param = {};
      param.title = t('paymentInvoices.reviewPayments.confirm');
      param.body = <div className="MCP-modal-body">{'Ready to pay the selected invoices?'}</div>;
      param.footer = (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              if (disablePay.current) return;
              dispatch(closeModal());
              disablePay.current = setTimeout(() => {
                onConfirmPayment(selectedAccount, state, payInvoices, t, selectedSpecificDate);
                disablePay.current = null;
              }, 500);
            }}
            disabled={!!disablePay.current}>
            Confirm
          </Button>
        </div>
      );
      dispatch(openModal(param));
    } else {
      let valid = _validatePaymentAmount();
      if (valid && !SpecificDateError) {
        navigate('.', {
          state: {
            ...state,
            invoices: selectedInvoices,
            creditsSelected: selectedCredits,
            reviewMode: true,
            paymentOption: paymentOption,
            selectedPayment: selectedData,
            totalCreditsCount: FinanceUtils.formatCurrency(totalCreditsCount - creditsSum),
            selectedSpecificDate: selectedSpecificDate
          },
          replace: true
        });
      } else if (!valid) {
        dispatch(showAlert('error', 'Invalid payment amount entered'));
      }
    }
  };
  const disablePreview = () => {
    return !selectedData || (paymentOption == t('paymentInvoices.reviewPayments.paySpecfic') ? !selectedSpecificDate : !paymentOption) || !!SpecificDateError;
  };

  const onChangePayment = (value) => {
    setSelectedSpecificDate(null);
    let _data = mergedData.find((ele) => ele.value == value);
    setSelectedData(_data);
    setPaymentOption('');
    setSpecificDateError('');
  };
  const getOptions = useMemo(() => {
    let _data = [];
    if (searchKey) {
      _data = mergedData.filter((ele) => ele.value.toLowerCase().includes(searchKey.toLowerCase()));
    } else {
      _data = mergedData;
    }
    return _data;
  }, [searchKey, mergedData]);

  useEffect(() => {
    const displayedAppliedCredit = Math.min(creditsSum, paymentAmountSum);
    const remaining = totalCreditsAmount - displayedAppliedCredit;

    setRemainingAmount(FinanceUtils.formatCurrency(remaining).slice(1));
    const shouldDisable = parseFloat(creditsSum) >= parseFloat(paymentAmountSum);
    setDisablecreditSelection(shouldDisable);
  }, [creditsSum, paymentAmountSum, totalCreditsAmount]);

  if (isLoading) {
    return (
      <div className="loaderWrapper">
        <p className="loaderText">{t('paymentInvoices.reviewPayments.processing')}</p>
        <Loader loaderText={''} />
      </div>
    );
  }

  return (
    <div className="reviewPayments">
      <div className="reviewPaymentsContent">
        <div className="backNavigation">
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.reviewPayments.BackToManagePayments')}
          </Button>
        </div>
        {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} />}
        <div>
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
                {selectedAccount.street}, {selectedAccount.state}, {selectedAccount.city}, {selectedAccount.country}, {selectedAccount.zipCode}
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
                [t('paymentInvoices.reviewPayments.paymentMethod')]: `${selectedData?.number?.slice(-4) || selectedData?.accountNumber?.slice(-4)} - ${
                  selectedData?.userDefinedName || selectedData?.name
                }`
              }}
            />
          </div>
        )}
        <div className="selectedInvoices-container section">
          <div className="sectionHeader">{REVIEW_MODE ? t('paymentInvoices.reviewPayments.invoiceSelected') : t('paymentInvoices.reviewPayments.invoice')}</div>
          <SelectedInvoiceList omitColumns={['billDate']} selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>
        {!REVIEW_MODE && (
          <div className="invoice-sum-container">
            <div className="label"> {t('paymentInvoices.reviewPayments.selectedInvoice', { count: selectedInvoices.length })}</div>
            <div className="value">
              <span className="currencySymbol">$</span>
              {`${FinanceUtils.formatCurrency(paymentAmountSum).slice(1)}`}
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
                  <SelectCreditsListing
                    selectedCredits={selectedCredits}
                    setSelectedCredits={setSelectedCredits}
                    totalCreditsCount={totalCreditsCount}
                    settotalCreditsCount={settotalCreditsCount}
                    settotalCreditsAmount={settotalCreditsAmount}
                    disableSelection={disablecreditSelection}
                  />
                </PaymentsCreditsProvider>
              )}
            </div>
            {!REVIEW_MODE && (
              <>
                <div className="invoice-sum-container">
                  <div className="label">{t('paymentInvoices.reviewPayments.TotalCreditAmount')}</div>{' '}
                  <div className="value">
                    <span className="currencySymbol">$</span>
                    {`${FinanceUtils.formatCurrency(totalCreditsAmount).slice(1)}`}
                  </div>
                </div>

                <div className="invoice-sum-container">
                  <div className="label">{t('paymentInvoices.reviewPayments.TotalAmountAfterCreditApplied')}</div>
                  {''}
                  <div className="value">
                    <span className="currencySymbol">$</span>
                    {remainingAmount}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {!REVIEW_MODE && (
        <div>
          <div className="paymentSectionHeader">{t('paymentInvoices.reviewPayments.payment')}</div>
          <div className="payment">
            <div className="paymentOptionWrappee">
              <div>
                <div className="paymentMethodContainer">
                  <MultiSelectDropdown
                    id={'select-payment-search'}
                    label={t('paymentInvoices.reviewPayments.selectMethod')}
                    isMultiSelect={false}
                    placeholder={'Search payment method'}
                    onChange={onChangePayment}
                    options={getOptions}
                    variant={'async'}
                    onSearch={(event) => setSearchKey(event)}
                    recordsCountToEnableSearch={5}
                    size="md"
                    isSortEnable={false}
                    value={selectedData?.value.toString() || ''}
                    fieldDisplayValue={selectedData?.label ? selectedData : undefined}
                  />
                </div>
                <span className="selectMethodInfo">{t('paymentInvoices.reviewPayments.selectMethodInfo')}</span>
              </div>
              <div className="paymentOptionContainer">
                <PaymentOptionsControls
                  direction="column"
                  id="radio-button-order-therapy-props.id"
                  items={getRadioItems()}
                  onChangeValue={(e) => {
                    setSpecificDateError('');
                    setSelectedSpecificDate('');
                    setPaymentOption(e);
                  }}
                  onOtherTextChange={() => {}}
                  onSubRadioFieldChange={() => {}}
                  radioBtnWidth="auto"
                  value={paymentOption}
                />
              </div>
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
      <div className="footer-wrapper" ref={controlRef}>
        <div className="footer-section controls footer-controls">
          <Button variant="secondary" onClick={() => navigate('../')} size="md">
            {t('paymentInvoices.reviewPayments.cancel')}
          </Button>
          {REVIEW_MODE ? (
            <Button onClick={onPreviewPayment} size="md">
              {`${t('paymentInvoices.reviewPayments.pay')} ${FinanceUtils.formatCurrency(totalAmount)}`}
            </Button>
          ) : (
            <Button onClick={onPreviewPayment} size="md" disabled={disablePreview()}>
              {t('paymentInvoices.reviewPayments.previewPayment')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewPayments;
