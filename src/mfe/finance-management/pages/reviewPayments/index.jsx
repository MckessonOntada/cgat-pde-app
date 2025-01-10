import React, { useEffect, useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import InfoCards from '@src/components/infoCards/InfoCards';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import SelectedInvoiceList from './SelectedInvoiceList';
import { useLocation } from 'react-router-dom';

const data = [
  {
    currency: 'USD',
    billAmount: 24378.7,
    openAmount: 24378.7,
    paymentTerm: 'Due in 15 days',
    isPdfAvailable: true,
    status: 'OVERDUE',
    billNumber: '3344041234',
    soldToSite: 'act12345',
    billDate: '14/02/2024',
    dueDate: '20/12/2024',
    description: null
  },
  {
    currency: 'USD',
    billAmount: 2134.4,
    openAmount: 2134.4,
    paymentTerm: 'Due in 30 days',
    isPdfAvailable: false,
    status: 'OVERDUE',
    billNumber: '3344041246',
    soldToSite: 'act67654',
    billDate: '09/03/2024',
    dueDate: '08/01/2025',
    description: null
  },
  {
    currency: 'USD',
    billAmount: 5421.3,
    openAmount: 5421.3,
    paymentTerm: 'Due in 35 days',
    isPdfAvailable: true,
    status: null,
    billNumber: '3344041247',
    soldToSite: 'act99887',
    billDate: '10/03/2024',
    dueDate: '15/01/2025',
    description: null
  }
];

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.invoices && location.state?.invoices.length > 0) {
      // let _data = location.state?.invoices.map((item) => ({ ...item, paymentAmount: item.openAmount }));
      let _data = data.map((item) => ({ ...item, paymentAmount: item.openAmount }));
      console.log('location..', location, _data);
      setSelectedInvoices(_data);
    }
  }, []);

  const paymentCard = {
    'Schedule option': 'Pay Today',
    'Net amount to be charged': '$8,129.91',
    'Payment method': '4600 - FIRST CITIZENS BANK & TRUST CO'
  };

  const backButtonClick = () => {};

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
        {/* <div className={'section'}>
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
        </div> */}
        <div>
          <SelectedInvoiceList selectedInvoices={selectedInvoices} setSelectedInvoices={setSelectedInvoices} />
        </div>
      </div>
    </div>
  );
}

export default ReviewPayments;
