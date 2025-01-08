import React from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, CheckboxGroup, Stepper, Heading, Loader } from '@mckesson/mcp-component-library';
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
import { useMutation } from 'react-query';
import { orderStatus } from '@src/mfe/order-management/utils/orderManagementVariables';
import { RoutePaths } from '@src/routes/constants';
import { StatusEnum } from '../../../orders/constants';
import { renderModal } from '@src/util/ModalUtil';

const Summary = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { isFetching, formState, editByStage, setCurrentOrder } = useManageOrder();
  const { orderId } = useParams();
  const location = useLocation();
  const { isEdit = false, isReview = false } = location.state || {};
  const alertContainerId = 'summary-alert-container';
  const { showAlert } = useAlert();

  const submitOrder = useMutation(async () => await OrderService.submitOrder(orderId), {
    onSuccess: (result) => {
      navigate(`../${orderId}/order-confirmed`);
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
    //compare data change, display modal for confirmation
    if (isEdit && formState.activeRecord.status === StatusEnum.SUBMITTED) {
      navigate(RoutePaths.pathOrderManagement, { state: { activeTab: 2 } });
    } else if (isReview) {
      navigate(RoutePaths.pathOrderManagement);
    } else {
      editByStage(ORDER_STAGES.ADDITIONAL_DETAILS);
      navigate(`../${orderId}/additional-details`);
    }
  };

  const handleOnSubmit = () => {
    if (agreeCheckboxOptions.isChecked) {
      submitOrder.mutate();
    }
    return;
  };

  const handleReject = () => {
    return;
  };
  const handleApprove = () => {
    navigate(`../${orderId}/order-confirmed`, { state: { isApproved: true } });
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

  const handleOnReject = () => {
    if (agreeCheckboxOptions.isChecked) {
      renderModal({
        title: t('messages.header.warning'),
        bodyContent: <h3>{t('messages.confirmation.reject')},</h3>,
        footerActions: {
          cancel: {
            label: t('label.no')
          },
          confirm: {
            label: t('label.yes'),
            action: () => {
              handleReject();
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
        navigate(`../edit-order/${orderId}`, { state: { isEdit: true, isReview: isReview } });
        break;
      }
      case ORDER_STAGES.ACCOUNT_DETAILS: {
        navigate(`../${orderId}/accounts`, { state: { isEdit: true, isReview: isReview } });
        break;
      }
      case ORDER_STAGES.PATIENT_DETAILS: {
        navigate(`../${orderId}/patient`, { state: { isEdit: true, isReview: isReview } });
        break;
      }
      case ORDER_STAGES.ADDITIONAL_DETAILS: {
        navigate(`../${orderId}/additional-details`, { state: { isEdit: true, isReview: isReview } });
        break;
      }
      default: {
        navigate('/orders');
        break;
      }
    }
  };

  if (isFetching) {
    return <Loader />;
  }

  const forms = FormList(t);
  const {
    therapy = {},
    catalog = {},
    orderCost,
    accountDetails = {},
    patient,
    additionalDetails = {},
    patientDetailsRequired = false,
    status
  } = formState.activeRecord || {};
  const isAgreed = agreeCheckboxOptions.isChecked;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      {formState.activeRecord?.status !== StatusEnum.SUBMITTED && !isReview && (
        <PageHeader heading={<Heading as="h1">{t('headings.createNewOrder')}</Heading>} />
      )}
      {isReview && <PageHeader heading={<Heading as="h1">{t('headings.reviewOrder')}</Heading>} />}
      <div id={alertContainerId} />
      <div className="MCP-module-body">
        {formState.activeRecord?.status !== StatusEnum.SUBMITTED && (
          <Stepper activeIndex={5} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />
        )}
        <div className={'MCP-module-wrapper'}>
          <ModuleHeader heading={<Heading as="h2">{t('labels.summary')}</Heading>} />
          <div className={'MCP-module-body'}>
            <div className="MCP-panel-container">
              <ModuleHeader
                className={styles.panelHeader}
                heading={<Heading as="h3">{t(isReview ? 'labels.orderDetails' : 'labels.price')}</Heading>}
              />
              <div class={styles.flexPanel}>
                {isReview && <DetailSegment label={t('labels.orderId')} value={orderId} />}
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
                      {status !== orderStatus.SUBMITTED && (
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
                  <DetailSegment label={t('labels.UDI')} value={catalog?.uDI || '-'} />
                  <DetailSegment
                    label={t('labels.distributionChannel')}
                    value={accountDetails?.shipToAccount?.distributionChannel || '-'}
                  />
                  <DetailSegment label={t('labels.salesOrganization')} value={accountDetails?.shipToAccount?.accountName} />
                  <DetailSegment label={t('labels.netPrice')} value={catalog?.netPrice || '-'} />
                  <DetailSegment label={t('labels.contractPrice')} value={catalog?.contractPrice || '-'} />
                  <DetailSegment label={t('labels.wacPrice')} value={catalog?.wACPrice || '-'} />
                  <DetailSegment label={t('labels.regularPrice')} value={catalog?.regularPrice || '-'} />
                  <DetailSegment label={t('labels.340bPrice')} value={catalog?.['340bPrice'] || '-'} />
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
                        {status !== orderStatus.SUBMITTED && (
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
                          {status !== orderStatus.SUBMITTED && (
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
              {}
              <ModuleHeader
                className={styles.panelHeader}
                heading={<Heading as="h3">{t('labels.additionalDetails')}</Heading>}
                controls={
                  <>
                    {status !== orderStatus.SUBMITTED && (
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
          <div className="agreement-checkbox-control">
            <CheckboxGroup
              id={'default'}
              name="order-agreement"
              items={[{ ...agreeCheckboxOptions, onChange: () => handleChange() }]}
              size="md"
            />
          </div>
          <div className="controls">
            <Button disabled={true} size={'md'} variant="secondary">
              {t('captions.btnPrintSummary')}
            </Button>
            {!isReview && (
              <>
                <Button size={'md'} variant="secondary" onClick={handleOnBackButtonClick}>
                  {t('captions.btnBack')}
                </Button>
                <PermittedComponent
                  permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS, PERMISSIONS_ENUM.ORDER_MANAGEMENT.EDIT_ORDERS]}>
                  <Button
                    size={'md'}
                    variant="primary"
                    type="submit"
                    onClick={handleOnSubmit}
                    disabled={!isAgreed || formState.activeRecord?.status === StatusEnum.SUBMITTED}>
                    {t('captions.btnSubmitOrder')}
                  </Button>
                </PermittedComponent>
              </>
            )}
            {isReview && (
              <>
                <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER]}>
                  <Button size={'md'} variant="primary" type="submit" onClick={handleOnReject} disabled={!isAgreed}>
                    {t('captions.btnRejectOrder')}
                  </Button>
                </PermittedComponent>
                <PermittedComponent permissions={[PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS]}>
                  <Button size={'md'} variant="primary" type="submit" onClick={handleOnApprove} disabled={!isAgreed}>
                    {t('captions.btnApproveOrder')}
                  </Button>
                </PermittedComponent>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
