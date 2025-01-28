import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import { ReactComponent as TickIcon } from '@src/assets/svg/tick-circle-filled.svg';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';

function OrderHeaderDetails({ therapyId, soldToAccountId, shipToAccountId, setInventoryTypeData, variant }) {
  const { t } = useTranslate();
  const { formState } = useManageOrder();
  const [segments, setSegments] = React.useState([]);

  const { isLoading: isPriceApiLoading, data: priceDetails = {} } = useQuery({
    queryKey: ['order', 'orderHeaderDetails', 'price', therapyId, soldToAccountId, shipToAccountId, variant],
    queryFn: async () => OrderService.getPriceDetails(therapyId, soldToAccountId, shipToAccountId, variant),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId && (!!variant || true),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (typeof setInventoryTypeData === 'function') {
        setInventoryTypeData(data.netPrice);
      }
    }
  });

  React.useEffect(() => {
    const detailsSegments = [];
    const { therapy, author, accountDetails, patient, patientDetailsRequired, orderCost } = formState.activeRecord || {};
    detailsSegments.push(
      <DetailSegment
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
      detailsSegments.push(<DetailSegment label={t('labels.orderByAccountNumber')} value={accountDetails.soldToAccount.accountNumber} />);
    }
    if (accountDetails && accountDetails.shipToAccount) {
      detailsSegments.push(<DetailSegment label={t('labels.shipToAccountNumber')} value={accountDetails.shipToAccount.accountNumber} />);
    }
    if (patientDetailsRequired && patient) {
      const patientFullName = [patient.lastName, patient.firstName, patient.middleName].filter(Boolean).join(' ') || '-';
      detailsSegments.push(<DetailSegment label={t('labels.patientName')} value={patientFullName} />);
    }

    detailsSegments.push(
      <div className={`price-wrapper col-span-${5 - detailsSegments.length}`}>
        <DetailSegment
          label={t('labels.price')}
          value={
            <span className="dollarSign">
              <span>$</span>
              {priceDetails.netPrice || '----'}
            </span>
          }
        />
      </div>
    );

    setSegments([...detailsSegments]);
  }, [formState.activeRecord, priceDetails]);
  return (
    <div className="MCP-CardContainer">
      <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>{segments}</div>
    </div>
  );
}

export default OrderHeaderDetails;
