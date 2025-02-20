import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as TickIcon } from '@src/assets/svg/tick-circle-filled.svg';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import CommonUtils from '@src/util/CommonUtils';

function OrderHeaderDetails({ orderDetails, therapyId, soldToAccountId, shipToAccountId, setInventoryTypeData, variant }) {
  const { t } = useTranslate();
  const [segments, setSegments] = React.useState([]);

  const { isLoading: isPriceApiLoading, data: priceDetails = null } = useQuery({
    queryKey: ['order', 'orderHeaderDetails', 'price', therapyId, soldToAccountId, shipToAccountId, variant],
    queryFn: async () => OrderService.getPriceDetails(therapyId, soldToAccountId, shipToAccountId, variant),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId && (!!variant || true),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (typeof setInventoryTypeData === 'function') {
        setInventoryTypeData(data.inventoryType);
      }
    }
  });

  React.useEffect(() => {
    const detailsSegments = [];
    const { therapy, author, accountDetails, patient, patientDetailsRequired, orderCost } = orderDetails || {};
    detailsSegments.push(
      <DetailSegment
        key={'therapy-description'}
        label={t('labels.therapyDescription')}
        value={
          <React.Fragment>
            <span>{therapy?.materialDescription || '-'}</span>
            <TickIcon width="16px" height="16px" />
          </React.Fragment>
        }
      />
    );
    if (accountDetails && accountDetails.soldToAccount) {
      detailsSegments.push(
        <DetailSegment
          key={'sold-to-account'}
          label={t('labels.orderByAccountNumber')}
          value={accountDetails.soldToAccount.accountNumber}
        />
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
              {priceDetails?.netPrice
                ? CommonUtils.formatNumberWithoutSymbol(priceDetails?.netPrice)
                : '----'}
            </span>
          }
        />
      </div>
    );

    setSegments([...detailsSegments]);
  }, [orderDetails, priceDetails]);

  return (
    <div className="MCP-CardContainer">
      <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>{segments}</div>
    </div>
  );
}

export default OrderHeaderDetails;
