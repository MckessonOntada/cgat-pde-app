import React, { useEffect } from 'react';
import styles from './PatientDetails.module.scss';
import { Button, Alert } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PatientDetailsForm from './PatientDetailsForm';
import { Form, Formik } from 'formik';
import { getValidationSchema } from './PatientDetailsFormUtils';
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

const PatientDetails = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const alertContainerId = 'patintDetails-alert-container';
  const { showAlert } = useAlert();
  const location = useLocation();
  const { isEdit = false, isApprover = false, alertState } = location.state || {};

  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);

  const { data: orderDetails, isFetching: isFetchingOrderDetails, isError, error, isLoader } = useOrder(orderId);

  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;

  const INITIAL_VALUES = {
    patientInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: ''
    },
    contact: {
      emailId: '',
      phoneNumber: ''
    },
    patientAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      state: ''
    },
    patientIdentifier: ''
  };

  const initialValues = React.useMemo(() => {
    return orderDetails?.patient ? { ...orderDetails.patient } : INITIAL_VALUES;
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

  React.useEffect(() => {
    if (!orderDetails) {
      return;
    }
    if (!orderDetails.patientDetailsRequired) {
      navigate(`../${orderId}/additional-details`);
    }
  }, [orderDetails]);

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
    async ({ payload, skipDuplicateCheck }) => OrderService.savePatientDetails(orderId, payload, skipDuplicateCheck),
    {
      onSuccess: (result) => {
        const { id } = result;
        navigate(`../${id}/additional-details`, { state: { isEdit: false, isApprover: isApprover } });
      },
      onError: ({ err, payload }) => {
        if (err.status === 409) {
          openDuplicateConfirmationModal(payload);
        } else {
          showAlert({ description: err.message, type: 'error', anchorEl: alertContainerId });
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
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isApprover: isApprover } });
    } else {
      navigate(`../${orderId}/accounts`, { state: { isEdit: isEdit, isApprover: isApprover } });
    }
  };

  const handleSubmit = (form, skipDuplicateCheck) => {
    const { patientInfo } = form;
    const payload = CommonUtils.cleanObject(form);

    if (patientInfo && patientInfo.dateOfBirth) {
      payload.dateOfBirth = CommonUtils.convertDateStringFormat(patientInfo.dateOfBirth, 'MM-DD-YYYY');
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
      navigate(`../${orderId}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
    } else if (modalSuccessCallback === 'account') {
      navigate(`../${orderId}/accounts`, { state: { isEdit: isEdit, isApprover: isApprover } });
    }
  };
  if (isLoader) {
    return isLoader;
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
        <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} />

        <div className={styles.wrapper}>
          <OrderHeaderDetails
            orderDetails={orderDetails}
            therapyId={therapyId}
            soldToAccountId={soldToAccountId}
            shipToAccountId={shipToAccountId}
          />
          <div id={alertContainerId} />

          {isError && <Alert showTitle title={error} type={'error'} />}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(t)}
          enableReinitialize
          validate={(values) => {
            const errors = {};
            if (!values.patientIdentifier) {
              errors['patientIdentifier'] = 'Patient Identifier is required';
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            handleSubmit(values);
            actions.setSubmitting(false);
          }}>
          {({ values, isValid, dirty }) => {
            React.useEffect(() => {
              setIsDirty(dirty);
            }, [dirty]);
            return (
              <Form>
                <div className={styles.wrapper}>
                  <div className="MCP-panel-container">
                    <PatientDetailsForm />
                  </div>
                  <ModuleHeader
                    controls={
                      <div className="controls">
                        <Button size="md" variant="secondary" onClick={handleOnBack}>
                          {t('captions.btnBack')}
                        </Button>
                        <Button size="md" variant="primary" type="submit">
                          {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                        </Button>
                      </div>
                    }
                  />
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
