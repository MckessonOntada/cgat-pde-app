import React, { useEffect } from 'react';
import styles from './PatientDetails.module.scss';
import {
  Button,
  Alert,
  Tooltip,
  Loader,
  Heading
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
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
import FormRenderer from '@src/mfe/core-config/manage-providers/forms/FormRenderer';
import { providerSections } from './forms/providers.config';
import {
  getInitialValues,
  getValidationSchema
} from './forms/validation-schema';
import ProviderService from '@src/api/commonService/ProviderService';
import { CHANNEL_TYPE } from '../Constants';
import useTimedArray from '../summary/useTimedArray';

export const getFilteredSections = (channelType) => {
  return sections.map((section) => ({
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
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState(getInitialValues());
  const { orderId } = useParams();
  const navigate = useNavigate();
  const alertContainerId = 'patintDetails-alert-container';
  const { showAlert } = useAlert();
  const location = useLocation();
  const {
    isEdit = false,
    isApprover = false,
    alertState
  } = location.state || {};

  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);

  const {
    data: orderDetails = {},
    isFetching: isFetchingOrderDetails,
    isError,
    error,
    isLoader
  } = useOrder(orderId);

  React.useEffect(() => {
    if (orderDetails.channelType) {
      if (
        orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL &&
        !orderDetails.patientDetailsRequired
      )
        navigate(`/orders/${orderId}/additional-details`);
    }
  }, [orderDetails]);
  const {
    items: notifications,
    add: addNotification,
    remove: removeNotification
  } = useTimedArray(10000);

  const filteredSections = getFilteredSections(orderDetails.channelType);
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId =
    orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId =
    orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const channelType =
    orderDetails?.accountDetails?.soldToAccount?.channelType ||
    CHANNEL_TYPE.BUY_AND_BILL;

  const { data: priceDetails } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId
  });
  const [providers, setProviders] = React.useState([]);

  React.useEffect(() => {
    if (orderDetails.patient) {
      setInitialValues({
        patient: orderDetails.patient,
        providerId: orderDetails.provider?.id
      });
      if (orderDetails.provider) {
        const { name, address } = orderDetails.provider || {};
        setSelectedProvider({
          fullname: CommonUtils.getFullName(name),
          detailedAddress: CommonUtils.getDetailedAddress(address),
          ...orderDetails.provider
        });
      }
    }
  }, [orderDetails]);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate('/orders');
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
    async ({ payload, skipDuplicateCheck }) =>
      OrderService.savePatientDetails(
        orderId,
        payload,
        skipDuplicateCheck,
        orderDetails.channelType
      ),
    {
      onSuccess: (result) => {
        const { id } = result;
        if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
          navigate(`../${id}/payer`, {
            state: { isEdit: false, isApprover: isApprover }
          });
        } else {
          navigate(`../${id}/additional-details`, {
            state: { isEdit: false, isApprover: isApprover }
          });
        }
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
      navigate(`../${orderId}/summary`, {
        state: { isEdit: true, isApprover: isApprover }
      });
    } else {
      navigate(`../${orderId}/accounts`, {
        state: { isEdit: isEdit, isApprover: isApprover }
      });
    }
  };

  const handleSubmit = (form) => {
    const payload = CommonUtils.cleanObject(form);
    let skipDuplicateCheck = false;
    if (form.dateOfBirth) {
      payload.dateOfBirth = CommonUtils.convertDateStringFormat(
        form.dateOfBirth,
        'MM-DD-YYYY'
      );
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
      navigate(RoutePaths.pathOrderManagement);
    }
  };
  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathOrderManagement);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, {
        state: { isEdit: isEdit, isApprover: isApprover }
      });
    } else if (modalSuccessCallback === 'account') {
      navigate(`../${orderId}/accounts`, {
        state: { isEdit: isEdit, isApprover: isApprover }
      });
    }
  };

  React.useEffect(() => {
    if (
      orderDetails &&
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
    ) {
      const params = {
        accountId: orderDetails.accountDetails?.soldToAccount?.id
      };
      ProviderService.getAllProviders(params).then((response) => {
        if (response.content && Array.isArray(response.content)) {
          const beautifiedProviders = response.content.map((provider) => {
            const { name, address } = provider;
            return {
              id: provider.id?.toString(),
              ...provider,
              fullname: CommonUtils.getFullName(name),
              detailedAddress: CommonUtils.getDetailedAddress(address)
            };
          });
          setProviders(beautifiedProviders);
        }
      });
    }
  }, [orderDetails]);

  if (isLoader) {
    return isLoader;
  }
  if (isSaving) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackToOrders}
          size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader
        heading={
          isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')
        }
      />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={channelType}
        />

        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert
                  key={item.id}
                  description={item.description}
                  onClose={() => removeNotification(item.id)}
                  type={item.type}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.wrapper}>
          <OrderHeaderDetails
            orderDetails={orderDetails}
            priceDetails={priceDetails}
          />
          <div id={alertContainerId} />

          {isError && <Alert showTitle title={error} type={'error'} />}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(t)}
          enableReinitialize={true}
          onSubmit={handleSubmit}>
          {({ values, isValid, errors, dirty }) => {
            React.useEffect(() => {
              const { providerId } = values;
              const selectedProvider = providers.find(
                (item) => item.id?.toString() === providerId
              );
              if (selectedProvider) {
                setSelectedProvider(selectedProvider);
              }
              setIsDirty(dirty);
            }, [values]);
            return (
              <Form>
                <div className={styles.wrapper}>
                  <div className="MCP-panel-container">
                    <div className="MCP-module-body">
                      <FormRenderer sections={filteredSections} />
                      {channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                        <React.Fragment>
                          <hr />
                          <div className="selected-provider">
                            <div className="MCP-module-body">
                              <Heading as="h2">Provider Details</Heading>
                              <FormRenderer
                                sections={providerSections({
                                  providers: providers.map((item) => ({
                                    label: item.fullname,
                                    subLabel: item.detailedAddress,
                                    value: item.id.toString()
                                  }))
                                })}
                              />
                            </div>
                            {selectedProvider && (
                              <div className="details-card">
                                <Heading className="details-title" as="h3">
                                  {selectedProvider.fullname}
                                </Heading>
                                <div className="grid grid-gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-start">
                                  <Tooltip
                                    body={selectedProvider.detailedAddress}>
                                    <p className="detail-segment inline-text-overflow">
                                      {selectedProvider.detailedAddress}
                                    </p>
                                  </Tooltip>
                                  {['dea', 'npi', 'phone'].map((key) => {
                                    const value = selectedProvider[key];
                                    return (
                                      <Tooltip body={value}>
                                        <p className="detail-segment inline-text-overflow">
                                          {value}
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
                  <div className="footer-wrapper">
                    <div className="controls footer-controls">
                      <Button
                        size="md"
                        variant="secondary"
                        onClick={handleOnBack}>
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
