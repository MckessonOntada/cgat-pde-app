import React from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, Modal, CheckboxGroup, Heading, Loader, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailSegment from '@src/components/DetailSegment';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import useAlert from '@src/hooks/useAlert';
import PermittedComponent from '@src/components/permitted-component';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation, useQuery } from 'react-query';
import { RoutePaths } from '@src/routes/constants';
import { StatusEnum } from '../../../orders/constants';
import { renderModal } from '@src/util/ModalUtil';
import FloatingDrawer from '@src/components/floating-drawer';
import CommentPanel from './CommentPanel';
import AuthUtils from '@src/util/AuthUtils';
import OrderStepper from '../OrderStepper';
import useOrder from '../../../orders/useOrder';

const ALERT_CONTAINER_ID = 'summary-alert-container';
const BUTTON_ACTIONS = {
  SUBMIT: 'submit',
  APPROVE: 'approve',
  REJECT: 'reject'
};
const ORDER_TYPES = {
  PAP_ORDER: 'PAP ORDER',
  NON_PAP_ORDER: 'NON PAP ORDER'
};

const Summary = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { showAlert } = useAlert();
  const { data: orderDetails, isFetching, isError, error } = useOrder(orderId);
  const [isPAPOrderConfirmModalOpen, setIsPAPOrderConfirmModalOpen] = React.useState(false);
  const { isApprover = false, isSimulate = false } = location.state || {};
  const [orderAgreementCheckboxError, setOrderAgreementCheckboxError] = React.useState(null);
  const [isCommentPanelOpen, setIsCommentPanelOpen] = React.useState(false);
  const {
    therapy = {},
    catalog = {},
    orderCost,
    accountDetails = {},
    patient,
    additionalDetails = {},
    patientDetailsRequired = false,
    rejectionDetails,
    paporder: isPapOrder,
    status
  } = orderDetails || {};
  const variantDetails = additionalDetails?.variantDetails || {};
  const isImpersonated = Boolean(AuthUtils.getImpersonateId()),
    isRejected = status === StatusEnum.REJECTED,
    isConcluded = status === StatusEnum.REJECTED || status === StatusEnum.SUBMITTED;

  const { isLoading, data: simulationData = {} } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const response = await OrderService.simulateOrder(orderId);
      return response;
    },
    enabled: Boolean(status && !isConcluded && (isSimulate || isApprover)),
    refetchOnWindowFocus: false,
    onError: (error) => {
      showAlert({ description: error?.response?.data?.message, type: 'error', anchorEl: ALERT_CONTAINER_ID });
    }
  });

  if (!isLoading && simulationData) {
    const warningMessages = simulationData.warningMessages?.map((msg) => msg.value) || [];
    const infoMessages = simulationData.infoMessages?.map((msg) => msg.value) || [];

    if (warningMessages.length > 0) {
      showAlert({ description: err.message, type: 'warning', anchorEl: ALERT_CONTAINER_ID });
    }

    if (infoMessages.length > 0) {
      showAlert({ description: err.message, type: 'info', anchorEl: ALERT_CONTAINER_ID });
    }
  }

  const { mutate: submitOrder } = useMutation(async ({ action, isPAPOrder }) => await OrderService.submitOrder(orderId, isPAPOrder), {
    onSuccess: (_result, { action }) => {
      if (action === BUTTON_ACTIONS.SUBMIT) {
        navigate(`../${orderId}/order-confirmed`);
      } else {
        navigate(`../${orderId}/order-confirmed`, { state: { isApproved: true } });
      }
    },
    onError: (err) => {
      showAlert({ description: err.message, type: 'error', anchorEl: ALERT_CONTAINER_ID });
    }
  });

  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.orderPlacementAcknowledgement'),
    value: false
  });

  const handleChange = () => {
    setOrderAgreementCheckboxError(null);
    setAgreeCheckboxOptions({ ...agreeCheckboxOptions, isChecked: !agreeCheckboxOptions.isChecked });
  };

  const handleOnBackButtonClick = () => {
    if (isApprover || isSimulate) {
      navigate(RoutePaths.pathOrderManagement);
    } else {
      navigate(`../${orderId}/additional-details`);
    }
  };

  const handleOnSubmitPapOrder = (orderType) => {
    const isPAPOrder = orderType === ORDER_TYPES.PAP_ORDER;
    setIsPAPOrderConfirmModalOpen(false);
    submitOrder({ action: BUTTON_ACTIONS.SUBMIT, isPAPOrder });
  };

  const handleOnSubmit = () => {
    if (!agreeCheckboxOptions.isChecked) {
      setOrderAgreementCheckboxError('Please acknowledge to submit order');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      if (isImpersonated) {
        setIsPAPOrderConfirmModalOpen(true);
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
    navigate(RoutePaths.pathOrderManagement);
  };

  const handleOnEditSection = (stage) => {
    if (isPapOrder) {
      console.log('This is a PAP Order, Hence can not be edited.');
      renderModal({
        title: t('prompt.title.alert'),
        bodyContent: (
          <div className="MCP-modal-body">
            <p>{t('prompt.message.editRestriction')}</p>
          </div>
        )
      });
      return;
    }
    const stageRoutes = {
      [ORDER_STAGES.THERAPY_SELECTION]: `../edit-order/${orderId}`,
      [ORDER_STAGES.ACCOUNT_DETAILS]: `../${orderId}/accounts`,
      [ORDER_STAGES.PATIENT_DETAILS]: `../${orderId}/patient`,
      [ORDER_STAGES.ADDITIONAL_DETAILS]: `../${orderId}/additional-details`
    };

    const route = stageRoutes[stage] || '/orders';
    navigate(route, { state: { isEdit: true, isApprover: isApprover } });
  };

  const handleAfterRejectOrder = (data) => {
    setIsCommentPanelOpen(false);
  };

  const getAllowedControls = () => {
    const controls = [];
    const controlPrintSummary = (
      <Button disabled={true} size={'md'} variant="secondary">
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

  if (isFetching) {
    return <Loader />;
  }

  const isAgreed = agreeCheckboxOptions.isChecked,
    hideControls = status === StatusEnum.SUBMITTED || (status === StatusEnum.APPROVAL_PENDING && !isApprover) || isRejected;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      {orderDetails?.status === StatusEnum.IN_DRAFT && <PageHeader heading={t('headings.createNewOrder')} />}
      {isApprover && <PageHeader heading={t('headings.reviewOrder')} />}

      <div className="MCP-module-body">
        {!hideControls && !isRejected && (
          <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} />
        )}
        <div id={ALERT_CONTAINER_ID} />
        <div className={'MCP-module-wrapper'}>
          <ModuleHeader
            heading={<Heading as="h2">{t('labels.summary')}</Heading>}
            controls={
              isRejected && (
                <div class="row-space-between-center">
                  <Badge text={t(`labels.status.${status.toLowerCase()}`)} type={'error'} />
                  <Button size={'md'} variant="tertiary" onClick={() => setIsCommentPanelOpen(true)}>
                    {t('captions.btnViewComments')}
                  </Button>
                </div>
              )
            }
          />
          <div className={'MCP-module-body'}>
            <div className="MCP-CardContainer">
              <ModuleHeader
                className={styles.panelHeader}
                heading={
                  <Heading as="h3">
                    {t(status === StatusEnum.SUBMITTED || isApprover ? 'labels.orderDetails' : 'labels.priceDetails')}
                  </Heading>
                }
              />
              <div class={styles.flexPanel}>
                {(status === StatusEnum.SUBMITTED || isApprover) && <DetailSegment label={t('labels.orderId')} value={orderId} />}
                <DetailSegment label={t('labels.materialDescription')} value={therapy?.materialDescription} />
                <p className="price-wrapper">
                  <DetailSegment
                    label={t('labels.orderCost')}
                    value={
                      <span className="dollarSign ">
                        <span>$</span>
                        {parseFloat(orderCost).toFixed(2)}
                      </span>
                    }
                  />
                </p>
              </div>
            </div>
            <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'}>
              <div className="MCP-CardContainer">
                <ModuleHeader
                  className={styles.panelHeader}
                  heading={<Heading as="h3">{t('labels.therapy')}</Heading>}
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
                <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                  <DetailSegment label={t('labels.nationalDrugCode')} value={therapy.ndcNumber} />
                  <DetailSegment label={t('labels.UDI')} value={catalog?.udi || '-'} />
                  <DetailSegment
                    label={t('labels.distributionChannel')}
                    value={accountDetails?.shipToAccount?.distributionChannel || '-'}
                  />
                  <DetailSegment label={t('labels.salesOrganization')} value={accountDetails?.shipToAccount?.accountName} />
                  <DetailSegment label={t('labels.netPrice')} value={catalog?.netPrice || '-'} />
                  <DetailSegment label={t('labels.contractPrice')} value={catalog?.contractPrice || '-'} />
                  <DetailSegment label={t('labels.wacPrice')} value={catalog?.wacPrice || '-'} />
                  <DetailSegment label={t('labels.regularPrice')} value={catalog?.regularPrice || '-'} />
                  <DetailSegment label={t('labels.340bPrice')} value={catalog?.price340b || '-'} />
                  <DetailSegment label={t('labels.priceUnit')} value={catalog?.priceUnit || '-'} />
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
                    <DetailSegment label={t('labels.accountName')} value={accountDetails?.soldToAccount?.accountName} />
                    <DetailSegment label={t('labels.accountNo')} value={accountDetails?.soldToAccount?.accountNumber} />
                    <DetailSegment label={t('labels.shippingAccountName')} value={accountDetails?.shipToAccount?.accountName} />
                    <DetailSegment label={t('labels.shippingAccountNo')} value={accountDetails?.shipToAccount?.accountNumber} />
                  </div>
                </div>
                {patientDetailsRequired && (
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
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                      <DetailSegment label={t('labels.patientIdentifier')} value={patient?.patientIdentifier || '-'} />
                      <DetailSegment
                        label={t('labels.patientName')}
                        value={
                          patient?.patientInfo
                            ? `${patient.patientInfo.firstName} ${patient.patientInfo.middleName} ${patient.patientInfo.lastName}`
                            : '-'
                        }
                      />
                      <DetailSegment label={t('labels.DOB')} value={patient?.patientInfo?.dateOfBirth || '-'} />
                    </div>
                  </div>
                )}
              </div>
            </div>

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
              <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6'}>
                <DetailSegment label={t('labels.slotNo')} value={additionalDetails?.slotNumber} />
                <DetailSegment label={t('labels.poNo')} value={additionalDetails?.poNumber} />
                <DetailSegment label={t('labels.dateOfAdministration')} value={additionalDetails?.dateOfAdministration} />
                <DetailSegment label={t('labels.selectVariant')} value={variantDetails.variant || '-'} />
                <DetailSegment label={t('labels.variantDescription')} value={variantDetails.variantDescription || '-'} />
                <DetailSegment label={t('labels.patientConsent')} value={additionalDetails?.patientConsentTaken ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
          {!hideControls && (
            <div className="agreement-checkbox-control">
              <CheckboxGroup
                id={'default'}
                name="order-agreement"
                error={Boolean(orderAgreementCheckboxError)}
                errorMessage={orderAgreementCheckboxError}
                items={[{ ...agreeCheckboxOptions, onChange: () => handleChange() }]}
                size="md"
              />
            </div>
          )}
          <div className="controls">{getAllowedControls()}</div>
        </div>
      </div>
      <FloatingDrawer open={isCommentPanelOpen} anchor="right" onClose={() => setIsCommentPanelOpen(false)}>
        <CommentPanel
          readOnly={isRejected}
          meta={{ orderId, rejectionDetails }}
          onSuccess={handleAfterRejectOrder}
          onClose={() => setIsCommentPanelOpen(false)}
        />
      </FloatingDrawer>
      {isPAPOrderConfirmModalOpen && (
        <PAPOrderTypeConfirmModal onClose={() => setIsPAPOrderConfirmModalOpen(false)} onSubmit={handleOnSubmitPapOrder} />
      )}
    </div>
  );
};

const PAPOrderTypeConfirmModal = ({ onClose, onSubmit }) => {
  const { t } = useTranslate();
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      modalTitle={t('prompt.title.alert')}
      modalBody={
        <div className={styles.papOptions}>
          <p className={styles.title}>{t('prompt.message.submitOrder')}</p>
          <p>{t('prompt.subMessage.submitOrder')}</p>
        </div>
      }
      modalFooter={
        <React.Fragment>
          <Button size="md" onClick={() => onSubmit(ORDER_TYPES.NON_PAP_ORDER)} variant="secondary">
            {t('captions.btnNo')}
          </Button>
          <Button size="md" onClick={() => onSubmit(ORDER_TYPES.PAP_ORDER)}>
            {t('captions.btnYes')}
          </Button>
        </React.Fragment>
      }
      modalSize="md"
    />
  );
};

export default Summary;
