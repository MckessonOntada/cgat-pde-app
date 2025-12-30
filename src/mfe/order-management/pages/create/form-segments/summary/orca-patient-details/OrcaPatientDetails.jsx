import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { Form, Formik } from 'formik';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHANNEL_TYPE } from '../../Constants';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { PatientSections } from '../../patient-details/forms/patient-details.config';
import OrderService from '@src/api/commonService/OrderService';
import { Alert, Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { OrcaPatientVerificationPanel } from '../../orca-patient-verification-panel';
import { useMutation } from 'react-query';
import { getValidationSchema } from '../../patient-details/forms/validation-schema';
import { getManufacturer } from '../../OrderUtil';
import CommonUtils from '@src/util/CommonUtils';

function OrcaPatientDetails() {
  const { orderId } = useParams();
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = React.useState({});
  const { data: orderDetails = {}, isLoading } = useOrder(orderId);
  const channelType = orderDetails?.accountDetails?.soldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const { therapyConfig = {} } = orderDetails;
  const [isOrcaValidationPanelOpen, setIsOrcaValidationPanelOpen] = React.useState(false);
  const [orcaPatientList, setOrcaPatientList] = React.useState([]);
  const [orcaVerifiedPatient, setOrcaVerifiedPatient] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const manufacturer = getManufacturer(orderDetails);
  const formikRef = React.useRef();

  React.useEffect(() => {
    if (orderDetails.id) {
      const { patient = {} } = orderDetails;
      const formValues = {
        patient: {
          medicalRecordNumber: patient.medicalRecordNumber,
          patientIdentifier: patient.patientIdentifier,
          patientInfo: patient.patientInfo
        }
      };
      setInitialValues(formValues);
      setOrcaVerifiedPatient({
        medicalRecordNumber: patient.medicalRecordNumber,
        patientId: patient.patientIdentifier,
        ...patient.patientInfo
      });
    }
  }, [orderDetails]);

  React.useEffect(() => {
    if (formikRef.current) {
      const setFieldValue = formikRef.current?.setFieldValue;
      if (orcaVerifiedPatient) {
        setFieldValue('patient.medicalRecordNumber', orcaVerifiedPatient.medicalRecordNumber);
        setFieldValue('patient.patientIdentifier', orcaVerifiedPatient.patientId);
        setFieldValue('patient.patientInfo.firstName', orcaVerifiedPatient.firstName);
        setFieldValue('patient.patientInfo.middleName', orcaVerifiedPatient.middleName);
        setFieldValue('patient.patientInfo.lastName', orcaVerifiedPatient.lastName);
        setFieldValue('patient.patientInfo.gender', orcaVerifiedPatient.gender);
        setFieldValue('patient.patientInfo.dateOfBirth', orcaVerifiedPatient.dateOfBirth);
      } else {
        setFieldValue('patient.patientInfo.firstName', '');
        setFieldValue('patient.patientInfo.middleName', '');
        setFieldValue('patient.patientInfo.lastName', '');
        setFieldValue('patient.patientInfo.gender', '');
        setFieldValue('patient.patientInfo.dateOfBirth', '');
      }
    }
  }, [orcaVerifiedPatient]);

  const validateOnBlur = (e) => {
    const { id, value } = e.target;
    if (!value) return;

    const patientId = formikRef.current?.values?.patient?.patientIdentifier;
    const medicalRecordNumber = formikRef.current?.values?.patient?.medicalRecordNumber;

    validateOrcaDetails(patientId, medicalRecordNumber);
  };

  const validateOrcaDetails = (patientId, medicalRecordNumber) => {
    const payload = {};
    if (patientId) payload.patientId = patientId;
    else if (medicalRecordNumber) payload.medicalRecordNumber = medicalRecordNumber;

    if (CommonUtils.isNonEmptyObject(payload))
      OrderService.verifyOrcaDetails(payload)
        .then((response) => {
          if (response && Array.isArray(response) && response.length > 0) {
            setOrcaPatientList([...response]);
            setIsOrcaValidationPanelOpen(true);
          }
        })
        .catch((error) => {
          const setFieldValue = formikRef.current?.setFieldValue;
          setFieldValue('patient.medicalRecordNumber', formikRef.current?.values?.patient?.medicalRecordNumber);
          setFieldValue('patient.patientIdentifier', formikRef.current?.values?.patient?.patientIdentifier);
          setFieldValue('patient.patientInfo.firstName', '');
          setFieldValue('patient.patientInfo.middleName', '');
          setFieldValue('patient.patientInfo.lastName', '');
          setFieldValue('patient.patientInfo.gender', '');
          setFieldValue('patient.patientInfo.dateOfBirth', null);

          setAlert({
            type: 'warning',
            description: translateFn('message.orcaPatientVerificationFailed1')
          });
        });
  };

  const handleOnBack = () => {
    navigate('./../summary');
  };

  const { isLoading: isSaving, mutate: savePatientDetails } = useMutation(
    async ({ payload, skipDuplicateCheck, isSendNotification }) => {
      return OrderService.savePatientDetails(orderId, payload, true, orderDetails.channelType, false, isSendNotification);
    },
    {
      onSuccess: (result) => {},
      onError: ({ err: error, payload }) => {}
    }
  );

  const handleOnSave = (values) => {
    const { patient } = values;
    if (!patient) return;
    const payload = {
      patient
    };
    savePatientDetails({ payload });
  };

  const spTherapyConfig = {
    isCoiIdRequired: false,
    isPatientIdentifierRequired: false,
    isMRNRequired: false,
    ...(orderDetails?.spTherapyConfig || {})
  };

  if (isLoading) return <Loader type={'circular'} />;

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <div className="stack">
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
              {translateFn('captions.btnBackToSummary')}
            </Button>
          </div>
          <Heading as="h4" className="page-heading">
            Edit Patient Details
          </Heading>
        </div>
      </div>
      <div className="MCP-module-body">
        {alert && <Alert {...alert} />}
        <div className="">
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(
              translateFn,
              orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA,
              spTherapyConfig,
              therapyConfig,
              manufacturer
            )}
            onSubmit={handleOnSave}
            enableReinitialize
            innerRef={formikRef}>
            <Form>
              <div className="stack">
                <div className="MCP-panel-container">
                  <p className="section-title">Patient Details</p>
                  <FormRenderer sections={PatientSections(channelType, therapyConfig, validateOnBlur, orcaVerifiedPatient?.id > 0, manufacturer)} />
                </div>
                <div className="controls">
                  <Button onClick={handleOnBack} variant="secondary">
                    {translateFn('captions.btnCancel')}
                  </Button>
                  <Button type="submit">{translateFn('captions.btnSaveChanges')}</Button>
                </div>
              </div>
            </Form>
          </Formik>
          {isOrcaValidationPanelOpen && (
            <OrcaPatientVerificationPanel
              patientId={formikRef.current?.values?.patientIdentifier}
              medicalRecordNumber={formikRef.current?.values?.patientIdentifier}
              patientList={orcaPatientList}
              setVerifiedPatient={setOrcaVerifiedPatient}
              onAlert={setAlert}
              onClose={() => {
                setIsOrcaValidationPanelOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrcaPatientDetails;
