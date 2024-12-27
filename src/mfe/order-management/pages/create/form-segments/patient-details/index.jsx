import React, { useRef, useState } from 'react';
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

const PatientDetails = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { formState, setActiveRecord, setCurrentOrder, messageConfig, editByStage } = useManageOrder();
  const alertContainerRef = useRef(null);
  const { showAlert } = useAlert();
  const location = useLocation();
  const { isEdit = false } = location.state || {};

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

  const { isLoading: isSaving, mutate: savePatientDetails } = useMutation(async (data) => OrderService.savePatientDetails(orderId, data), {
    onSuccess: (result) => {
      const { id } = result;
      setActiveRecord(result);
      navigate(`../${id}/additional-details`);
    },
    onError: () => {
      showAlert({ description: err.message, type: 'error', anchorEl: alertContainerRef });
    }
  });

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.PATIENT_DETAILS);
  }, []);

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
    navigate(`../${orderId}/accounts`);
  };

  const handleSubmit = (form) => {
    const { patientInfo } = form;

    const payload = {
      ...form
    };
    if (patientInfo && patientInfo.dateOfBirth) {
      payload.dateOfBirth = CommonUtils.convertDateStringFormat(patientInfo.dateOfBirth, 'MM-DD-YYYY');
    }

    savePatientDetails(payload);
  };

  const handleOnBackToOrders = () => {
    //compare data change, display modal for confirmation
    navigate(-1);
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

      <PageHeader heading={<Heading as="h1">{isEdit ? t('headings.editOrder') : t('headings.createNewOrder')}</Heading>} />

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

          <OrderHeaderDetails />

          {messageConfig && messageConfig.primaryMessage && (
            <Alert onClose={clearMessage} showTitle title={messageConfig.primaryMessage} type={messageConfig.messageKind} />
          )}
        </div>
        <div ref={alertContainerRef} />
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
                          {t('captions.btnBack')}
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
    </div>
  );
};
export default PatientDetails;
