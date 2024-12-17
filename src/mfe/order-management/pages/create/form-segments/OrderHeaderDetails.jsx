import React from 'react';
import DetailSegment from '@src/components/DetailSegment';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import { ReactComponent as TickIcon } from '@src/assets/svg/tick-circle-filled.svg';

function OrderHeaderDetails() {
  const { t } = useTranslate();
  const { formState } = useManageOrder();
  const [segments, setSegments] = React.useState([]);
  React.useEffect(() => {
    const { therapy, author, accountDetails, patient, orderCost } = formState.activeRecord || {};
    segments.push(
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
    if (author && author.id) {
      segments.push(<DetailSegment label={t('labels.orderByAccountNumber')} value={author.id} />);
    }
    if (accountDetails && accountDetails.shipToAccount) {
      segments.push(<DetailSegment label={t('labels.shipToAccountNumber')} value={accountDetails.shipToAccount.accountNumber} />);
    }
    if (patient) {
      const patientFullName = [`${patient.lastName},`, patient.firstName, patient.middleName].join(' ');
      segments.push(<DetailSegment label={t('labels.patientName')} value={patientFullName} />);
    }

    segments.push(
      <div className="price-wrapper">
        <DetailSegment label={t('labels.price')} value={orderCost || '--'} />
      </div>
    );

    setSegments([...segments]);
  }, []);
  return (
    <div className="MCP-panel-container">
      <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>{segments}</div>
    </div>
  );
}

export default OrderHeaderDetails;
