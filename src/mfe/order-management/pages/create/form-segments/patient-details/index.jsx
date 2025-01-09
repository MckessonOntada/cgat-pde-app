import React, { useEffect, useState } from 'react';
import styles from './PatientDetails.module.scss';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PatientDetailsForm from './PatientDetailsForm';
import { Form, Formik } from 'formik';
import { getValidationSchema } from './PatientDetailsFormUtils';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation } from 'react-query';
import CommonUtils from '@src/util/CommonUtils';
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import useAlert from '@src/hooks/useAlert';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { renderModal } from '@src/util/ModalUtil';

const PatientDetails = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formState, setActiveRecord, setCurrentOrder, messageConfig, editByStage } = useManageOrder();
  const alertContainerId = 'patintDetails-alert-container';
  const { showAlert } = useAlert();
  const location = useLocation();
  const { isEdit = false, isReview = false, isApprover = false, alertState } = location.state || {};
  const isReviewandEdit = isReview && isEdit;
  const therapyId = formState.activeRecord?.therapy?.materialNumber;
  const soldToAccountId = formState.activeRecord?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = formState.activeRecord?.accountDetails?.shipToAccount?.accountNumber;

  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);

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

  const [initialValues, setInitialValues] = useState(INITIAL_VALUES);

  useEffect(() => {
    if (!alertState) {
      return;
    }
    showAlert({ ...alertState, anchorEl: alertContainerId });
  }, []);

  React.useEffect(() => {
    if (!formState.activeRecord) {
      return;
    }
    if (!formState.activeRecord.patientDetailsRequired) {
      navigate(`../${orderId}/additional-details`);
    } else {
      setInitialValues({ ...formState.activeRecord?.patient });
    }
  }, [formState.activeRecord]);

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
        setActiveRecord(result);
        navigate(`../${id}/additional-details`, { state: { isEdit: isEdit, isReview: isReview, isApprover: isApprover } });
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

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.PATIENT_DETAILS);
  }, []);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'account');
      return;
    }

    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: true, isReview: isReview, isApprover: isApprover } });
    } else {
      editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
      navigate(`../${orderId}/accounts`, { state: { isReview: isReview, isEdit: isEdit, isApprover: isApprover } });
    }
  };

  const handleSubmit = (form, skipDuplicateCheck) => {
    const { patientInfo } = form;

    const payload = {
      ...form
    };
    if (patientInfo && patientInfo.dateOfBirth) {
      payload.dateOfBirth = CommonUtils.convertDateStringFormat(patientInfo.dateOfBirth, 'MM-DD-YYYY');
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
      navigate(`../${orderId}/summary`, { state: { isEdit: isEdit, isReview: isReview, isApprover: isApprover } });
    } else if (modalSuccessCallback === 'account') {
      editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
      navigate(`../${orderId}/accounts`, { state: { isEdit: isEdit, isReview: isReview, isApprover: isApprover } });
    }
  };

  const forms = FormList(t);
  const { therapy, accountDetails, orderCost } = formState.activeRecord || {};
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader
        heading={
          <Heading as="h1">
            {isReviewandEdit ? t('headings.reviewOrder') : isEdit ? t('headings.editOrder') : t('headings.createNewOrder')}
          </Heading>
        }
      />

      <div className="MCP-module-body">
        {/* <Stepper activeIndex={3} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} /> */}
        <OrderStepper />

        <div className={styles.wrapper}>
          {/* <div className="MCP-panel-container">
            <div className={styles.sect}>
              <div className={`row-space-between-center`}>
                <div className={styles.row}>
                  <div className={`${styles.col} ${styles.detailSegment}`}>
                    <div className={'fieldName'}>{t('labels.therapyDescription')}</div>
                    <div className={`${'fieldValue'} ${styles.price}`}>
                      {therapy?.materialDescription}
                      <TickIcon width="16px" height="16px" />
                    </div>
                  </div>
                  <div className={`${styles.col} ${styles.detailSegment}`}>
                    <div className={'fieldName'}>{t('labels.orderByAccountNumber')}</div>
                    <div className={'fieldValue'}>{accountDetails?.accountNumber}</div>
                  </div>
                </div>
                <div className={`${styles.col} ${styles.detailSegment}`}>
                  <div className={'fieldName'}>{t('labels.shipToAccountNumber')}</div>
                  <div className={`${'fieldValue'} ${styles.price}`}>{accountDetails?.shipToAccount?.accountNumber}</div>
                </div>
                <div className={`${styles.col} ${styles.detailSegment}`}>
                  <div className={'fieldName'}>{t('labels.priceDetails')}</div>
                  <div className={`${'fieldValue'} ${styles.price}`}>{orderCost || '--'}</div>
                </div>
              </div>
            </div>
          </div> */}

          <OrderHeaderDetails therapyId={therapyId} soldToAccountId={soldToAccountId} shipToAccountId={shipToAccountId} />
          <div id={alertContainerId} />

          {messageConfig && messageConfig.primaryMessage && (
            <Alert onClose={clearMessage} showTitle title={messageConfig.primaryMessage} type={messageConfig.messageKind} />
          )}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema(t)}
          enableReinitialize
          onSubmit={(values, actions) => {
            handleSubmit(values);
            actions.setSubmitting(false);
          }}>
          {({ values, isValid }) => {
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
                          {isEdit ? t('captions.btnBack') : t('captions.btnBacktoAccountSelection')}
                        </Button>
                        <Button size="md" variant="primary" disabled={!values?.patientIdentifier || isSaving} type="submit">
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
