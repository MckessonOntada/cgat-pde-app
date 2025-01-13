import React, { useEffect, useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import InfoCards from '@src/components/infoCards/InfoCards';

import CommonUtils from '@src/util/CommonUtils';

import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

import './index.scss';
import SelectedInvoiceList from './SelectedInvoiceList';
import { useLocation } from 'react-router-dom';

function ReviewPayments() {
  const { t } = useTranslate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  useEffect(() => {
    console.log('location..', location);
  }, []);

  const location = useLocation();
  const { state } = location;
  const { includeinvoiceData } = state || {};

  console.log('includeinvoiceData', includeinvoiceData);
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
          <SelectedInvoiceList />
        </div>
      </div>
    </div>
  );
}

export default ReviewPayments;
