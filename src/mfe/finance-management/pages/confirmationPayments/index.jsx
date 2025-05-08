import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useQuery } from 'react-query';
import ApiRoutes from '../../../../api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import dayjs from 'dayjs';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useCustomPrint } from '@src/util/printUtils';
import { ReactComponent as Scuccess } from '@src/assets/svg/success.svg';
import { ReactComponent as Failed } from '@src/assets/svg/failed.svg';
import { FooterContext } from '@src/components/footer/FooterContext';

function ConfirmationPayments() {
  const { t } = useTranslate();
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAccount } = useAccountContext();
  const { showSnackbar } = useSnackbar();
  const contentRef = useRef(null); 
  const printPage = useCustomPrint(contentRef);
  const paymentFailed = location.state?.paymentError || false;
  const { controlRef } = useContext(FooterContext);

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

  const confirmationData = {
    ...( !paymentFailed ? {[t('paymentInvoices.reviewPayments.mckessonId')]: location.state?.confirmationNumber} : {}),
    [t('paymentInvoices.reviewPayments.paymentInitiatedDate')]: dayjs().format('MM/DD/YYYY'),
    [t('paymentInvoices.reviewPayments.paymentType')]: location.state?.paymentOption,
    [t('paymentInvoices.reviewPayments.paymentDate')]: dayjs(location.state.paymentDate, 'YYYY-MM-DD').format('MM/DD/YYYY'),
    [t('paymentInvoices.Details.Account')]: `${selectedAccount?.accountNumber} - ${GeographicUtils.addressAggregator(selectedAccount)}`,
    [t('paymentInvoices.reviewPayments.paymentMethod')]: `${location.state?.selectedPayment?.accountNumber?.slice(-4)} - ${
      location.state?.selectedPayment?.userDefinedName || location.state?.selectedPayment?.name
    }`
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
          {t('paymentInvoices.reviewPayments.OK')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  return (
    <div className="PreviewPayments">
      <div className="reviewPaymentsContent" ref={contentRef}>
        <div className="backNavigation">
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.Details.backToManageInvoices')}
          </Button>
        </div>
        <div className="headerWrapper">
          { !paymentFailed ? (
              <Scuccess />
            ):(
              <Failed />
            )
          } 
          <div>
            <div className="paymentSuccesfull">
              {t( !paymentFailed ? 
                'paymentInvoices.reviewPayments.paymentSuccess' 
                : 
                'paymentInvoices.reviewPayments.paymentFailed'
              )}
            </div>
            <div className="paymentSuccesfullMessage">
              {t( !paymentFailed ? 
                'paymentInvoices.reviewPayments.thankyouforpayment' 
                : 
                'paymentInvoices.reviewPayments.paymentFailedMessage'
              )}
            </div>
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
        { !paymentFailed && (
          <div className="confirmationNote">
            <strong>Note:</strong> {t('paymentInvoices.Details.ConfirmationNote')}
          </div>
        )} 
      </div>
      <div className="footer-wrapper" ref={controlRef}>
        <div className="controls footer-controls">
          <Button variant="secondary" onClick={() => printPage()} size="md">
            {t('paymentInvoices.history.filters.printSummary')}
          </Button>
          <Button
            size="md"
            onClick={() => {
              navigate(`/record/invoices`);
            }}>
            {t('paymentInvoices.Details.GoToManagePayments')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPayments;
