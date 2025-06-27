import React, { useContext, useRef } from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, CheckboxGroup, Heading, Loader, Badge, Tooltip, Label } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailSegment from '@src/components/DetailSegment';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import useAlert from '@src/hooks/useAlert';
import PermittedComponent from '@src/components/permitted-component';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation, useQuery } from 'react-query';
import { RoutePaths } from '@src/routes/constants';
import { SAPOrderStatusEnum, StatusEnum } from '../../../orders/constants';
import { renderModal } from '@src/util/ModalUtil';
import CommentPanel from './CommentPanel';
import AuthUtils from '@src/util/AuthUtils';
import OrderStepper from '../OrderStepper';
import useOrder from '../../../orders/useOrder';
import { useCustomPrint } from '@src/util/printUtils';
import CommonUtils, { getAddress } from '@src/util/CommonUtils';
import { CUSTOMER_CENTRE, SYSTEM_ADMIN } from '@src/api/commonService/CommonService';
import { InventoryIndicator } from '../InventoryIndicator';
import useSapOrder from './useSapOrder';
import useTimedArray from './useTimedArray';
import { getFullName } from '@src/util/CommonUtils';
import { CGAT_IDENTIFIER, CHANNEL_TYPE } from '../Constants';
import dayjs from 'dayjs';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { FooterContext } from '@src/components/footer/FooterContext';
import InfoModel from '@src/components/InfoModel/indix';
import Alert from '@src/components/cgat-alert/Alert';
import AttachmentCard from './AttachmentCard';
import { TherapyDetailsConstantsForBB } from '../therapy-selection/assets/constants/TherapyDetailsConstants';

const ALERT_CONTAINER_ID = 'summary-alert-container';
const BUTTON_ACTIONS = {
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject'
};

const getOrderCost = (originalOrderCost, updatedOrderCost) => {
  let orderCost = originalOrderCost;

  if (!updatedOrderCost || isNaN(updatedOrderCost)) orderCost = originalOrderCost;
  else if (parseFloat(orderCost) !== parseFloat(updatedOrderCost)) orderCost = updatedOrderCost;

  return CommonUtils.formatNumberWithoutSymbol(orderCost);
};

const Summary = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { state: locationState = {} } = useLocation();
  const { orderId } = useParams();
  const { showAlert } = useAlert();
  const { controlRef } = useContext(FooterContext);
  const { data: orderDetails = {}, isLoader, isError, error } = useOrder(orderId);
  const { isApprover = false, isSimulate = false, backToInvoiceListing = false } = locationState || {};
  const [orderAgreementCheckboxError, setOrderAgreementCheckboxError] = React.useState(null);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = React.useState(false);
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const [sapStatus, setSapStatus] = React.useState(null);
  const [inventoryStatus, setInventoryStatus] = React.useState(null);
  const {
    therapy = {},
    catalog = {},
    orderCost,
    accountDetails = {},
    patient = {},
    additionalDetails = {},
    patientDetailsRequired = false,
    rejectionDetails,
    paporder: isPapOrder,
    backendOrderId,
    status,
    payerDetails,
    provider,
    submittedBy,
    isCoiIdRequired
  } = orderDetails || {};

  React.useEffect(() => {
    if (isError) {
      addNotification({
        type: 'error',
        description: error.message || 'Something went wrong please try again.'
      });
    }
  }, [isError]);

  const [openDetails, setOpenDetails] = React.useState(false);
  const spOrder = orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;

  const {
    data: sapOrderDetails,
    isLoading: isLoadingSapOrderStatus,
    refetch: retrySapOrderStatus
  } = useSapOrder(
    {
      sapOrderId: backendOrderId,
      salesOrgId: accountDetails.soldToAccount?.salesOrg,
      status,
      isSPOrder: spOrder
    },
    (status) => setSapStatus(status),
    (error) => {
      addNotification({
        description: 'Something went wrong while checking SAP order status. Please try again later.',
        type: 'error',
        kind: 'SAP_ORDER_STATUS'
      });
    }
  );

  const getInventoryStatus = async () => {
    try {
      const response = await OrderService.getInventoryStatus(orderDetails.id);
      if (response.status === 200) {
        handleInventoryDetailsResponse(response.data);
      }
    } catch (error) {
      addNotification({
        description: 'Something went wrong while checking inventory. Please try again later.',
        type: 'error',
        isSticky: true
      });
      setInventoryStatus('PENDING');
    }
  };

  React.useEffect(() => {
    if (!orderDetails.id || status === StatusEnum.SUBMITTED || status === StatusEnum.REJECTED || status === 'DELETED') {
      return;
    }
    if (catalog.inventoryType === 'T') {
      setInventoryStatus('DROP_SHIP');
    } else if (catalog.inventoryType === 'S' || catalog.inventoryType === 'I') {
      setInventoryStatus('CHECKING');
      getInventoryStatus();
    } else {
      console.log('Inventory type not supported');
    }
    if (orderDetails.id) {
      setPapOrderOptions((prevState) => ({
        ...prevState,
        isChecked: Boolean(orderDetails.paporder)
      }));
    }
  }, [orderDetails]);

  const handleInventoryDetailsResponse = (data = {}) => {
    const { erroredItems, warningMessages } = data.inventoryCheckResponse || {};
    if (erroredItems?.length > 0 || warningMessages?.length > 0) {
      if (erroredItems && erroredItems.length > 0) {
        erroredItems.forEach((err) => {
          addNotification({
            description: err.errorMessage,
            type: 'error',
            isSticky: true
          });
        });
      }
      if (warningMessages && warningMessages.length > 0) {
        warningMessages.forEach((warn) => {
          addNotification({
            description: warn.value,
            type: 'warning',
            isSticky: true
          });
        });
      }
      setInventoryStatus('OUT_OF_STOCK');
    } else {
      setInventoryStatus('AVAILABLE');
    }
  };

  const handleRetrySAPOrderStatus = () => {
    const sapOrderStatusAlerts = notifications.find((item) => item.kind === 'SAP_ORDER_STATUS');
    if (sapOrderStatusAlerts && sapOrderStatusAlerts.length > 0) {
      sapOrderStatusAlerts.forEach((item) => removeNotification(item.id));
    }
    retrySapOrderStatus();
  };

  const handleOpenDetails = (therapy) => {
    setOpenDetails(true);
  };

  const isRejected = status === 'REJECTED';
  const isDeleted = status === 'DELETED';
  const isSubmitted = status === StatusEnum.SUBMITTED;
  const contentRef = useRef(null);
  const printPage = useCustomPrint(
    contentRef,
    `
    .MCP-module-wrapper{
      gap:8px !important;
    }
    .agreement-checkbox-control{
      display: none !important;
    }
    .MCP-CardContainer{
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .MCP-CardContainer .print-div{
      display: flex;
    }
    .MCP-CardContainer > div{
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    #summary-alert-container{
      display: none !important;
    }
    .alert-container{
      display: none !important;
    }`
  );

  const { data: simulationData = {} } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      return await OrderService.simulateOrder(orderId);
    },
    enabled: spOrder ? false : !status ? false : !(status === StatusEnum.REJECTED || status === StatusEnum.SUBMITTED || status === 'DELETED'),
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      const warningMessages = result.warningMessages?.map((msg) => msg.value) || [];
      const infoMessages = result.infoMessages?.map((msg) => msg.value) || [];

      if (warningMessages.length > 0) {
        warningMessages.forEach((msg) => {
          addNotification({
            description: msg,
            type: 'warning',
            isSticky: true
          });
        });
      }

      if (infoMessages.length > 0) {
        infoMessages.forEach((msg) => {
          addNotification({
            description: msg,
            type: 'info'
          });
        });
      }
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      showAlert({
        description,
        type: 'error',
        anchorEl: ALERT_CONTAINER_ID
      });
    }
  });

  const { isLoading: isSaving, mutate: submitOrder } = useMutation(async ({ action, isPAPOrder }) => await OrderService.submitOrder(orderId, isPAPOrder), {
    onSuccess: (_result, { action }) => {
      if (action === BUTTON_ACTIONS.SUBMIT) {
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/order-confirmed`, { state: { ...locationState } });
      } else {
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/order-confirmed`, {
          state: { ...locationState, isApproved: true }
        });
      }
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      showAlert({
        description,
        type: 'error',
        anchorEl: ALERT_CONTAINER_ID
      });
    },
    retry: false
  });

  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.orderPlacementAcknowledgement'),
    value: false
  });

  const [papOrderOptions, setPapOrderOptions] = React.useState({
    isDisabled: false,
    isChecked: isPapOrder,
    label: t('messages.papOrderPlacementAcknowledgement'),
    value: false
  });

  const handleChange = () => {
    setOrderAgreementCheckboxError(null);
    setAgreeCheckboxOptions({
      ...agreeCheckboxOptions,
      isChecked: !agreeCheckboxOptions.isChecked
    });
  };

  const handlePapOrderSelectionChange = () => {
    setPapOrderOptions({
      ...papOrderOptions,
      isChecked: !papOrderOptions.isChecked
    });
  };

  const handleOnBackButtonClick = () => {
    const prevSearch = locationState.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  const isImpersonatedAdmin = () => {
    const impersonatedByUser = AuthUtils.getImpersonatedByUser();
    if (impersonatedByUser && (impersonatedByUser.role?.name === SYSTEM_ADMIN || impersonatedByUser.role?.name === CUSTOMER_CENTRE)) {
      return true;
    }
    return false;
  };

  const handleOnSubmit = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to submit order');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      if (!spOrder && isImpersonatedAdmin()) {
        submitOrder({
          action: BUTTON_ACTIONS.SUBMIT,
          isPAPOrder: papOrderOptions.isChecked
        });
      } else {
        submitOrder({ action: BUTTON_ACTIONS.SUBMIT });
      }
    }
  };

  const handleApprove = () => {
    submitOrder({ action: BUTTON_ACTIONS.APPROVE });
  };

  const handleReject = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to reject order');
      return;
    }
    setIsCommentPanelOpen(true);
  };

  const handleOnApprove = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to approve order');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      renderModal({
        title: t('messages.header.confirmation'),
        bodyContent: (
          <div className="MCP-modal-body">
            <p>{t('messages.confirmation.approve')}</p>
          </div>
        ),
        footerActions: {
          cancel: {
            label: t('label.no')
          },
          confirm: {
            label: t('label.yes'),
            action: () => {
              handleApprove();
            }
          }
        }
      });
    }
  };

  const handleOnBackToOrders = () => {
    if (backToInvoiceListing) {
      navigate('/record/invoices');
    } else {
      const prevSearch = locationState?.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleOnEditSection = (stage) => {
    if (isPapOrder) {
      console.log('This is a No Cost Therapy Order, Hence can not be edited.');
      renderModal({
        title: t('prompt.title.alert'),
        bodyContent: (
          <div className="MCP-modal-body">
            <p>{t('prompt.message.editRestriction')}</p>
          </div>
        ),
        footerActions: {
          cancel: {
            label: t('label.ok')
          }
        }
      });
      return;
    }
    const basePath = RoutePaths.pathOrderManagement;

    const stageRoutes = {
      [ORDER_STAGES.THERAPY_SELECTION]: `${basePath}/edit-order/${orderId}`,
      [ORDER_STAGES.ACCOUNT_DETAILS]: `${basePath}/${orderId}/accounts`,
      [ORDER_STAGES.PATIENT_DETAILS]: `${basePath}/${orderId}/patient`,
      [ORDER_STAGES.PAYER_DETAILS]: `${basePath}/${orderId}/payer`,
      [ORDER_STAGES.ADDITIONAL_DETAILS]: `${basePath}/${orderId}/additional-details`
    };

    const route = stageRoutes[stage] || basePath;
    navigate(route, {
      state: { ...locationState, isEdit: true, isApprover }
    });
  };

  const handleAfterRejectOrder = (data) => {
    setIsCommentPanelOpen(false);
    navigate(0, { state: { ...locationState } });
  };

  const getAllowedControls = () => {
    const controls = [];
    const controlPrintSummary = (
      <Button size={'md'} variant="secondary" onClick={() => printPage()}>
        {t('captions.btnPrintSummary')}
      </Button>
    );

    const controlCancel = (
      <Button size={'md'} variant="secondary" onClick={handleOnBackButtonClick}>
        {t('captions.btnCancel')}
      </Button>
    );

    const controlReSubmitOrder = (
      <Button
        size={'md'}
        variant="primary"
        onClick={() => {
          alert('resubmit order');
        }}>
        {t('captions.btnReSubmitOrder')}
      </Button>
    );

    const controlBack = (
      <Button size={'md'} variant="secondary" onClick={handleOnBackButtonClick}>
        {t('captions.btnBack')}
      </Button>
    );

    const controlSubmitOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS, PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleOnSubmit}>
          {t('captions.btnSubmitOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlRejectOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleReject}>
          {t('captions.btnRejectOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlApproveOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleOnApprove}>
          {t('captions.btnApproveOrder')}
        </Button>
      </PermittedComponent>
    );

    if (status === StatusEnum.REJECTED) {
      controls.push(controlPrintSummary); //, controlCancel, controlReSubmitOrder);
    } else if (!isApprover && status !== StatusEnum.SUBMITTED && status !== StatusEnum.APPROVAL_PENDING) {
      controls.push(controlPrintSummary, controlCancel, controlSubmitOrder);
    } else if (isApprover) {
      controls.push(controlBack, controlRejectOrder, controlApproveOrder);
    }

    return controls;
  };

  if (isLoader) {
    return isLoader;
  }

  if (patient.patientInfo) patient.fullName = CommonUtils.getUSFullName(patient.patientInfo);

  const hideControls = status === StatusEnum.SUBMITTED || (status === StatusEnum.APPROVAL_PENDING && !isApprover) || isRejected || isDeleted;

  if (isSaving) {
    return <Loader type={'screen'} />;
  }

  let variantAttachment = null,
    configuredQuestionnaires = [];

  if (additionalDetails.variantDetails?.variantDocumentPath) {
    try {
      variantAttachment = JSON.parse(additionalDetails.variantDetails.variantDocumentPath);
    } catch (error) {}
  }

  if (additionalDetails.configuredQuestionnaires && additionalDetails.configuredQuestionnaires.length > 0) {
    additionalDetails.configuredQuestionnaires.forEach((template) => {
      if (template?.questions && template.questions.length > 0) {
        template.questions.forEach((question) => {
          if (question.value) {
            const details = {
              text: question.text.en,
              value: question.value
            };
            if (question.document) {
              details.attachment = {
                name: question.document.name,
                size: question.document.size,
                url: question.document.url
              };
            }
            configuredQuestionnaires.push(details);
          }
        });
      }
    });
  }

  const askForPapOrder = Boolean(!spOrder && isImpersonatedAdmin());
  const primaryPolicyHolderName = CommonUtils.getUSFullName({
    firstName: payerDetails?.primaryMedicalInsurance?.policyHolderFirstName,
    lastName: payerDetails?.primaryMedicalInsurance?.policyHolderLastName
  });
  const secondaryPolicyHolderName = CommonUtils.getUSFullName({
    firstName: payerDetails?.secondaryMedicalInsurance?.policyHolderFirstName,
    lastName: payerDetails?.secondaryMedicalInsurance?.policyHolderLastName
  });

  return (
    <div className="MCP-module-wrapper order-summary-container">
      {!isError && (
        <React.Fragment>
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
              {backToInvoiceListing ? t('orderManagement.backToInvoiceDetails') : t('captions.btnBackToManageOrder')}
            </Button>
          </div>
          {orderDetails?.status === StatusEnum.IN_DRAFT && <PageHeader heading={t('headings.createNewOrder')} />}
          {isApprover && (
            <div className={styles.pageHeadingReview}>
              <PageHeader heading={t('headings.reviewOrder')} />
              {isPapOrder && (
                <span className={styles.pap}>
                  <Badge customStyle={{ color: '#005483', backgroundColor: '#F2F6FA' }} text={t('label.noCostTherapy')} />
                </span>
              )}
            </div>
          )}
        </React.Fragment>
      )}

      <div className="MCP-module-body" ref={contentRef}>
        {!isError && (
          <React.Fragment>
            {!hideControls && !isRejected && !isDeleted && (
              <div className="order-stepper-wrapper">
                <OrderStepper
                  status={orderDetails?.currentStage}
                  patientDetailsRequired={orderDetails?.patientDetailsRequired}
                  channelType={orderDetails.channelType}
                />
              </div>
            )}
          </React.Fragment>
        )}
        <div id={ALERT_CONTAINER_ID} />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}

        {!isError && (
          <React.Fragment>
            <div className={'MCP-module-wrapper'}>
              <ModuleHeader
                heading={
                  !isApprover && (
                    <Heading className={styles.orderSummaryHeading} as="h2">
                      <span>{t('labels.summary')}</span>
                      {isPapOrder && (
                        <span className={styles.pap}>
                          <Badge
                            customStyle={{
                              color: '#005483',
                              backgroundColor: '#F2F6FA'
                            }}
                            text={t('label.noCostTherapy')}
                          />
                        </span>
                      )}
                    </Heading>
                  )
                }
                className={styles.orderSummary}
                controls={
                  isRejected ? (
                    <div className="row-space-between-center">
                      <Badge text={t(`labels.status.${status.toLowerCase()}`)} type="error" />
                      <Button size="md" variant="tertiary" onClick={() => setIsCommentPanelOpen(true)}>
                        {t('captions.btnViewComments')}
                      </Button>
                    </div>
                  ) : isSubmitted && !spOrder ? (
                    <div className="row-space-between-center">
                      <Label className={styles.lblProcessing}>{t('labels.OrderProcesing')}</Label>
                      {isLoadingSapOrderStatus && <InventoryIndicator status={'CHECKING'} />}

                      {!isLoadingSapOrderStatus &&
                        (sapOrderDetails?.finalStatus ? (
                          <>
                            {sapOrderDetails.finalStatus.toLowerCase() === SAPOrderStatusEnum.OPEN.toLowerCase() ? (
                              <Badge text={t('labels.OrderProcesing.SAPOrderStatus.Open')} type="info" />
                            ) : sapOrderDetails.finalStatus.toLowerCase() === SAPOrderStatusEnum.CANCELLED.toLowerCase() ? (
                              <Badge text={t('labels.OrderProcesing.SAPOrderStatus.Cancelled')} type="error" />
                            ) : (
                              <Badge text={t('labels.OrderProcesing.SAPOrderStatus.Completed')} type="success" />
                            )}
                          </>
                        ) : (
                          <div className={styles.orderProcessing}>
                            <InventoryIndicator status={'OUT_OF_STOCK'} />
                            <div className="styled-icon-button">
                              <Button variant="tertiary" size="lg" onClick={handleRetrySAPOrderStatus}>
                                {t('captions.btnRetry')}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : null
                }
              />
              <div className={'MCP-module-body'}>
                {(status === StatusEnum.SUBMITTED || status === StatusEnum.APPROVAL_PENDING) &&
                  ((spOrder && (submittedBy?.name || orderDetails?.submittedOn)) || (!spOrder && (orderDetails?.approver || orderDetails?.submittedOn))) && (
                    <div className="MCP-CardContainer">
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4">
                        {spOrder || !orderDetails?.approver ? (
                          <>
                            <DetailSegment label={t('labels.SubmittedBy')} value={submittedBy?.name || '-'} />
                            <DetailSegment
                              label={t('labels.SubmittedOn')}
                              value={orderDetails?.submittedOn ? dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY') : '-'}
                            />
                          </>
                        ) : (
                          <>
                            {orderDetails?.approver && <DetailSegment label={t('labels.Approver_Name')} value={orderDetails.approver.name || '-'} />}
                            {orderDetails?.submittedOn && (
                              <DetailSegment
                                label={t('labels.Approval_Date_and_Time')}
                                value={dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY')}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                <div className="MCP-CardContainer">
                  <ModuleHeader className={styles.panelHeader} heading={<Heading as="h3">{t('labels.orderDetails')}</Heading>} />
                  <div
                    className={`grid grid-gap-16 grid-cols-1 md:grid-cols-1 ${
                      status === StatusEnum.SUBMITTED
                        ? !spOrder
                          ? 'lg:grid-cols-3 xl:grid-cols-3'
                          : 'lg:grid-cols-2 xl:grid-cols-2'
                        : 'lg:grid-cols-2 xl:grid-cols-2'
                    }`}>
                    {status === StatusEnum.SUBMITTED && !spOrder && <DetailSegment label={t('labels.orderId')} value={backendOrderId} />}
                    <DetailSegment
                      label={t('labels.materialDescription')}
                      noTooltip={true}
                      value={
                        <div className={styles.materialDescription}>
                          <div className="overflowing">
                            <Tooltip body={therapy?.materialDescription}>
                              {!spOrder ? (
                                <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} onClick={() => handleOpenDetails(therapy)}>
                                  {therapy?.materialDescription}
                                </Link>
                              ) : (
                                therapy?.materialDescription
                              )}
                            </Tooltip>
                          </div>
                          {!spOrder && inventoryStatus && (
                            <Tooltip isDisabled={!inventoryStatus} body={t(`tooltip.material.status.${inventoryStatus}`)}>
                              <span>
                                <InventoryIndicator status={inventoryStatus} />
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      }
                    />
                    {!spOrder && (
                      <div className="price-wrapper">
                        <DetailSegment
                          label={t('labels.orderCost')}
                          value={
                            <span className="dollarSign ">
                              <span>$</span>
                              {getOrderCost(orderCost, simulationData.updatedCost)}
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={'equal-height-grid grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'}>
                  <div className="MCP-module-body">
                    <div className="MCP-CardContainer">
                      <ModuleHeader
                        className={styles.panelHeader}
                        heading={<Heading as="h3">{t('labels.therapyDetails')}</Heading>}
                        controls={
                          !hideControls && (
                            <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                              <Button
                                size="md"
                                variant="tertiary"
                                onClick={() => handleOnEditSection(ORDER_STAGES.THERAPY_SELECTION)}
                                Icon={() => <IconEditField />}>
                                {t('captions.btnEdit')}
                              </Button>
                            </PermittedComponent>
                          )
                        }
                      />
                      <div className={` grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                        {!spOrder && <DetailSegment label={t('labels.therapyDescription')} value={therapy.materialDescription || '-'} />}
                        <DetailSegment label={t('labels.nationalDrugCode')} value={therapy.ndcNumber || '-'} />
                        <DetailSegment label={t('labels.Strength')} value={therapy.strength || '-'} />
                        <DetailSegment label={t('labels.Dosage')} value={therapy.dosage || '-'} />
                        {!spOrder && (
                          <>
                            <DetailSegment label={t('labels.salesOrganization')} value={accountDetails?.shipToAccount?.salesOrg || '-'} />
                            <DetailSegment label={t('labels.distributionsChannel')} value={accountDetails?.soldToAccount?.distributionChannel} />
                          </>
                        )}
                        {spOrder && (
                          <>
                            <DetailSegment label={t('labels.genericName')} value={therapy.genericName || '-'} />
                            <DetailSegment label={t('labels.manufacturer')} value={therapy.manufacturerName || '-'} />
                          </>
                        )}
                        {!spOrder && (
                          <DetailSegment
                            label={t('labels.netPrice')}
                            value={
                              <Tooltip
                                body={
                                  catalog?.netPrice || simulationData?.updatedCatalogNetPrice
                                    ? `$${CommonUtils.formatNumberWithoutSymbol(simulationData?.updatedCatalogNetPrice || catalog?.netPrice)}`
                                    : '-'
                                }>
                                <span className="dollarSign">
                                  <span>$</span>
                                  {catalog?.netPrice || simulationData?.updatedCatalogNetPrice
                                    ? CommonUtils.formatNumberWithoutSymbol(simulationData.updatedCatalogNetPrice || catalog.netPrice)
                                    : '-'}
                                </span>
                              </Tooltip>
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="MCP-module-body">
                    <div className="MCP-CardContainer">
                      <ModuleHeader
                        className={styles.panelHeader}
                        heading={<Heading as="h3">{t('labels.accountDetails')}</Heading>}
                        controls={
                          !hideControls && (
                            <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                              <Button
                                size="md"
                                variant="tertiary"
                                onClick={() => handleOnEditSection(ORDER_STAGES.ACCOUNT_DETAILS)}
                                Icon={() => <IconEditField />}>
                                {t('captions.btnEdit')}
                              </Button>
                            </PermittedComponent>
                          )
                        }
                      />
                      <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2`}>
                        <DetailSegment label={t('labels.soldToAccountName')} value={accountDetails?.soldToAccount?.accountName} />
                        <DetailSegment
                          label={t('labels.soldToAccountAddress')}
                          value={CommonUtils.getDetailedAddress(accountDetails?.soldToAccount?.address)}
                        />
                        <DetailSegment label={t('labels.shipToAccountName')} value={accountDetails?.shipToAccount?.accountName} />
                        <DetailSegment
                          label={t('labels.shipToAccountAddress')}
                          value={CommonUtils.getDetailedAddress(accountDetails?.shipToAccount?.address)}
                        />
                        <DetailSegment label={t('labels.orderChannel')} value={t(`labels.${accountDetails?.soldToAccount?.channelType}`)} />
                        {!spOrder && <DetailSegment label={t('labels.program')} value={CGAT_IDENTIFIER[accountDetails?.soldToAccount?.cgatIdentifier]} />}
                      </div>
                    </div>
                  </div>
                </div>

                {(patientDetailsRequired || orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.patientDetails')}</Heading>}
                      controls={
                        !hideControls && (
                          <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.PATIENT_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          </PermittedComponent>
                        )
                      }
                    />
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5`}>
                      <DetailSegment label={t('orderManagement.patientDetails.inputLabel.patientIdentifier')} value={patient?.patientIdentifier || '-'} />
                      <DetailSegment
                        label={t('labels.patientName')}
                        value={
                          patient.fullName ? (
                            <Tooltip body={patient.fullName}>
                              <span className="overflowing">{patient.fullName}</span>
                            </Tooltip>
                          ) : (
                            '-'
                          )
                        }
                      />
                      <DetailSegment label={t('labels.DOB')} value={patient?.patientInfo?.dateOfBirth || '-'} />

                      <DetailSegment
                        label={t('labels.emailId')}
                        value={
                          patient?.contact?.emailId ? (
                            <Tooltip body={patient.contact.emailId}>
                              <span className="overflowing">{patient.contact.emailId}</span>
                            </Tooltip>
                          ) : (
                            '-'
                          )
                        }
                      />
                      <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender || '-'} />
                    </div>
                  </div>
                )}
                {orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                  <>
                    {provider && (
                      <div className="MCP-CardContainer">
                        <ModuleHeader
                          className={styles.panelHeader}
                          heading={<Heading as="h3">{t('labels.providerDetails')}</Heading>}
                          controls={
                            !hideControls && (
                              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                                <Button
                                  size="md"
                                  variant="tertiary"
                                  onClick={() => handleOnEditSection(ORDER_STAGES.PATIENT_DETAILS)}
                                  Icon={() => <IconEditField />}>
                                  {t('captions.btnEdit')}
                                </Button>
                              </PermittedComponent>
                            )
                          }
                        />
                        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6`}>
                          <DetailSegment label={t('labels.name')} value={getFullName(provider?.name) || '-'} />
                          <DetailSegment label={t('labels.address')} value={getAddress(provider?.address || '-')} />
                          <DetailSegment label={t('labels.phoneNumber')} value={CommonUtils.formatPhoneNumber(provider?.phone || '-')} />
                          <DetailSegment label={t('provider.tinNumber')} value={CommonUtils.formatTIN(provider?.tin || '-')} />
                          <DetailSegment label={t('labels.deaNumber')} value={provider?.dea || '-'} />
                          <DetailSegment label={t('labels.npiNumber')} value={provider?.npi || '-'} />
                        </div>
                      </div>
                    )}{' '}
                    {payerDetails && payerDetails?.primaryMedicalInsurance && (
                      <div className="MCP-CardContainer">
                        <ModuleHeader
                          className={styles.panelHeader}
                          heading={<Heading as="h3">{t('label.primarymedicalinsurance')}</Heading>}
                          controls={
                            !hideControls && (
                              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                                <Button
                                  size="md"
                                  variant="tertiary"
                                  onClick={() => handleOnEditSection(ORDER_STAGES.PAYER_DETAILS)}
                                  Icon={() => <IconEditField />}>
                                  {t('captions.btnEdit')}
                                </Button>
                              </PermittedComponent>
                            )
                          }
                        />
                        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6`}>
                          <DetailSegment
                            label={t('form.label.insuranceCompany')}
                            value={
                              <Tooltip body={payerDetails?.primaryMedicalInsurance?.insuranceCompanyName || '-'}>
                                <span className="overflowing">{payerDetails?.primaryMedicalInsurance?.insuranceCompanyName || '-'}</span>
                              </Tooltip>
                            }
                          />
                          <DetailSegment label={t('form.label.phoneNumber')} value={payerDetails?.primaryMedicalInsurance?.insuranceCompanyPhone || '-'} />
                          <DetailSegment label={t('form.label.memberNumber')} value={payerDetails?.primaryMedicalInsurance?.memberNumber || '-'} />
                          <DetailSegment label={t('label.policyHolderName')} value={primaryPolicyHolderName || '-'} />
                          <DetailSegment label={t('labels.dob')} value={payerDetails?.primaryMedicalInsurance?.dateOfBirth || '-'} />
                          <DetailSegment label={t('label.relationToPatient')} value={payerDetails?.primaryMedicalInsurance?.relationshipToPatient || '-'} />
                        </div>
                      </div>
                    )}{' '}
                    {payerDetails && payerDetails?.secondaryMedicalInsurance && (
                      <div className="MCP-CardContainer">
                        <ModuleHeader
                          className={styles.panelHeader}
                          heading={<Heading as="h3">{t('label.secondarymedicalinsurance')}</Heading>}
                          controls={
                            !hideControls && (
                              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                                <Button
                                  size="md"
                                  variant="tertiary"
                                  onClick={() => handleOnEditSection(ORDER_STAGES.PAYER_DETAILS)}
                                  Icon={() => <IconEditField />}>
                                  {t('captions.btnEdit')}
                                </Button>
                              </PermittedComponent>
                            )
                          }
                        />
                        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6`}>
                          <DetailSegment
                            label={t('form.label.insuranceCompany')}
                            value={
                              <Tooltip body={payerDetails?.secondaryMedicalInsurance?.insuranceCompanyName || '-'}>
                                <span className="overflowing">{payerDetails?.secondaryMedicalInsurance?.insuranceCompanyName || '-'}</span>
                              </Tooltip>
                            }
                          />
                          <DetailSegment label={t('form.label.phoneNumber')} value={payerDetails?.secondaryMedicalInsurance?.insuranceCompanyPhone || '-'} />
                          <DetailSegment label={t('form.label.memberNumber')} value={payerDetails?.secondaryMedicalInsurance?.memberNumber || '-'} />
                          <DetailSegment label={t('label.policyHolderName')} value={secondaryPolicyHolderName || '-'} />
                          <DetailSegment label={t('labels.dob')} value={payerDetails?.secondaryMedicalInsurance?.dateOfBirth || '-'} />
                          <DetailSegment label={t('label.relationToPatient')} value={payerDetails?.secondaryMedicalInsurance?.relationshipToPatient || '-'} />
                        </div>
                      </div>
                    )}{' '}
                    {payerDetails && payerDetails?.primaryPharmacyInsurance && (
                      <div className="MCP-CardContainer">
                        <ModuleHeader
                          className={styles.panelHeader}
                          heading={<Heading as="h3">{t('label.primarypharmacyinsurance')}</Heading>}
                          controls={
                            !hideControls && (
                              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                                <Button
                                  size="md"
                                  variant="tertiary"
                                  onClick={() => handleOnEditSection(ORDER_STAGES.PAYER_DETAILS)}
                                  Icon={() => <IconEditField />}>
                                  {t('captions.btnEdit')}
                                </Button>
                              </PermittedComponent>
                            )
                          }
                        />
                        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4`}>
                          <DetailSegment
                            label={t('form.label.pharmacyBenefitManagerName')}
                            value={
                              <Tooltip body={payerDetails?.primaryPharmacyInsurance?.pharmacyBenefitManagerName || '-'}>
                                <span className="overflowing">{payerDetails?.primaryPharmacyInsurance?.pharmacyBenefitManagerName || '-'}</span>
                              </Tooltip>
                            }
                          />
                          <DetailSegment label={t('form.label.rxMemberId')} value={payerDetails?.primaryPharmacyInsurance?.rxMemberId || '-'} />
                          <DetailSegment label={t('form.label.rxPcn')} value={payerDetails?.primaryPharmacyInsurance?.rxPcn || '-'} />
                          <DetailSegment label={t('form.label.rxBin')} value={payerDetails?.primaryPharmacyInsurance?.rxBin || '-'} />
                        </div>
                      </div>
                    )}
                    {payerDetails && payerDetails?.secondaryPharmacyInsurance && (
                      <div className="MCP-CardContainer">
                        <ModuleHeader
                          className={styles.panelHeader}
                          heading={<Heading as="h3">{t('label.secondarypharmacyinsurance')}</Heading>}
                          controls={
                            !hideControls && (
                              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                                <Button
                                  size="md"
                                  variant="tertiary"
                                  onClick={() => handleOnEditSection(ORDER_STAGES.PAYER_DETAILS)}
                                  Icon={() => <IconEditField />}>
                                  {t('captions.btnEdit')}
                                </Button>
                              </PermittedComponent>
                            )
                          }
                        />
                        <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4`}>
                          <DetailSegment
                            label={t('form.label.pharmacyBenefitManagerName')}
                            value={
                              <Tooltip body={payerDetails?.secondaryPharmacyInsurance?.pharmacyBenefitManagerName || '-'}>
                                <span className="overflowing">{payerDetails?.secondaryPharmacyInsurance?.pharmacyBenefitManagerName || '-'}</span>
                              </Tooltip>
                            }
                          />
                          <DetailSegment label={t('form.label.rxMemberId')} value={payerDetails?.secondaryPharmacyInsurance?.rxMemberId || '-'} />
                          <DetailSegment label={t('form.label.rxPcn')} value={payerDetails?.secondaryPharmacyInsurance?.rxPcn || '-'} />
                          <DetailSegment label={t('form.label.rxBin')} value={payerDetails?.secondaryPharmacyInsurance?.rxBin || '-'} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="MCP-CardContainer">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{t('labels.additionalDetails')}</Heading>}
                    controls={
                      !hideControls && (
                        <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                          <Button
                            size="md"
                            variant="tertiary"
                            onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                            Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        </PermittedComponent>
                      )
                    }
                  />
                  <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ${spOrder ? 'xl:grid-cols-2' : 'xl:grid-cols-5'}`}>
                    {!spOrder && additionalDetails?.slotNumber && <DetailSegment label={t('labels.slotNo')} value={additionalDetails?.slotNumber} />}
                    {spOrder && <DetailSegment label={t('label.diagnosisCode')} value={additionalDetails?.diagnosisCode} />}
                    <DetailSegment label={t('labels.poNo')} value={additionalDetails?.poNumber} />
                    {!spOrder && additionalDetails?.dateOfAdministration && (
                      <DetailSegment label={t('labels.dateOfAdministration')} value={additionalDetails?.dateOfAdministration || '-'} />
                    )}
                    {!spOrder && isCoiIdRequired && additionalDetails?.coiId && (
                      <DetailSegment label={t('labels.coiId')} value={additionalDetails?.coiId || '-'} />
                    )}
                    {!spOrder && additionalDetails?.orderQuantity && (
                      <DetailSegment label={t('labels.orderQuantity')} value={String(additionalDetails?.orderQuantity) || '-'} />
                    )}
                  </div>
                </div>

                {spOrder && additionalDetails?.clinicalDetails?.hasAllergies && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.clinicalDetails')}</Heading>}
                      controls={
                        !hideControls && (
                          <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          </PermittedComponent>
                        )
                      }
                    />
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2`}>
                      <DetailSegment label={t('label.allergies')} value={additionalDetails?.clinicalDetails?.allergiesSpecification || '-'} />
                      <DetailSegment label={t('labels.provideDateOfAdministration')} value={additionalDetails?.clinicalDetails?.dateOfAdministration || '-'} />
                    </div>
                  </div>
                )}

                {additionalDetails.variantDetails && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.variant')}</Heading>}
                      controls={
                        !hideControls && (
                          <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          </PermittedComponent>
                        )
                      }
                    />
                    <div className="MCP-module-body">
                      <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                        <DetailSegment label={'Variant'} value={additionalDetails?.variantDetails?.variant} />
                        {variantAttachment && (
                          <AttachmentCard url={variantAttachment.url} fileName={variantAttachment.name} fileSize={variantAttachment.size} />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {additionalDetails.configuredQuestionnaires && additionalDetails.configuredQuestionnaires.length > 0 && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={<Heading as="h3">{t('labels.configuredQuestionnaires')}</Heading>}
                      controls={
                        !hideControls && (
                          <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          </PermittedComponent>
                        )
                      }
                    />
                    <div className="MCP-module-body">
                      <div className="summary-question-list">
                        {configuredQuestionnaires.map((question) => {
                          return (
                            <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                              <DetailSegment
                                label={question.text}
                                value={
                                  question.value && Array.isArray(question.value) ? (
                                    <div>
                                      {question.value.map((val) => (
                                        <div>{val.replace(/_/g, ' ')}</div>
                                      ))}
                                    </div>
                                  ) : (
                                    question.value
                                  )
                                }
                              />
                              {question.attachment && (
                                <AttachmentCard url={question.attachment?.url} fileName={question.attachment.name} fileSize={question.attachment.size} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {additionalDetails.additionalDocuments && additionalDetails.additionalDocuments?.length > 0 && (
                  <div className="MCP-CardContainer">
                    <ModuleHeader className={styles.panelHeader} heading={<Heading as="h3">{t('labels.additionalDocuments')}</Heading>} />
                    <div className="MCP-module-body">
                      <div className="summary-question-list">
                        {additionalDetails.additionalDocuments?.map((documentSegment) => {
                          return (
                            <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'}>
                              <div className="MCP-module-body">
                                {documentSegment.comment && <DetailSegment maxLength={60} label={'Comment'} value={documentSegment.comment} />}
                                <div>
                                  <DetailSegment direction="row" label={'Uploaded by:'} value={documentSegment.uploadedBy} />
                                  <DetailSegment
                                    direction="row"
                                    label={'Uploaded on:'}
                                    value={
                                      documentSegment.uploadedDate
                                        ? dayjs.utc(documentSegment.uploadedDate).tz(dayjs.tz.guess()).format('MM/DD/YYYY, HH:mm')
                                        : '-'
                                    }
                                  />
                                </div>
                              </div>
                              {documentSegment.name && documentSegment.url && (
                                <AttachmentCard url={documentSegment?.url} fileName={documentSegment.name} fileSize={documentSegment.size} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!hideControls && (
                <div className="MCP-module-body agreement-checkbox-control">
                  <CheckboxGroup
                    id={'default'}
                    name="order-agreement"
                    error={Boolean(orderAgreementCheckboxError)}
                    errorMessage={orderAgreementCheckboxError}
                    items={[
                      {
                        ...agreeCheckboxOptions,
                        onChange: () => handleChange()
                      }
                    ]}
                    size="md"
                  />
                  {askForPapOrder && (
                    <div className={styles['pap-order-selection-control']}>
                      <CheckboxGroup
                        id={'pap-order'}
                        name="pap-order"
                        items={[
                          {
                            ...papOrderOptions,
                            onChange: () => handlePapOrderSelectionChange()
                          }
                        ]}
                        size="md"
                      />
                      <InfoModel title={t('messages.papOrderPlacementAcknowledgement')}>
                        <div className="MCP-modal-body">{t('order.no.cost.therapy.info')}</div>
                      </InfoModel>
                    </div>
                  )}
                </div>
              )}

              <div className="footer-wrapper" ref={controlRef}>
                <div className="controls footer-controls">{getAllowedControls()}</div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      {!isError && isCommentPanelOpen && (
        <CommentPanel
          readOnly={isRejected}
          meta={{ orderId, rejectionDetails }}
          onSuccess={handleAfterRejectOrder}
          onClose={() => setIsCommentPanelOpen(false)}
          openDrawer={isCommentPanelOpen}
        />
      )}

      {!isError && openDetails && !spOrder && (
        <TherapyDetails
          therapyId={therapy.materialNumber}
          therapyData={TherapyDetailsConstantsForBB(false)}
          onClose={() => setOpenDetails(!openDetails)}
          showFooter={false}
          isMaterialConfiguration={false}
          useUserService={true}
          heading={t('labels.therapyDetails')}
          notify={({ type, message }) =>
            showAlert({
              description: message,
              type,
              anchorEl: ALERT_CONTAINER_ID
            })
          }
        />
      )}
    </div>
  );
};

export default Summary;
