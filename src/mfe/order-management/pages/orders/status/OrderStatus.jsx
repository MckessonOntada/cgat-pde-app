import React from 'react';
import styles from './OrderStatus.module.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-success.svg';
import StatusBreadcrumb from './StatusBreadcrumb';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useNavigate, useParams } from 'react-router-dom';
import DetailSegment from '@src/components/DetailSegment';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';

const details = {
  orderId: '12345',
  materialDescription: 'VENOFER 20MG/ML 5ML SDV PF NR',
  patientName: 'Adam Jones',
  patientIdentifier: '5682532',
  dateOfBirth: '11/19/1997',
  gender: 'Male',
  orderCost: '45,000'
};

const OrderStatus = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isFetching, formState, setCurrentOrder } = useManageOrder();

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ORDER_SUMMARY);
  }, []);

  const { therapy = {}, orderCost, patient } = formState.activeRecord || {};

  const backToOrders = () => {
    navigate('/orders');
  };

  return (
    <div className={'MCP-module-wrapper'}>
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => {
            backToOrders();
          }}
          size="md">
          {t('captions.btnBackToOrders')}
        </Button>
      </div>
      <ModuleHeader
        className={styles.customModuleHeader}
        heading={
          <div className={styles.flex}>
            <div className={styles.emblem}>
              <IconTick />
            </div>
            <div className={styles.content}>
              <Heading as={'h1'}>{t('headings.orderSubmitted')}</Heading>
              <p className={styles.orderSubmitDescription}>{t('messages.orderSuccessApprovalPending')}</p>
            </div>
          </div>
        }
      />
      <div className={'MCP-module-body'}>
        <div className="MCP-panel-container">
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            <DetailSegment label={t('labels.orderId')} value={orderId} />
            <DetailSegment label={t('labels.materialDescription')} value={therapy?.materialDescription} />
            <DetailSegment
              label={t('labels.patientName')}
              value={
                [patient?.patientInfo?.firstName, patient?.patientInfo?.middleName, patient?.patientInfo?.lastName]
                  .filter(Boolean) // Filters out null, undefined, or empty strings
                  .join(' ') || 'N/A'
              }
            />
          </div>
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            <DetailSegment
              label={t('labels.patientIdentifier')}
              value={patient?.patientInfo?.patientIdentifier ? patient?.patientInfo?.patientIdentifier : 'N/A'}
            />
            <DetailSegment label={t('labels.dob')} value={patient?.patientInfo?.dob ? patient?.patientInfo?.dob : 'N/A'} />
            <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender ? patient?.patientInfo?.gender : 'N/A'} />
            <DetailSegment
              className={styles.orderCost}
              customLabelStyles={styles.orderCostItem}
              label={t('labels.price')}
              customValueStyles={styles.orderCostItem}
              value={<p className={`${styles.price}`}>{orderCost ? `$${orderCost}` : 'N/A'}</p>}
            />
          </div>
        </div>
        <div className="MCP-panel-container">
          <div className={`${styles.orderFlow}`}>
            <h4 className={styles.customSecondaryHeading}>{t('labels.whatToExpect')}</h4>
            <StatusBreadcrumb />
          </div>
        </div>
      </div>
      <div className={'controls'}>
        <Button size="md" variant="secondary" disabled={true}>
          {t('captions.btnPrintSummary')}
        </Button>
        <Button size="md" variant="primary" onClick={() => backToOrders()}>
          {t('captions.btnGoToOrders')}
        </Button>
      </div>
    </div>
  );
};

export default OrderStatus;
