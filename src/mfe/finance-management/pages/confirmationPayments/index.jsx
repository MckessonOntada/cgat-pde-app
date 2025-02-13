import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import InfoCards from '@src/components/infoCards/InfoCards';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import SelectedInvoiceList from '../reviewPayments/SelectedInvoiceList';
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
import CreditsSelected from '../reviewPayments/CreditsSelected';
import dayjs from 'dayjs';
import { GeographicUtils } from '@src/util/GeographicUtil';

function ConfirmationPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { state } = location;
  const { selectedPayment } = state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount } = useAccountContext();
  const { showSnackbar } = useSnackbar();
  const [mergedData, setMergedData] = useState([]);

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
    [t('paymentInvoices.credits.table.amount')]: location.state?.amount,
    [t('paymentInvoices.reviewPayments.totalCredit')]: location.state?.totalCreditAmount,
    [t('paymentInvoices.reviewPayments.creditRemaing')]: location.state?.amountPaid,
    [t('paymentInvoices.reviewPayments.amountPaid')]: location.state?.amountPaid
  };
  const confirmationData = {
    [t('paymentInvoices.reviewPayments.mckessonId')]: '123456789',
    [t('paymentInvoices.reviewPayments.paymentInitiatedDate')]: dayjs().format('MM/DD/YYYY'),
    [t('paymentInvoices.reviewPayments.paymentType')]: location.state?.paymentOption,
    [t('paymentInvoices.reviewPayments.paymentDate')]: '12/12/2021', //we will include
    [t('paymentInvoices.Details.Account')]: `${
      location.state?.selectedPayment?.number?.slice(-4) || location.state.selectedPayment?.accountNumber?.slice(-4)
    } - ${GeographicUtils.addressAggregator(selectedAccount)}`,
    [t('paymentInvoices.reviewPayments.paymentMethod')]: `${
      location.state?.selectedPayment?.number?.slice(-4) || location.state.selectedPayment?.accountNumber?.slice(-4)
    } - ${location.state?.selectedPayment?.userDefinedName || location.state?.selectedPayment?.name}`
  };

  const backButtonClick = () => {
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
          {t('paymentInvoices.reviewPayments.Okay')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const creditsSum = useMemo(() => {
    let _sum = selectedCredits
      .filter((i) => i.billAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.billAmount), accumulator + parseFloat(currentValue.billAmount);
      }, 0);
    return parseFloat(_sum).toFixed(2);
  }, [selectedCredits]);

  return (
    <div className="PreviewPayments">
      <div className="reviewPaymentsContent">
        <div className="backNavigation">
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.Details.backToManageInvoices')}
          </Button>
        </div>
        <div className="header">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M51.1959 8.78584C45.54 3.11165 37.9988 0 30 0C21.9829 0 14.4417 3.11165 8.78584 8.78584C3.11165 14.4417 0 21.9829 0 30C0 38.0171 3.11165 45.54 8.78584 51.2142C14.4417 56.87 21.9829 60 30 60C38.0171 60 45.54 56.8883 51.2142 51.2142C56.87 45.5583 60 38.0171 60 30C59.9817 21.9829 56.87 14.4417 51.1959 8.78584Z"
              fill="#3CAF47"
            />
            <path
              d="M26.0725 35.4462L20.1768 29.5506C19.0416 28.4154 17.1741 28.4154 16.0389 29.5506C14.9037 30.6858 14.9037 32.5533 16.0389 33.6885L24.0035 41.6531C25.1387 42.7883 27.0062 42.7883 28.1414 41.6531L44.7115 25.0831C45.8466 23.9479 45.8466 22.0803 44.7115 20.9451C43.5763 19.81 41.7087 19.81 40.5735 20.9451L26.0725 35.4462Z"
              fill="white"
            />
          </svg>
          <div>
            <div className="paymentSuccesfull">{t('paymentInvoices.reviewPayments.paymentSuccess')}</div>
            <div className="paymentSuccesfullMessage">{t('paymentInvoices.reviewPayments.thankyouforpayment')}</div>
          </div>
        </div>
        <div className="confirmationDetails">
          {CommonUtils.isNonEmptyObject(confirmationData) &&
            Object.entries(confirmationData).map(([key, value]) => (
              <>
                <div className="card">
                  <div className="card-header">
                    <div className="accountNumber">{key}</div>
                  </div>
                  <div className="accountName">{value || 'NA'}</div>
                </div>
              </>
            ))}
        </div>
        <div className="section">
          {/* <div className="sectionHeader">{t('paymentInvoices.reviewPayments.paymentSummary')}</div> */}
          <div className="sectionCard">
            {CommonUtils.isNonEmptyObject(paymentCard) &&
              Object.entries(paymentCard).map(([key, value]) => <InfoCards title={key} value={value} />)}
          </div>
        </div>
        <Heading as="h2">{t('paymentInvoices.reviewPayments.invoices')}</Heading>
        <div>
          <SelectedInvoiceList selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>

        <div className="MCP-module-wrapper">
          <div>
            <h1>{t('paymentInvoices.reviewPayments.credits')}</h1>
          </div>
          <div id="tablist-container" className="MCP-module-body">
            <PaymentsCreditsProvider>
              <CreditsSelected />
            </PaymentsCreditsProvider>
          </div>
        </div>
        <div className="confirmationNote">
          <strong>Note:</strong> {t('paymentInvoices.Details.ConfirmationNote')}
        </div>
      </div>
      <div className="footer-section">
        <Button variant="secondary" onClick={() => {}} size="sm" disabled>
          {t('paymentInvoices.history.filters.printSummary')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            navigate(`/record/invoices`);
          }}>
          {t('paymentInvoices.Details.GoToManagePayments')}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmationPayments;
