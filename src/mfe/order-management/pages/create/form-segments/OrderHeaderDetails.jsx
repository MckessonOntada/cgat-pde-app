import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { InventoryIndicator } from './InventoryIndicator';
import './orderHeaderDetails.scss';
import { CHANNEL_TYPE } from './Constants';

function OrderHeaderDetails({ orderDetails, priceDetails = {}, status }) {
  const { t } = useTranslate();

  const detailsSegments = [];
  const {
    therapy,
    author,
    accountDetails,
    patient,
    patientDetailsRequired,
    orderCost
  } = orderDetails || {};
  detailsSegments.push(
    <DetailSegment
      key={'therapy-description'}
      label={t('labels.therapyDescription')}
      value={
        <div className="row-space-between-center therapy-description-wrapper">
          <div className="overflowing">
            {therapy?.materialDescription || '-'}
          </div>
          <InventoryIndicator status={status} />
        </div>
      }
    />
  );
  if (accountDetails && accountDetails.soldToAccount) {
    detailsSegments.push(
      <DetailSegment
        key={'sold-to-account'}
        className="textCapitalize"
        label={t('labels.orderByAccountNumber')}
        value={accountDetails.soldToAccount.accountNumber}
      />
    );
  }
  if (accountDetails && accountDetails.shipToAccount) {
    detailsSegments.push(
      <DetailSegment
        key={'ship-to-account'}
        className="textCapitalize"
        label={t('labels.shipToAccountNumber')}
        value={
          orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
            ? accountDetails?.shipToAccount?.id
            : accountDetails?.shipToAccount?.accountNumber
        }
      />
    );
  }
  if (patientDetailsRequired && patient) {
    const patientFullName =
      [patient.lastName, patient.firstName, patient.middleName]
        .filter(Boolean)
        .join(' ') || '-';
    detailsSegments.push(
      <DetailSegment
        key={'patient-name'}
        label={t('labels.patientName')}
        value={patientFullName}
      />
    );
  }

  detailsSegments.push(
    <div key={'price-details'} className={`price-wrap-container`}>
      <DetailSegment
        label={t('labels.price')}
        value={
          orderDetails?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? (
            <span className="dollarSign">
              <span>$</span>
              {priceDetails?.netPrice
                ? CommonUtils.formatNumberWithoutSymbol(priceDetails?.netPrice)
                : '----'}
            </span>
          ) : (
            'N/A'
          )
        }
      />
    </div>
  );

  return (
    <div className="MCP-CardContainer">
      <div
        className={`grid grid-gap-12 sm:grid-gap-32 grid-cols-1 md:grid-cols-2 lg:grid-cols-${detailsSegments.length} xl:grid-cols-${detailsSegments.length}`}>
        {detailsSegments}
      </div>
    </div>
  );
}

export default OrderHeaderDetails;
