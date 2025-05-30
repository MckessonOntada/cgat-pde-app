import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useAccountContext } from '../context/AccountContext';
import CommonUtils from '@src/util/CommonUtils';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useNavigate } from 'react-router-dom';

/*
Ex:
const invoiceDetails = {
    Bill: 339829172,
    Reference: 339829172,
    'PO#': 'LYNX_CART_231207115913',
    'Payment Term': '1-15,N25TH/16-EOM,N10TH PROX',
  };

 const billDates = {
   'Amount Due': '$2318.23',
   'Due Date': 'Dec 25, 2024',
   'Bill Date': 'Dec 07, 2024'
 };
*/

export default function ViewDetails(props) {
  const { backText, billNumber, invoiceDetails, billDates, invoiceList, creditsList, footer } = props;
  const { t } = useTranslate();
  const { selectedAccount } = useAccountContext();
  const navigate = useNavigate();
  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };
  return (
    <div className="view-details-container">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={onBackToPaymentsInvoices} size="md">
          {backText || t('paymentInvoices.Details.backToManageInvoices')}
        </Button>
      </div>
      <Heading>{billNumber || '-'}</Heading>
      <div className="card-container">
        {CommonUtils.isNonEmptyObject(selectedAccount) && (
          <div className="account-info">
            <div className="account-name">{CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount?.accountName : ''}</div>
            <div className="account-address">{selectedAccount ? GeographicUtils.addressAggregator(selectedAccount) : ''}</div>
          </div>
        )}
        <div className="details-wrapper">
          {invoiceDetails &&
            Object.entries(invoiceDetails)?.map(([key, value], index) => (
              <div className={`element-row ${index % 2 == 0 ? `left-column` : `right-column`}`}>
                <div className="list-item">
                  <div className="label">{key}</div>
                  <div className="value">{value}</div>
                </div>
                {!(Object.values(invoiceDetails).length === index + 1 || Object.values(invoiceDetails).length === index + 2) && (
                  <div className="border-separator"></div>
                )}
              </div>
            ))}
        </div>
        <div className="bill-amount-wrapper">
          {billDates &&
            Object.entries(billDates).map(([key, value]) => (
              <div key={key} className="bill-amount-container">
                <div className="label">{key}</div>
                <div className="value">{value}</div>
              </div>
            ))}
        </div>
        {invoiceList && (
          <div className="table-container">
            <Heading as="h1">Invoice List</Heading>
            <React.Fragment>{invoiceList}</React.Fragment>
          </div>
        )}
        {creditsList && (
          <div className="table-container">
            <Heading as="h1">Credits List</Heading>
            <React.Fragment>{creditsList}</React.Fragment>
          </div>
        )}
      </div>
      {footer && <div className="footer-section">{footer}</div>}
    </div>
  );
}
