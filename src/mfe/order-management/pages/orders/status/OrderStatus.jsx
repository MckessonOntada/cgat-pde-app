import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './OrderStatus.module.scss';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-success.svg';
import OrderFlowSteps from './orderFlowSteps/OrderFlowSteps';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import useOrder from '../useOrder';
import { useCustomPrint } from '@src/util/printUtils';

const OrderStatus = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails = {}, isFetching, isError, error } = useOrder(orderId);
  const contentRef = useRef(null);

  const printPage = useCustomPrint(
    contentRef,`
    .MCP-CardContainer .print-div{
      display: flex;
    }
    .MCP-CardContainer .print-div > div{
      width: 180px;
    }`
  );
  const orderStatus = orderDetails?.status;

  const { therapy = {}, orderCost, patient } = orderDetails || {};

  const backToOrders = () => {
    navigate('/orders');
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className={'MCP-module-wrapper'} ref={contentRef}>
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
              {orderStatus && orderStatus !== 'SUBMITTED' && (
                <>
                  <Heading as={'h1'}>{t('headings.orderSubmitted')}</Heading>
                  <p className={styles.orderSubmitDescription}>{t('messages.orderSuccessApprovalPending')}</p>
                </>
              )}
              {orderStatus === 'SUBMITTED' && (
                <>
                  <Heading as={'h1'}>{t('headings.orderApproved')}</Heading>
                  <p className={styles.orderSubmitDescription}>{t('messages.orderApprovalSuccess')}</p>
                </>
              )}
            </div>
          </div>
        }
      />
      <div className={'MCP-module-body'}>
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            <DetailSegment label={t('labels.orderId')} value={orderId} />
            <DetailSegment label={t('labels.materialDescription')} value={therapy?.materialDescription} />
            <DetailSegment
              label={t('labels.patientName')}
              value={
                [patient?.patientInfo?.firstName, patient?.patientInfo?.middleName, patient?.patientInfo?.lastName]
                  .filter(Boolean) // Filters out null, undefined, or empty strings
                  .join(' ') || '-'
              }
            />
          </div>
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            <DetailSegment label={t('labels.patientIdentifier')} value={patient?.patientIdentifier || '-'} />
            <DetailSegment label={t('labels.dob')} value={patient?.patientInfo?.dateOfBirth || '-'} />
            <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender ? patient?.patientInfo?.gender : '-'} />
            <p className="price-wrapper">
              <DetailSegment
                className={styles.orderCost}
                customLabelStyles={styles.orderCostItem}
                label={t('labels.price')}
                customValueStyles={styles.orderCostItem}
                value={
                  <p className="dollarSign">
                    {orderCost ? (
                      <>
                        <span className={`${styles.currencySymbol}`}>$</span>
                        {parseFloat(orderCost).toFixed(2)}
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                }
              />
            </p>
          </div>
        </div>

        {orderStatus === 'SUBMITTED' && <OrderFlowSteps catalogConfiguration={orderDetails.catalogConfiguration} />}
      </div>
      <div className={'controls'}>
        <Button size="md" variant="secondary" onClick={() => printPage()}>
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
