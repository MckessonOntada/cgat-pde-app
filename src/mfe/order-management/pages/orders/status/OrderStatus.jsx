import React, { useContext, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import CommonUtils, { getUSFullName } from '@src/util/CommonUtils';
import { FooterContext } from '@src/components/footer/FooterContext';
import { RoutePaths } from '@src/routes/constants';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';

const OrderStatus = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state ?? {};
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {}, isApprover } = state;
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

  const { therapy = {}, orderCost, patient = {}, status: orderStatus, backendOrderId, accountDetails } = orderDetails || {};
  const spOrder = accountDetails?.soldToAccount?.channelType === 'SPECIALITY_PHARMA';

  const isPhysician = AuthUtils.isPhysician();
  const isCSReviewer = AuthUtils.isCustomerCenter() && AuthUtils.isCustomerCenterView();
  const isOrgUser = !AuthUtils.isSystemAdminView();

  const backToOrders = () => {
    const prevSearch = locationState.__prevSearch || '';
    setValue('orderDetails', {});
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  let message;

  if (isOrgUser) {
    if (orderStatus === 'SUBMITTED') message = 'Your order has been submitted successfully and is in line for fulfillment.';
    else if (orderStatus === 'APPROVAL_PENDING') message = 'Your order has been submitted successfully and is now pending for approval.';
    else if (orderStatus === 'CS_REVIEW') message = 'Your order has been submitted successfully and is now in Customer Service review.';
  } else if (isCSReviewer) {
    if (orderStatus === 'SUBMITTED') message = 'Your order has been submitted successfully and is in line for fulfillment.';
  } else if (isApprover) {
    if (orderStatus === 'SUBMITTED') message = 'Your order has been approved successfully and is in line for fulfillment.';
    else if (orderStatus === 'CS_REVIEW') message = 'Your order was approved successfully and is currently in Customer Service review.';
  } else if (isPhysician) {
    message = 'messages.prescriptionSuccess';
  } else if (orderStatus === 'SUBMITTED') {
    message = 'messages.orderSuccess';
  } else if (orderStatus === 'REVIEW') {
    message = 'messages.orderSuccessReviewPending';
  } else {
    message = 'messages.orderSuccessApprovalPending';
  }
  const patientName =
    !orderDetails?.rules?.hasImpersonatedUserPhiPermission && patient?.patientInfo?.firstName === '******'
      ? patient?.patientInfo?.firstName
      : CommonUtils.getUSFullName({ ...patient?.patientInfo });

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
          {t(isPhysician ? 'captions.btnBackToPrescriptions' : 'captions.btnBackToOrders')}
        </Button>
      </div>
      <ModuleHeader
        className={styles.customModuleHeader}
        heading={
          <div className={styles.flex}>
            <div className={styles.emblem}>
              <IconTick width={'64px'} height={'64px'} />
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
              <DetailSegment
                label={t(spOrder ? 'labels.orderId' : 'labels.sapId')}
                value={
                  <Link className="MCP-table-link" to={`${RoutePaths.pathOrderManagement}/${orderId}/summary`} state={locationState}>
                    {backendOrderId}
                  </Link>
                }
                noTooltip
              />
            ) : (
              <DetailSegment
                label={t(spOrder ? 'labels.orderId' : 'labels.inspiroLinkId')}
                value={
                  <Link className="MCP-table-link" to={`${RoutePaths.pathOrderManagement}/${orderId}/summary`} state={locationState}>
                    {orderId}
                  </Link>
                }
                noTooltip
              />
            )}
            <DetailSegment label={t('labels.therapy')} value={therapy?.materialDescription} />
            {patientName ? <DetailSegment label={t('labels.patientName')} value={patientName} /> : <div></div>}
          </div>
          <div className="grid grid-gap-12 sm:grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 print-div">
            {(therapyConfig?.isPIDRequired || patient?.patientIdentifier) && (
              <DetailSegment label={t('labels.patientIdentifier')} value={patient?.patientIdentifier} />
            )}

            {patient?.patientInfo?.dateOfBirth ? <DetailSegment label={t('labels.dob')} value={patient?.patientInfo?.dateOfBirth} /> : <div></div>}
            {patient?.patientInfo?.gender ? (
              <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender === 'Masked' ? '******' : patient?.patientInfo?.gender || '-'} />
            ) : (
              <div></div>
            )}
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
