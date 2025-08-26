import React, { useContext, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import CommonUtils, { getFullName } from '@src/util/CommonUtils';
import { FooterContext } from '@src/components/footer/FooterContext';
import { RoutePaths } from '@src/routes/constants';
import AuthUtils from '@src/util/AuthUtils';

const OrderStatus = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPhysician = AuthUtils.isPhysician();
  const locationState = location?.state ?? {};
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);
  const contentRef = useRef(null);
  const { therapyConfig } = orderDetails;
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

  const { therapy = {}, orderCost, patient = {}, status: orderStatus, backendOrderId, approver, accountDetails } = orderDetails || {};
  const spOrder = accountDetails?.soldToAccount?.channelType === 'SPECIALITY_PHARMA';

  const isApprover = approver && typeof approver === 'object' && approver.id != null;

  const backToOrders = () => {
    const prevSearch = locationState.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  let message;

  if (isPhysician) {
    message = 'messages.prescriptionSuccess';
  } else if (orderStatus === 'SUBMITTED') {
    if (isApprover) {
      message = 'messages.orderApprovalSuccess';
    } else {
      message = 'messages.orderSuccess';
    }
  } else if (orderStatus === 'REVIEW') {
    message = 'messages.orderSuccessReviewPending';
  } else {
    message = 'messages.orderSuccessApprovalPending';
  }

  return (
    <div className={'MCP-module-wrapper'} ref={contentRef}>
      {isFetching && <Loader type={'screen'} />}

      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => {
            backToOrders();
          }}
          size="md">
          {t(isPhysician ? 'captions.btnBackToPrescriptions' : 'captions.btnBackToOrders')}
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
                  <Heading as={'h1'}>{t(isPhysician || spOrder ? 'headings.prescriptionSubmitted' : 'headings.orderSubmitted')}</Heading>
                  <p className={styles.orderSubmitDescription}>{t(message)}</p>
                </>
              )}
            </div>
          </div>
        }
      />
      <div className={'MCP-module-body'}>
        <div className="MCP-panel-container">
          <div className="grid grid-gap-12 sm:grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            {orderStatus === 'SUBMITTED' ? (
              <DetailSegment label={t(isPhysician ? 'labels.orderView.prescriptionId' : spOrder ? 'labels.orderId' : 'labels.sapId')} value={backendOrderId} />
            ) : (
              <DetailSegment label={t(isPhysician ? 'labels.orderView.prescriptionId' : spOrder ? 'labels.orderId' : 'labels.pdeId')} value={orderId} />
            )}
            <DetailSegment label={t('labels.materialDescription')} value={therapy?.materialDescription} />
            <DetailSegment label={t('labels.patientName')} value={getFullName(patient?.patientInfo) || '-'} />
          </div>
          <div className="grid grid-gap-12 sm:grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            {(therapyConfig?.isPIDRequired || patient?.patientIdentifier) && (
              <DetailSegment label={t('labels.patientIdentifier')} value={patient?.patientIdentifier || '-'} />
            )}

            <DetailSegment label={t('labels.dob')} value={patient?.patientInfo?.dateOfBirth || '-'} />
            <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender ? patient?.patientInfo?.gender : '-'} />
            {!(therapyConfig?.isPIDRequired || patient?.patientIdentifier) && <div></div>}

            {!spOrder && (
              <DetailSegment
                className={styles.orderCost}
                customLabelStyles={styles.orderCostItem}
                label={t('labels.orderCost')}
                customValueStyles={styles.orderCostItem}
                value={
                  <p className="dollarSign">
                    {orderCost !== null && orderCost !== undefined ? (
                      <>
                        <span className={`${styles.currencySymbol}`}>$</span>
                        {CommonUtils.formatNumberWithoutSymbol(orderCost)}
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                }
              />
            )}
          </div>
        </div>

        {orderStatus === 'SUBMITTED' && <OrderFlowSteps catalogConfiguration={orderDetails.catalogConfiguration} />}
      </div>
      <div className="footer-wrapper" ref={controlRef}>
        <div className={'controls footer-controls'}>
          <Button size="md" variant="secondary" onClick={printPage}>
            {t('captions.btnPrintSummary')}
          </Button>
          <Button size="md" variant="primary" onClick={backToOrders}>
            {t(isPhysician ? 'captions.btnGoToPrescriptions' : 'captions.btnGoToOrders')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
