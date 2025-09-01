import React, { useContext, useEffect } from 'react';
import styles from './PatientDetails.module.scss';
import { Button, Tooltip, Loader, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation } from 'react-query';
import CommonUtils from '@src/util/CommonUtils';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { renderModal } from '@src/util/ModalUtil';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import { AddressSections, IdentifierSections, PatientSections } from './forms/patient-details.config';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { getInitialValues, getValidationSchema } from './forms/validation-schema';
import { CHANNEL_TYPE, ORDER_STAGES } from '../Constants';
import { FooterContext } from '@src/components/footer/FooterContext';
import Components from '@src/components/form/Components';
import useProvider from './useProvider';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import ProviderAddUpdateForm from './ProviderForm';
import ReactDOM from 'react-dom';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import EclipsesText from '@src/components/EclipsesText/EclipsesText';
import ManufacturerLogo from '../ManufacturerLogo';
import { ORDER_STATUS } from '../../../orders/config';
import OrderAttestation from '../OrderAttestation';
import { NotifyAlert, showSaveAsDraftConfirm } from '../OrderUtil';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { PROVIDER_STATUS } from '@src/mfe/core-config/admin/manage-providers/config';
import { useDispatch } from 'react-redux';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';

const PatientDetails = ({ readOnly, hasPermission }) => {
  const { t } = useTranslate();
  const [initialValues, setInitialValues] = React.useState(getInitialValues());
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { controlRef } = useContext(FooterContext);
  const [alert, setAlert] = React.useState(null);
  const location = useLocation();
  const locationState = location?.state ?? {};
  const { isEdit = false, isApprover = false, alertState } = locationState;
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);
  const [isSelfAttested, setIsSelfAttested] = React.useState(false);
  const dispatch = useDispatch();
  const handleConfirmChange = (checked) => {
    setIsSelfAttested(checked);
    setIsDirty(true);
  };

  React.useEffect(() => {
    const stage = orderDetails?.currentStage;
    if (stage == null) {
      setIsSelfAttested(false);
    } else if (stage !== ORDER_STAGES.PATIENT_DETAILS) {
      setIsSelfAttested(true);
    } else {
      setIsSelfAttested(isSelfAttested);
    }
  }, [orderDetails?.currentStage]);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    const prevSearch = locationState.__prevSearch || '';
    if (isPapOrder) navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

  React.useEffect(() => {
    if (orderDetails.channelType) {
      if (orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL && !orderDetails.patientDetailsRequired)
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/additional-details`, {
          state: { ...locationState }
        });
    }
  }, [orderDetails]);

  const { therapyConfig = {} } = orderDetails;
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const channelType = orderDetails?.accountDetails?.soldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const [showAddProviderForm, setShowAddProviderForm] = React.useState(false);
  const [portalTarget, setPortalTarget] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  useEffect(() => {
    if (showAddProviderForm) {
      const providerForm = document.getElementById('provider-form-portal');
      if (providerForm) setPortalTarget(providerForm);
    }
  }, [showAddProviderForm]);

  const spTherapyConfig = {
    isCoiIdRequired: false,
    isPatientIdentifierRequired: false,
    isMRNRequired: false,
    ...(orderDetails?.spTherapyConfig || {})
  };

  const shouldShowIdentifierSection =
    channelType === CHANNEL_TYPE.SPECIALTY_PHARMA &&
    (spTherapyConfig.isCoiIdRequired || spTherapyConfig.isPatientIdentifierRequired || spTherapyConfig.isMRNRequired);

  const shouldShowRequiredLabel = (spTherapyConfig?.isCoiIdRequired || spTherapyConfig?.isMRNRequired) && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;

  const { data: priceDetails } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId
  });

  React.useEffect(() => {
    if (orderDetails.patient) {
      if (orderDetails.provider) {
        const { name, address } = orderDetails.provider || {};
        setProvider({
          fullname: CommonUtils.getFullName(name),
          detailedAddress: CommonUtils.getDetailedAddress(address),
          ...orderDetails.provider
        });
      }
      setInitialValues({
        patient: orderDetails.patient,
        providerId: orderDetails.provider?.id
      });
    }
  }, [orderDetails]);

  useEffect(() => {
    if (alertState) {
      setAlert({ ...alertState });
    }
    return () => dispatch(hasUnsavedChanges(false));
  }, []);

  const openDuplicateConfirmationModal = (payload) => {
    renderModal({
      title: t('modal.title.duplicateOrder'),
      bodyContent: (
        <div
          style={{
            fontSize: 'var(--brand-font-size--default)',
            fontWeight: 400,
            lineHeight: 'var(--brand-line-height--m-large)'
          }}>
          <p>{t('modal.body.duplicateOrder.line_1').replace('$order_id', orderId)}</p>
          <br />
          <p>{t('modal.body.duplicateOrder.line_2')}</p>
        </div>
      ),
      footerActions: {
        confirm: {
          label: t('modal.action.continue'),
          action: () => {
            handleSubmit(payload, true);
          }
        },
        cancel: {
          label: t('modal.action.cancel')
        }
      }
    });
  };

  const navigateToNextStage = (id) => {
    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      navigate(`${RoutePaths.pathOrderManagement}/${id}/payer`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
        }
      });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}/${id}/additional-details`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
        }
      });
    }
  };
  const { isLoading: isSaving, mutate: savePatientDetails } = useMutation(
    async ({ payload, skipDuplicateCheck, isDraft }) => {
      return OrderService.savePatientDetails(orderId, payload, skipDuplicateCheck, orderDetails.channelType, isDraft);
    },
    {
      onSuccess: (result) => {
        const { id } = result;
        if (isSelfAttested) {
          navigateToNextStage(id);
          setProvider(null);
        } else {
          setAlert({
            description: 'Order Saved In Draft Successfully',
            type: 'success'
          });
        }
      },
      onError: ({ err: error, payload }) => {
        const statusCode = error?.response?.status;
        if (statusCode === 409) {
          openDuplicateConfirmationModal(payload);
        } else {
          let description = t('error.default');
          if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

          setAlert({
            description,
            type: 'error'
          });
        }
      }
    }
  );

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'account');
      return;
    }

    if (isEdit) {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          isEdit: true,
          isApprover: isApprover
        }
      });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/accounts`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    }
  };

  const handleSubmit = (form, skipDuplicateCheck = false) => {
    const payload = CommonUtils.cleanObject(form);
    if (form.dateOfBirth) {
      payload.dateOfBirth = CommonUtils.convertDateStringFormat(form.dateOfBirth, 'MM-DD-YYYY');
    }
    if (isApprover) {
      skipDuplicateCheck = true;
    }
    setInitialValues(form);
    if (!isSelfAttested) {
      showSaveAsDraftConfirm({
        t,
        onOk: () => {
          savePatientDetails({ payload, skipDuplicateCheck, isDraft: true });
        }
      });
    } else {
      if (isDirty) {
        savePatientDetails({ payload, skipDuplicateCheck });
      } else {
        navigateToNextStage(orderId);
      }
    }
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      const prevSearch = locationState?.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleNavigate = () => {
    const prevSearch = locationState?.__prevSearch || '';
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    } else if (modalSuccessCallback === 'account') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/accounts`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    }
  };
  const [providerList, setProviderList] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [providerQuery, setProviderQuery] = React.useState('');
  const [recentlyAddedProvider, setRecentlyAddedProvider] = React.useState(null);

  const {
    providers,
    isFetching: isFetchingProviders,
    totalProviders
  } = useProvider({
    orderDetails,
    query: providerQuery,
    status: PROVIDER_STATUS.ACTIVE
  });

  React.useEffect(() => {
    setProviderList(providers);
  }, [providers]);

  const handleOnSelection = (value, setFieldValue) => {
    let provider = providerList.find((item) => item.id === value);

    if (recentlyAddedProvider?.id === value) {
      setProvider(recentlyAddedProvider);
    } else {
      if (provider) {
        setProvider(provider);
      }
    }
    setFieldValue('providerId', value);
    setShowAddProviderForm(false);
  };

  const handleProviderSaved = (newProvider, setFieldValue) => {
    const { name, address } = newProvider;
    const formattedProvider = {
      ...newProvider,
      fullname: CommonUtils.getFullName(name),
      detailedAddress: CommonUtils.getDetailedAddress(address),
      isNewlyAdded: true
    };
    setProviderList((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === newProvider.id);
      if (existingIndex !== -1) {
        const updatedList = [...prev];
        updatedList[existingIndex] = formattedProvider;
        return updatedList;
      }
      return [...prev, formattedProvider];
    });
    setProvider(formattedProvider);
    setRecentlyAddedProvider(formattedProvider);
    setFieldValue('providerId', formattedProvider.id);
    setShowAddProviderForm(false);
  };

  return (
    <div className="MCP-module-wrapper">
      {(isSaving || isFetching) && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader
        heading={
          <PageHeader
            heading={
              isApprover
                ? t('headings.reviewOrder')
                : orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
                ? t('headings.createNewPrescription')
                : t('headings.createNewOrder')
            }
          />
        }
        controls={
          <div className="controls">
            {orderDetails?.collaborators && <Collaborator collaborators={orderDetails?.collaborators} channelType={channelType} />}
            {orderDetails?.therapy?.manufacturerName ? <ManufacturerLogo therapyId={orderDetails.therapy?.id} /> : null}
          </div>
        }
      />

      <div className="MCP-module-body">
        <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} channelType={channelType} />
        {readOnly && (
          <NotifyAlert
            stage={ORDER_STAGES.PATIENT_AND_PROVIDER_DETAILS}
            OnEdit={readOnly && orderDetails?.currentStage !== ORDER_STAGES.PATIENT_DETAILS ? true : false}
            orderId={orderId}
            setAlert={setAlert}
          />
        )}
        <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} channelType={orderDetails.channelType} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(t, orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA, spTherapyConfig, therapyConfig)}
          enableReinitialize={true}
          onSubmit={(values) => handleSubmit(values)}>
          {({ values, dirty, setFieldValue }) => {
            React.useEffect(() => {
              setIsDirty(dirty);
              dispatch(hasUnsavedChanges(dirty));
            }, [dirty]);
            React.useEffect(() => {
              setIsSelfAttested(false);
            }, [values]);
            return (
              <Form>
                <div className={styles.wrapper}>
                  <fieldset className="MCP-fieldset" disabled={readOnly}>
                    <div className="MCP-module-body">
                      <div className="MCP-panel-container">
                        <ModuleHeader
                          heading={
                            <div>
                              <Heading as="h2">{t('orderManagement.patientDetails.patient_details')}</Heading>
                            </div>
                          }
                          controls={
                            <p className="form-instruction">
                              <span className="required">*</span> {t('labels.required')}
                            </p>
                          }
                        />

                        <FormRenderer sections={PatientSections(channelType, therapyConfig)} readOnly={readOnly} />
                        {channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                          <>
                            <hr className="form-section-separator" />
                            <ModuleHeader
                              heading={
                                <div>
                                  <Heading as="h2">{t('orderManagement.patientDetails.address_details')}</Heading>
                                </div>
                              }
                              controls={
                                <p className="form-instruction">
                                  <span className="required">*</span> {t('labels.required')}
                                </p>
                              }
                            />
                            <FormRenderer sections={AddressSections(channelType)} readOnly={readOnly} />
                          </>
                        )}

                        {shouldShowIdentifierSection && (
                          <>
                            <hr className="form-section-separator" />
                            <ModuleHeader
                              heading={
                                <div>
                                  <Heading as="h2">{t('orderManagement.patientDetails.identifier_details')}</Heading>
                                </div>
                              }
                              controls={
                                shouldShowRequiredLabel && (
                                  <p className="form-instruction">
                                    <span className="required">*</span> {t('labels.required')}
                                  </p>
                                )
                              }
                            />
                            <FormRenderer sections={IdentifierSections(channelType, spTherapyConfig)} readOnly={readOnly} />
                          </>
                        )}
                        {channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                          <React.Fragment>
                            <hr className="form-section-separator" />
                            <div className="MCP-module-body">
                              <ModuleHeader
                                heading={<Heading as="h2">{t('orderManagement.patientDetails.inputLabel.providerDetails')}</Heading>}
                                controls={
                                  <p className="form-instruction">
                                    <span className="required">*</span> {t('labels.required')}
                                  </p>
                                }
                              />

                              <div className="provider-details">
                                <Field
                                  component={Components['multiSelectDropdown']}
                                  id={'patient-info-provider'}
                                  name={'providerId'}
                                  label={' '}
                                  isMultiSelect={false}
                                  placeholder={'Select Provider'}
                                  onChange={(value) => handleOnSelection(value, setFieldValue)}
                                  options={(Array.isArray(providerList) ? providerList : []).map((item) => ({
                                    label: item.fullname,
                                    labelDescription: item.detailedAddress,
                                    value: item.id
                                  }))}
                                  value={provider?.id.toString()}
                                  variant={'async'}
                                  onSearch={setProviderQuery}
                                  recordsCountToEnableSearch={5}
                                  size="lg"
                                  fieldDisplayValue={CommonUtils.isNonEmptyObject(provider) ? provider : undefined}
                                  isAsyncLoading={isFetchingProviders}
                                  refineFilterMessage={[t('paymentInvoices.accountSearch.moreRecordsExist'), t('paymentInvoices.accountSearch.searchToRefine')]}
                                  asyncRecordsFound={totalProviders}
                                  isReadOnly={readOnly}
                                />
                                {provider && (
                                  <div className="details-card">
                                    <ModuleHeader
                                      heading={
                                        <Heading className="details-title" as="h3">
                                          <EclipsesText str={provider.fullname} />
                                        </Heading>
                                      }
                                      controls={
                                        provider.isNewlyAdded && (
                                          <span>
                                            <Button
                                              Icon={EditPencil}
                                              variant="tertiary"
                                              className="button-icon"
                                              size="md"
                                              type="button"
                                              onClick={() => {
                                                setIsEditing(true);
                                                setShowAddProviderForm(true);
                                              }}>
                                              {t('userManagement.button.edit')}
                                            </Button>
                                          </span>
                                        )
                                      }
                                    />

                                    <div className="grid grid-gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start grid-justify-start">
                                      <Tooltip body={provider.detailedAddress}>
                                        <p className="detail-segment inline-text-overflow">
                                          <EclipsesText str={provider.detailedAddress} maxLength={35} />
                                        </p>
                                      </Tooltip>
                                      {['dea', 'npi', 'phone', 'email', 'tin'].map((key) => {
                                        const rawValue = provider[key];
                                        const labelMap = {
                                          dea: t('provider.deaNumber'),
                                          npi: t('provider.npiNumber'),
                                          phone: t('provider.phoneNumber'),
                                          email: t('provider.emailId'),
                                          tin: t('provider.tin')
                                        };
                                        const value =
                                          key === 'phone'
                                            ? CommonUtils.formatPhoneNumber(rawValue)
                                            : key === 'tin'
                                            ? CommonUtils.formatTIN(rawValue)
                                            : rawValue;
                                        return (
                                          <Tooltip key={key} body={value}>
                                            <p className="detail-segment inline-text-overflow">
                                              {labelMap[key]} : {!!value ? <EclipsesText str={value} maxLength={35} /> : '-'}
                                            </p>
                                          </Tooltip>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="styled-icon-button">
                                {!showAddProviderForm && (
                                  <Button
                                    Icon={PlusIcon}
                                    variant="tertiary"
                                    type="button"
                                    onClick={() => {
                                      setIsEditing(false);
                                      setShowAddProviderForm(true);
                                      setProvider(null);
                                      setFieldValue('providerId', null);
                                    }}
                                    size="md">
                                    {t('provider.btnAddProvider')}
                                  </Button>
                                )}
                                {showAddProviderForm && <div id="provider-form-portal" />}
                                {showAddProviderForm &&
                                  portalTarget &&
                                  ReactDOM.createPortal(
                                    <div className="inline-provider-form-wrapper">
                                      <ProviderAddUpdateForm
                                        setShowAddProviderForm={setShowAddProviderForm}
                                        providerData={isEditing ? provider : []}
                                        accountId={soldToAccountId}
                                        onProviderSaved={(newProvider) => handleProviderSaved(newProvider, setFieldValue)}
                                      />
                                    </div>,
                                    portalTarget
                                  )}
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    <OrderAttestation
                      stage={
                        orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL ? ORDER_STAGES?.PATIENT_DETAILS : ORDER_STAGES?.PATIENT_AND_PROVIDER_DETAILS
                      }
                      onCheck={handleConfirmChange}
                      isChecked={isSelfAttested}
                    />
                  </fieldset>
                  <div className="footer-wrapper" ref={controlRef}>
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBack}>
                        {t('captions.btnBack')}
                      </Button>
                      <Button size="md" variant="primary" type="submit" disabled={readOnly}>
                        {t('captions.btnSaveAndContinue')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <DiscardChangesModal
        heading={t('messages.confirmation.discardheader')}
        description={t('messages.confirmation.patient')}
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};
// export default PatientDetails;
export default withPermissions(PatientDetails, ORDER_STAGES.PATIENT_DETAILS);
