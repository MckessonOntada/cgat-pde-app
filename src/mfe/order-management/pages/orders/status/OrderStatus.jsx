import React, { useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './OrderStatus.module.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-success.svg';
import OrderFlowSteps from './orderFlowSteps/OrderFlowSteps';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import useOrder from '../useOrder';
import { useCustomPrint } from '@src/util/printUtils';
import CommonUtils, { getFullName } from '@src/util/CommonUtils';
import { FooterContext } from '@src/components/footer/FooterContext';

const OrderStatus = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    data: orderDetails = {},
    isFetching,
    isError,
    error,
    isLoader
  } = useOrder(orderId);
  const contentRef = useRef(null);
  const { controlRef } = useContext(FooterContext);

  const printPage = useCustomPrint(
    contentRef,
    `
    .MCP-CardContainer .print-div{
      display: flex;
    }
    .MCP-CardContainer .print-div > div{
      width: 180px;
    }`
  );

  const {
    therapy = {},
    orderCost,
    patient = {},
    status: orderStatus,
    backendOrderId,
    approver,
    accountDetails
  } = orderDetails || {};
  const spOrder =
    accountDetails?.soldToAccount?.channelType === 'SPECIALITY_PHARMA';

  const isApprover =
    approver && typeof approver === 'object' && approver.id != null;

  const backToOrders = () => navigate('/orders');

  if (isLoader) {
    return isLoader;
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
              {orderStatus && (
                <>
                  <Heading as={'h1'}>{t('headings.orderSubmitted')}</Heading>
                  <p className={styles.orderSubmitDescription}>
                    {t(
                      orderStatus === 'SUBMITTED'
                        ? isApprover
                          ? 'messages.orderApprovalSuccess'
                          : 'messages.orderSuccess'
                        : 'messages.orderSuccessApprovalPending'
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        }
      />
      <div className={'MCP-module-body'}>
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-12 sm:grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            {orderStatus === 'SUBMITTED' ? (
              <DetailSegment
                label={t(!spOrder ? 'labels.sapId' : 'labels.orderId')}
                value={backendOrderId}
              />
            ) : (
              <DetailSegment
                label={t(!spOrder ? 'labels.pdeId' : 'labels.orderId')}
                value={orderId}
              />
            )}
            <DetailSegment
              label={t('labels.materialDescription')}
              value={therapy?.materialDescription}
            />
            <DetailSegment
              label={t('labels.patientName')}
              value={getFullName(patient?.patientInfo) || '-'}
            />
          </div>
          <div className="grid grid-gap-12 sm:grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            <DetailSegment
              label={t('labels.patientIdentifier')}
              value={patient?.patientIdentifier || '-'}
            />
            <DetailSegment
              label={t('labels.dob')}
              value={patient?.patientInfo?.dateOfBirth || '-'}
            />
            <DetailSegment
              label={t('labels.gender')}
              value={
                patient?.patientInfo?.gender
                  ? patient?.patientInfo?.gender
                  : '-'
              }
            />

            <DetailSegment
              className={styles.orderCost}
              customLabelStyles={styles.orderCostItem}
              label={t('labels.price')}
              customValueStyles={styles.orderCostItem}
              value={
                <p className="dollarSign">
                  {!spOrder ? (
                    orderCost ? (
                      <>
                        <span className={`${styles.currencySymbol}`}>$</span>
                        {CommonUtils.formatNumberWithoutSymbol(orderCost)}
                      </>
                    ) : (
                      '-'
                    )
                  ) : (
                    'N/A'
                  )}
                </p>
              }
            />
          </div>
        </div>

        {orderStatus === 'SUBMITTED' && (
          <OrderFlowSteps
            catalogConfiguration={orderDetails.catalogConfiguration}
          />
        )}
      </div>
      <div className="footer-wrapper" ref={controlRef}>
        <div className={'controls footer-controls'}>
          <Button size="md" variant="secondary" onClick={() => printPage()}>
            {t('captions.btnPrintSummary')}
          </Button>
          <Button size="md" variant="primary" onClick={() => backToOrders()}>
            {t('captions.btnGoToOrders')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
