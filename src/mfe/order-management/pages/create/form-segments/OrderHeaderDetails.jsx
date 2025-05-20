import React, { useEffect, useState } from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils, { getFullName } from '@src/util/CommonUtils';
import { InventoryIndicator } from './InventoryIndicator';
import './orderHeaderDetails.scss';
import { CHANNEL_TYPE } from './Constants';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';

function OrderHeaderDetails({ orderDetails, priceDetails = {}, status, selectedAccount = {} }) {
  const { t } = useTranslate();

  const therapy = orderDetails?.therapy ?? {};
  const accountDetails = isValidAccount(selectedAccount) ? selectedAccount : orderDetails?.accountDetails;
  const patient = orderDetails?.patient ?? {};
  const patientDetailsRequired = orderDetails?.patientDetailsRequired ?? false;
  const channelType = accountDetails?.soldToAccount?.channelType ? accountDetails?.soldToAccount?.channelType : selectedAccount?.channelType;

  const detailsSegments = [
    therapy?.materialDescription && (
      <DetailSegment
        key={'therapy-description'}
        label={t('labels.therapyDescription')}
        value={
          <div className="row-space-between-center therapy-description-wrapper">
            <div className="overflowing">{therapy.materialDescription || '-'}</div>
            <InventoryIndicator status={status} />
          </div>
        }
      />
    ),
    accountDetails?.soldToAccount && accountDetails?.shipToAccount && (
      <DetailSegment
        key={'sold-to-account'}
        className="textCapitalize"
        label={t('labels.soldToAccountAddress')}
        value={getAddress(accountDetails.soldToAccount.address)}
      />
    ),
    accountDetails?.shipToAccount && (
      <DetailSegment
        key={'ship-to-account'}
        className="textCapitalize"
        label={t('labels.shipToAccountAddress')}
        value={
          typeof accountDetails?.shipToAccount?.address === 'string'
            ? accountDetails?.shipToAccount?.address
            : getAddress(accountDetails?.shipToAccount?.address)
        }
      />
    ),
 
    accountDetails?.soldToAccount &&
      accountDetails?.shipToAccount &&
      patientDetailsRequired &&
      patient &&
      Object.keys(patient).length > 0 && (
        <DetailSegment
          key={'patient-name'}
          label={t('labels.patientDetails')}
          value={`${
            patient?.patientInfo ? `${getFullName(patient.patientInfo)}, ` : ''
          }${
            patient?.patientIdentifier ? `ID: ${patient.patientIdentifier}` : ''
          }${
            patient?.medicalRecordNumber
              ? `, MRN: ${patient.medicalRecordNumber}`
              : ''
          }`}
        />
      ),
 
    priceDetails && Object.keys(priceDetails).length > 0 && (
      <div key={'price-details'} className={`price-wrap-container`}>
        <DetailSegment
          label={t('labels.estimatedPrice')}
          value={
            <span className="dollarSign">
              <span>$</span>
              {priceDetails?.netPrice ? CommonUtils.formatNumberWithoutSymbol(priceDetails.netPrice) : '----'}
            </span>
          }
        />
      </div>
    )
  ].filter(Boolean);

  return (
    <div key={priceDetails?.netPrice} className="MCP-CardContainer">
      <div
        className={`grid grid-gap-12 sm:grid-gap-32 grid-cols-1 md:grid-cols-2 lg:grid-cols-${detailsSegments.length} xl:grid-cols-${detailsSegments.length}`}>
        {detailsSegments}
      </div>
    </div>
  );
}

const isValidAccount = (account) => {
  if (!account || typeof account !== 'object') {
    return false;
  }
  // Check if shipToAccount exists and is an object
  const isShipToValid = account.shipToAccount && typeof account.shipToAccount === 'object' && Object.keys(account.shipToAccount).length > 0;

  // Check if soldToAccount exists and is an object
  const isSoldToValid = account.soldToAccount && typeof account.soldToAccount === 'object' && Object.keys(account.soldToAccount).length > 0;

  return isShipToValid && isSoldToValid;
};
export default OrderHeaderDetails;
