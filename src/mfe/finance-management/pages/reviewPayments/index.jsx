import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
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

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { state } = location;
  const { includeinvoiceData } = state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.invoices && location.state?.invoices.length > 0) {
      let _data = location.state?.invoices.map((item) => ({ ...item, paymentAmount: item.openAmount }));
      setSelectedInvoices(_data);
    }
  }, []);

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
          }}>
          Okay
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const invoicesSum = useMemo(() => {
    let _sum = selectedInvoices
      .filter((i) => i.paymentAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.paymentAmount), accumulator + parseFloat(currentValue.paymentAmount);
      }, 0);
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

  return (
    <div className={'reviewPayments'}>
      <div className={'reviewPaymentsContent'}>
        <div className={'backNavigation'}>
          <Button className="backButton" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={backButtonClick} size="md">
            {t('paymentInvoices.Details.backToManageInvoices')}
          </Button>
        </div>
        <div className={'header'}>
          {/* TODO: The Heading should be a component from Component library,
           But it does not match with Figma design. */}
          {/* <Heading as="h1">{t('Review and Pay')}</Heading> */}
          <Heading as="h1" className={'heading'}>
            {t('Review and Pay')}
          </Heading>
        </div>
        <div className={'section'}>
          <div className={'sectionHeader'}>{t('Account')}</div>
          <div className={'sectionCard'}>
            <div className={'accountNumber'}>0000000174</div>
            <div className={'accountName'}>Ironwood Cancer And Research Center</div>
            <div className={'accountAddress'}>1432 S Dobson Rd Ste 106, Mesa, AZ, 85202</div>
          </div>
        </div>
        <div className={'section'}>
          <div className={'sectionHeader'}>{'Payment Summary'}</div>
          <div className={'sectionCard'}>
            {CommonUtils.isNonEmptyObject(paymentCard) &&
              Object.entries(paymentCard)?.map(([key, value]) => <InfoCards title={key} value={value} />)}
          </div>
        </div>
        <div>
          <SelectedInvoiceList selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>
        <div className="invoice-sum-container">
          <div className="label">{`${selectedInvoices.length} invoice(s), amount to be paid:`}</div>{' '}
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
    </div>
  );
}

export default ReviewPayments;
