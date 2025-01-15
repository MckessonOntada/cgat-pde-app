import React from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, CheckboxGroup, Stepper, Heading, Loader, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DetailSegment from '@src/components/DetailSegment';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
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

const Summary = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isFetching, setActiveRecord, formState, editByStage, setCurrentOrder } = useManageOrder();
  const { orderId } = useParams();
  const location = useLocation();
  const { isEdit = false, isApprover = false, isSimulate = false } = location.state || {};
  const alertContainerId = 'summary-alert-container';
  const { showAlert } = useAlert();
  const [isCommentPanelOpen, setIsCommentPanelOpen] = React.useState(false);
  const forms = FormList(t);
  const {
    therapy = {},
    catalog = {},
    orderCost,
    accountDetails = {},
    patient,
    additionalDetails = {},
    patientDetailsRequired = false,
    rejectionDetails,
    status
  } = formState.activeRecord || {};
  const isRejected = status === StatusEnum.REJECTED;
  const isConcluded = status === StatusEnum.REJECTED || status === StatusEnum.SUBMITTED;

  const { isLoading, data: simulationData = {} } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: async () => {
      const response = await OrderService.simulateOrder(orderId);
      return response;
    },
    enabled: Boolean(status && !isConcluded && (isSimulate || isApprover)),
    refetchOnWindowFocus: false,
    onError: (error) => {
      showAlert({ description: error?.response?.data?.message, type: 'error', anchorEl: alertContainerId });
    }
  });

  if (!isLoading && simulationData) {
    const warningMessages = simulationData.warningMessages?.map((msg) => msg.value) || [];
    const infoMessages = simulationData.infoMessages?.map((msg) => msg.value) || [];

    if (warningMessages.length > 0) {
      showAlert({ description: err.message, type: 'warning', anchorEl: alertContainerId });
    }

    if (infoMessages.length > 0) {
      showAlert({ description: err.message, type: 'infor', anchorEl: alertContainerId });
    }
  }

  const submitOrder = useMutation(async ({ action }) => await OrderService.submitOrder(orderId), {
    onSuccess: (result, { action }) => {
      if (action === 'submit') {
        navigate(`../${orderId}/order-confirmed`);
      } else {
        navigate(`../${orderId}/order-confirmed`, { state: { isApproved: true } });
      }
    },
    onError: (err) => {
      showAlert({ description: err.message, type: 'error', anchorEl: alertContainerId });
    }
  });

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ORDER_SUMMARY);
  }, []);

  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.orderPlacementAcknowledgement'),
    value: false
  });
  const handleChange = () => {
    const updatedOptions = { ...agreeCheckboxOptions, isChecked: !agreeCheckboxOptions.isChecked };

    setAgreeCheckboxOptions(updatedOptions);
  };

  const handleOnBackButtonClick = () => {
    if (isApprover || isSimulate) {
      navigate(RoutePaths.pathOrderManagement);
    } else {
      editByStage(ORDER_STAGES.ADDITIONAL_DETAILS);
      navigate(`../${orderId}/additional-details`);
    }
  };

  const handleOnSubmit = () => {
    if (agreeCheckboxOptions.isChecked) {
      submitOrder.mutate({ action: 'submit' });
    }
    return;
  };

  const handleReject = () => {
    rejectOrder('Conditions are not matching');
  };
  const handleApprove = () => {
    submitOrder.mutate({ action: 'approve' });
  };

  const handleOnApprove = () => {
    if (agreeCheckboxOptions.isChecked) {
      renderModal({
        title: t('messages.header.confirmation'),
        bodyContent: <h3>{t('messages.confirmation.approve')},</h3>,
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
    editByStage(stage);
    switch (stage) {
      case ORDER_STAGES.THERAPY_SELECTION: {
        navigate(`../edit-order/${orderId}`, { state: { isEdit: true, isApprover: isApprover } });
        break;
      }
      case ORDER_STAGES.ACCOUNT_DETAILS: {
        navigate(`../${orderId}/accounts`, { state: { isEdit: true, isApprover: isApprover } });
        break;
      }
      case ORDER_STAGES.PATIENT_DETAILS: {
        navigate(`../${orderId}/patient`, { state: { isEdit: true, isApprover: isApprover } });
        break;
      }
      case ORDER_STAGES.ADDITIONAL_DETAILS: {
        navigate(`../${orderId}/additional-details`, { state: { isEdit: true, isApprover: isApprover } });
        break;
      }
      default: {
        navigate('/orders');
        break;
      }
    }
  };

  const handleAfterRejectOrder = (data) => {
    setActiveRecord(data);
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
      <Button size={'md'} variant="secondary" onClick={() => alert('cancel')}>
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
        <Button
          size={'md'}
          variant="primary"
          type="submit"
          onClick={handleOnSubmit}
          disabled={!isAgreed || formState.activeRecord?.status === StatusEnum.SUBMITTED}>
          {t('captions.btnSubmitOrder')}
        </Button>
      </PermittedComponent>
    );

    const controlRejectOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER]}>
        <Button size={'md'} variant="primary" type="submit" onClick={() => setIsCommentPanelOpen(true)} disabled={!isAgreed}>
          {t('captions.btnRejectOrder')}
        </Button>
      </PermittedComponent>
    );
    const controlApproveOrder = (
      <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS]}>
        <Button size={'md'} variant="primary" type="submit" onClick={handleOnApprove} disabled={!isAgreed}>
          {t('captions.btnApproveOrder')}
        </Button>
      </PermittedComponent>
    );

    if (status === StatusEnum.REJECTED) {
      controls.push(controlPrintSummary); //, controlCancel, controlReSubmitOrder);
    } else if (!isApprover && status !== StatusEnum.SUBMITTED && status !== StatusEnum.APPROVAL_PENDING) {
      controls.push(controlPrintSummary, controlBack, controlSubmitOrder);
    } else if (isApprover) {
      controls.push(controlBack, controlRejectOrder, controlApproveOrder);
    }

    return controls;
  };

  if (isFetching) {
    return <Loader />;
  }

  const isAgreed = agreeCheckboxOptions.isChecked;
  const hideControls = status === StatusEnum.SUBMITTED || (status === StatusEnum.APPROVAL_PENDING && !isApprover) || isRejected;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      {formState.activeRecord?.status === StatusEnum.IN_DRAFT && (
        <PageHeader heading={<Heading as="h1">{t('headings.createNewOrder')}</Heading>} />
      )}
      {isApprover && <PageHeader heading={<Heading as="h1">{t('headings.reviewOrder')}</Heading>} />}

      <div className="MCP-module-body">
        {!hideControls && !isRejected ? (
          <Stepper activeIndex={5} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />
        ) : null}
        <div id={alertContainerId} />
        <div className={'MCP-module-wrapper'}>
          <ModuleHeader
            heading={<Heading as="h2">{t('labels.summary')}</Heading>}
            controls={
              isRejected && (
                <React.Fragment>
                  <div class="row-space-between-center">
                    <Badge text={t(`labels.status.${status.toLowerCase()}`)} type={'error'} />
                    <Button size={'md'} variant="tertiary" onClick={() => setIsCommentPanelOpen(true)}>
                      {t('captions.btnViewComments')}
                    </Button>
                  </div>
                </React.Fragment>
              )
            }
          />
          <div className={'MCP-module-body'}>
            <div className="MCP-panel-container">
              <ModuleHeader
                className={styles.panelHeader}
                heading={
                  <Heading as="h3">{t(status === StatusEnum.SUBMITTED || isApprover ? 'labels.orderDetails' : 'labels.price')}</Heading>
                }
              />
              <div class={styles.flexPanel}>
                {(status === StatusEnum.SUBMITTED || isApprover) && <DetailSegment label={t('labels.orderId')} value={orderId} />}
                <DetailSegment label={t('labels.materialDescription')} value={therapy?.materialDescription} />
                <DetailSegment label={t('labels.orderCost')} value={<p className={styles.price}>{orderCost}</p>} />
              </div>
            </div>
            <div className={'grid grid-gap-16 grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'}>
              <div className="MCP-panel-container">
                <ModuleHeader
                  className={styles.panelHeader}
                  heading={<Heading as="h3">{t('labels.therapy')}</Heading>}
                  controls={
                    <>
                      {!hideControls && (
                        <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                          <Button
                            size="md"
                            variant="tertiary"
                            onClick={() => handleOnEditSection(ORDER_STAGES.THERAPY_SELECTION)}
                            Icon={() => <IconEditField />}>
                            {t('captions.btnEdit')}
                          </Button>
                        </PermittedComponent>
                      )}
                    </>
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
                <div className="MCP-panel-container">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{t('labels.accountDetails')}</Heading>}
                    controls={
                      <>
                        {!hideControls && (
                          <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                            <Button
                              size="md"
                              variant="tertiary"
                              onClick={() => handleOnEditSection(ORDER_STAGES.ACCOUNT_DETAILS)}
                              Icon={() => <IconEditField />}>
                              {t('captions.btnEdit')}
                            </Button>
                          </PermittedComponent>
                        )}
                      </>
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
                  <div className="MCP-panel-container">
                    <ModuleHeader
                      className={styles.panelHeader}
                      heading={
                        <Heading as="h3">
                          {patient?.patientInfo
                            ? [patient.patientInfo.firstName, patient.patientInfo.middleName, patient.patientInfo.lastName]
                                .filter(Boolean)
                                .join(' ')
                            : t('labels.patientDetails')}
                        </Heading>
                      }
                      controls={
                        <>
                          {!hideControls && (
                            <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                              <Button
                                size="md"
                                variant="tertiary"
                                onClick={() => handleOnEditSection(ORDER_STAGES.PATIENT_DETAILS)}
                                Icon={() => <IconEditField />}>
                                {t('captions.btnEdit')}
                              </Button>
                            </PermittedComponent>
                          )}
                        </>
                      }
                    />
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                      <DetailSegment label={t('labels.patientIdentifier')} value={patient?.patientIdentifier || '-'} />
                      <DetailSegment label={t('labels.gender')} value={patient?.patientInfo?.gender || '-'} />
                      <DetailSegment label={t('labels.dob')} value={patient?.patientInfo?.dateOfBirth || '-'} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="MCP-panel-container">
              <ModuleHeader
                className={styles.panelHeader}
                heading={<Heading as="h3">{t('labels.additionalDetails')}</Heading>}
                controls={
                  <>
                    {!hideControls && (
                      <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS}>
                        <Button
                          size="md"
                          variant="tertiary"
                          onClick={() => handleOnEditSection(ORDER_STAGES.ADDITIONAL_DETAILS)}
                          Icon={() => <IconEditField />}>
                          {t('captions.btnEdit')}
                        </Button>
                      </PermittedComponent>
                    )}
                  </>
                }
              />
              <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6'}>
                <DetailSegment label={t('labels.coiId')} value={additionalDetails?.coiId} />
                <DetailSegment label={t('labels.slotNo')} value={additionalDetails?.slotNumber} />
                <DetailSegment label={t('labels.poNo')} value={additionalDetails?.poNumber} />
                <DetailSegment label={t('labels.dateOfAdministration')} value={additionalDetails?.dateOfAdministration} />
                <DetailSegment label={t('labels.selectVariant')} value={additionalDetails?.selectVariant || '-'} />
                <DetailSegment
                  label={t('labels.variantDescription')}
                  value={additionalDetails?.variant && additionalDetails.variant?.variantDescription}
                />
                <DetailSegment label={t('labels.patientConsent')} value={additionalDetails?.patientConsentTaken ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
          {!hideControls && (
            <div className="agreement-checkbox-control">
              <CheckboxGroup
                id={'default'}
                name="order-agreement"
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
    </div>
  );
};

export default Summary;
