import { GeographicUtils } from '@src/util/GeographicUtil';
import React from 'react';
import CommonUtils from '@src/util/CommonUtils';
import InfoCards from '@src/components/infoCards/InfoCards';

const MetricsCard = ({ selectedAccount, invoiceDetails, billDates }) => {
  const renderAccountInfo = () => (
    <div className="account-info">
      <div className="account-name">
        {CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount?.accountName : ''}
      </div>
      <div className="account-address">
        {selectedAccount ? GeographicUtils.addressAggregator(selectedAccount) : ''}
      </div>
    </div>
  );

  const renderInvoiceDetails = () =>
    Object.entries(invoiceDetails)?.map(([key, value], index) => (
      <div key={key} className={`element-row ${index % 2 === 0 ? 'left-column' : 'right-column'}`}>
        <div className="list-item">
          <div className="label">{key}</div>
          <div className="value">{value}</div>
        </div>
        {!(Object.values(invoiceDetails).length === index + 1 || Object.values(invoiceDetails).length === index + 2) && (
          <div className="border-separator"></div>
        )}
      </div>
    ));

  const renderBillDates = () =>
    Object.entries(billDates).map(([key, value]) => (
      <div key={key} className="info-cards-container">
        <InfoCards title={key} value={value} />
      </div>
    ));

  return (
    <>
      {CommonUtils.isNonEmptyObject(selectedAccount) && renderAccountInfo()}
      <div className="details-wrapper">{invoiceDetails && renderInvoiceDetails()}</div>
      <div className="bill-amount-wrapper">{renderBillDates()}</div>
    </>
  );
};

export default MetricsCard;
