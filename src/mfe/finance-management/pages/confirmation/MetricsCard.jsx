import { GeographicUtils } from '@src/util/GeographicUtil';
import React from 'react';
import CommonUtils from '@src/util/CommonUtils';
import DetailMetrics from '../../components/detailMetrics/DetailMetrics';
import DetailsFlexGrid from '../../components/detailsList/DetailsFlexGrid';

const MetricsCard = ({ selectedAccount, invoiceDetails, billDates }) => {
  const renderAccountInfo = () => {
    if (!CommonUtils.isNonEmptyObject(selectedAccount)) return null;

    const accountName = CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount.accountName : '';
    const accountAddress = selectedAccount ? GeographicUtils.addressAggregator(selectedAccount) : '';

    return (
      <div className="account-info">
        <div className="account-name">{accountName}</div>
        <div className="account-address">{accountAddress}</div>
      </div>
    );
  };

  return (
    <>
      {renderAccountInfo()}
      {invoiceDetails && <DetailsFlexGrid invoiceDetails={invoiceDetails} />}
      {billDates && <DetailMetrics data={billDates} />}
    </>
  );
};

export default MetricsCard;
