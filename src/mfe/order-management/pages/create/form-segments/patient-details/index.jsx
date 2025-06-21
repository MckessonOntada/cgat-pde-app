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
import useAlert from '@src/hooks/useAlert';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { renderModal } from '@src/util/ModalUtil';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import { sections } from './forms/patient-details.config';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { getInitialValues, getValidationSchema } from './forms/validation-schema';
import { CHANNEL_TYPE } from '../Constants';
import useTimedArray from '../summary/useTimedArray';
import { FooterContext } from '@src/components/footer/FooterContext';
import Components from '@src/components/form/Components';
import useProvider from './useProvider';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';

export const getFilteredSections = (channelType) => {
  return sections(channelType === CHANNEL_TYPE.SPECIALTY_PHARMA).map((section) => ({
    ...section,
    rows: section.rows.map((row) => ({
      ...row,
      controls: row.controls.filter((control) => {
        if (typeof control.if === 'function') {
          return control.if(channelType);
        }
        return true;
      })
    }))
  }));
};

const PatientDetails = () => {
  const { t } = useTranslate();
  const [initialValues, setInitialValues] = React.useState(getInitialValues());
  const { orderId } = useParams();
  const navigate = useNavigate();
  const alertContainerId = 'patintDetails-alert-container';
  const { controlRef } = useContext(FooterContext);
  const { showAlert } = useAlert();
  const location = useLocation();
  const { isEdit = false, isApprover = false, alertState } = location.state || {};
  const searchParams = new URLSearchParams(location.search);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);

  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails, isError, error, isLoader } = useOrder(orderId);

  React.useEffect(() => {
    if (orderDetails.channelType) {
      if (orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL && !orderDetails.patientDetailsRequired)
        navigate(`/orders/${orderId}/additional-details?${searchParams.toString()}`, {
          state: { ...location.state }
        });
    }
  }, [orderDetails]);
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);

  const filteredSections = getFilteredSections(orderDetails.channelType);
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const channelType = orderDetails?.accountDetails?.soldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL;

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

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder)
      navigate(`/orders?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }
      });
  }, [orderDetails]);

  useEffect(() => {
    if (!alertState) {
      return;
    }
    showAlert({ ...alertState, anchorEl: alertContainerId });
  }, []);

  const openDuplicateConfirmationModal = (payload) => {
    renderModal({
      title: t('modal.title.duplicateOrder'),
      bodyContent: (
        <p
          style={{
            fontSize: 'var(--brand-font-size--default)',
            fontWeight: 400,
            lineHeight: 'var(--brand-line-height--m-large)'
          }}>
          {t('modal.body.duplicateOrder.line_1').replace('$order_id', orderId)}
          <br /> {t('modal.body.duplicateOrder.line_2')}
        </p>
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

  const { isLoading: isSaving, mutate: savePatientDetails } = useMutation(
    async ({ payload, skipDuplicateCheck }) => OrderService.savePatientDetails(orderId, payload, skipDuplicateCheck, orderDetails.channelType),
    {
      onSuccess: (result) => {
        const { id } = result;
        if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
          navigate(`../${id}/payer?${searchParams.toString()}`, {
            state: {
              fromTab: location?.state?.fromTab,
              isEdit: false,
              isApprover: isApprover,
              fromOrderView: location?.state?.fromOrderView
            }
          });
        } else {
          navigate(`../${id}/additional-details?${searchParams.toString()}`, {
            state: {
              fromTab: location?.state?.fromTab,
              isEdit: false,
              isApprover: isApprover,
              fromOrderView: location?.state?.fromOrderView
            }
          });
        }
        setProvider(null);
      },
      onError: ({ err, payload }) => {
        if (err.status === 409) {
          openDuplicateConfirmationModal(payload);
        } else {
          addNotification({
            description: err.message,
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
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: true,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else {
      navigate(`../${orderId}/accounts?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
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
    savePatientDetails({ payload, skipDuplicateCheck });
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }
      });
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }
      });
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else if (modalSuccessCallback === 'account') {
      navigate(`../${orderId}/accounts?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    }
  };

  const [provider, setProvider] = React.useState(null);
  const [providerQuery, setProviderQuery] = React.useState('');

  const { providers, isFetching, totalProviders } = useProvider({
    orderDetails,
    query: providerQuery
  });

  const handleOnSelection = (value, setFieldValue) => {
    let provider = providers.find((item) => item.id === value);
    setProvider(provider);
    setFieldValue('providerId', value);
  };

  if (isLoader) {
    return isLoader;
  }
  if (isSaving) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />

      <div className="MCP-module-body">
        <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} channelType={channelType} />

        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}

        <div className={styles.wrapper}>
          <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} channelType={orderDetails.channelType} />
          <div id={alertContainerId} />

          {isError && <Alert showTitle title={error} type={'error'} />}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(t, orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA)}
          enableReinitialize={true}
          onSubmit={(values) => handleSubmit(values)}>
          {({ values, isValid, errors, dirty, setFieldValue }) => {
            React.useEffect(() => {
              setIsDirty(dirty);
            }, [values]);
            return (
              <Form>
                <div className={styles.wrapper}>
                  <div className="MCP-panel-container">
                    <div className="MCP-module-body test-shobhit">
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
                      <FormRenderer sections={filteredSections} />
                      {channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                        <React.Fragment>
                          <hr className="form-section-separator" />
                          <div className="selected-provider">
                            <div className="heading-provider">
                              <Heading as="h2">{t('orderManagement.patientDetails.inputLabel.providerDetails')}</Heading>
                              <p className="form-instruction">
                                <span className="required">*</span>
                              </p>
                            </div>
                            <div className="provider-field-wrap">
                              <Field
                                component={Components['multiSelectDropdown']}
                                id={'patient-info-provider'}
                                name={'providerId'}
                                label={' '}
                                isMultiSelect={false}
                                placeholder={'Select Provider'}
                                onChange={(value) => handleOnSelection(value, setFieldValue)}
                                options={providers.map((item) => ({
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
                                isAsyncLoading={isFetching}
                                refineFilterMessage={[t('paymentInvoices.accountSearch.moreRecordsExist'), t('paymentInvoices.accountSearch.searchToRefine')]}
                                asyncRecordsFound={totalProviders}
                              />
                            </div>
                            {provider && (
                              <div className="details-card">
                                <Heading className="details-title" as="h3">
                                  {provider.fullname}
                                </Heading>
                                <div className="grid grid-gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start grid-justify-start">
                                  <Tooltip body={provider.detailedAddress}>
                                    <p className="detail-segment inline-text-overflow">{provider.detailedAddress}</p>
                                  </Tooltip>
                                  {['dea', 'npi', 'phone'].map((key) => {
                                    const rawValue = provider[key];
                                    const labelMap = {
                                      dea: t('provider.deaNumber'),
                                      npi: t('provider.npiNumber'),
                                      phone: t('provider.phoneNumber')
                                    };
                                    const value = key === 'phone' ? CommonUtils.formatPhoneNumber(rawValue) : rawValue;
                                    return (
                                      <Tooltip key={key} body={value}>
                                        <p className="detail-segment inline-text-overflow">
                                          {labelMap[key]} : {value}
                                        </p>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  <div className="footer-wrapper" ref={controlRef}>
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBack}>
                        {t('captions.btnBack')}
                      </Button>
                      <Button size="md" variant="primary" type="submit">
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
export default PatientDetails;
