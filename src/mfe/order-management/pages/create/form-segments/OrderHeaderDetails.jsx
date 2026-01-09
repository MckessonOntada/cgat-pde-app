import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { InventoryIndicator } from './InventoryIndicator';
import './orderHeaderDetails.scss';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';
import { Tooltip } from '@mckesson/mcp-component-library';
import { CHANNEL_TYPE } from './Constants';

function OrderHeaderDetails({ orderDetails = {}, priceDetails = {}, status, selectedAccount = {}, channelType, page = '' }) {
  const { t } = useTranslate();
  const { therapy = {}, patient = {}, tradeDetails = {} } = orderDetails;
  const accountDetails = isValidAccount(selectedAccount) ? selectedAccount : orderDetails?.accountDetails;
  const patientDetailsRequired = orderDetails?.patientDetailsRequired ?? false;
  const isBuyAndBillOrder = channelType === CHANNEL_TYPE.BUY_AND_BILL;
  const formatFieldWithPrefixSuffix = (value, fieldName) => {
    if (!value) return '';
    const config =
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    const regexFormat = config?.find((f) => f.fieldName === fieldName)?.properties?.fieldFormat?.validationFormat;
    if (page !== 'patient-details') {
      return value;
    }
    const prefix = regexFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = regexFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

    return `${prefix ?? ''}${value}${suffix ?? ''}`;
  };

  const detailsSegments = [];
  if (tradeDetails.tradeName || therapy.materialDescription) {
    detailsSegments.push(
      <DetailSegment
        key={'therapy-description'}
        label={t('labels.therapyDescription')}
        value={
          <div className="row-space-between-center therapy-description-wrapper">
            <Tooltip body={therapy.materialDescription}>
              <div className="overflowing">
                {tradeDetails.tradeName} {therapy.materialDescription ? `(${therapy.materialDescription})` : null}
              </div>
            </Tooltip>
            {isBuyAndBillOrder && <InventoryIndicator status={status} />}
          </div>
        }
      />
    );
  } else {
    detailsSegments.push(<div></div>);
  }
  if (accountDetails?.soldToAccount) {
    detailsSegments.push(
      <DetailSegment
        key={'sold-to-account'}
        className="textCapitalize"
        label={t('labels.soldToAccountAddress')}
        value={getAddress(accountDetails.soldToAccount.address)}
      />
    );
  } else {
    detailsSegments.push(<div></div>);
  }
  if (accountDetails?.shipToAccount) {
    detailsSegments.push(
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
    );
  } else {
    detailsSegments.push(<div></div>);
  }

  if (accountDetails?.soldToAccount && accountDetails?.shipToAccount && patientDetailsRequired && patient && Object.keys(patient).length > 0) {
    detailsSegments.push(
      <DetailSegment
        key={'patient-name'}
        label={t('labels.patientDetails')}
        value={[
          patient?.patientInfo && CommonUtils.getUSFullName(patient.patientInfo),
          patient?.patientIdentifier && `ID: ${formatFieldWithPrefixSuffix(patient.patientIdentifier, 'patientIdentifier')}`,
          patient?.medicalRecordNumber && `MRN: ${formatFieldWithPrefixSuffix(patient.medicalRecordNumber, 'medicalRecordNumber')}`
        ]
          .filter(Boolean)
          .join(', ')}
      />
    );
  } else {
    detailsSegments.push(<div></div>);
  }

  if (priceDetails && Object.keys(priceDetails).length > 0) {
    detailsSegments.push(
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
    );
  } else {
    detailsSegments.push(<div></div>);
  }

  return (
    <div key={priceDetails?.netPrice} className="MCP-panel-container">
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

  const { shipToAccount, soldToAccount } = account;
  // Check if shipToAccount exists and is an object
  const isShipToValid = shipToAccount && typeof shipToAccount === 'object' && CommonUtils.isNonEmptyObject(shipToAccount);

  // Check if soldToAccount exists and is an object
  const isSoldToValid = soldToAccount && typeof soldToAccount === 'object' && CommonUtils.isNonEmptyObject(soldToAccount);

  return isShipToValid || isSoldToValid;
};
export default OrderHeaderDetails;
