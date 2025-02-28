import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { InventoryIndicator } from './InventoryIndicator';

function OrderHeaderDetails({ orderDetails, priceDetails = {}, status }) {
  const { t } = useTranslate();

  const detailsSegments = [];
  const { therapy, author, accountDetails, patient, patientDetailsRequired, orderCost } = orderDetails || {};
  detailsSegments.push(
    <DetailSegment
      key={'therapy-description'}
      label={t('labels.therapyDescription')}
      value={
        <div className="row-space-between-center therapy-description-wrapper">
          <div className="overflowing">{therapy?.materialDescription || '-'}</div>
          <InventoryIndicator status={status} />
        </div>
      }
    />
  );
  if (accountDetails && accountDetails.soldToAccount) {
    detailsSegments.push(
      <DetailSegment key={'sold-to-account'} label={t('labels.orderByAccountNumber')} value={accountDetails.soldToAccount.accountNumber} />
    );
  }
  if (accountDetails && accountDetails.shipToAccount) {
    detailsSegments.push(
      <DetailSegment key={'ship-to-account'} label={t('labels.shipToAccountNumber')} value={accountDetails.shipToAccount.accountNumber} />
    );
  }
  if (patientDetailsRequired && patient) {
    const patientFullName = [patient.lastName, patient.firstName, patient.middleName].filter(Boolean).join(' ') || '-';
    detailsSegments.push(<DetailSegment key={'patient-name'} label={t('labels.patientName')} value={patientFullName} />);
  }

  detailsSegments.push(
    <div key={'price-details'} className={`price-wrapper col-span-${5 - detailsSegments.length}`}>
      <DetailSegment
        label={t('labels.price')}
        value={
          <span className="dollarSign">
            <span>$</span>
            {priceDetails?.netPrice ? CommonUtils.formatNumberWithoutSymbol(priceDetails?.netPrice) : '----'}
          </span>
        }
      />
    </div>
  );

  return (
    <div className="MCP-CardContainer">
      <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>{detailsSegments}</div>
    </div>
  );
}

export default OrderHeaderDetails;
