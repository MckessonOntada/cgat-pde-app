import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { Form, Formik, getIn } from 'formik';
import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CHANNEL_TYPE, MANUFACTURER } from '../../Constants';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { PatientSections } from '../../patient-details/forms/patient-details.config';
import OrderService from '@src/api/commonService/OrderService';
import { Alert, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { OrcaPatientVerificationPanel } from '../../orca-patient-verification-panel';
import { getValidationSchema } from '../../patient-details/forms/validation-schema';
import { getManufacturer, removeFieldPrefixSuffix, updatePatientValues } from '../../OrderUtil';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';
import { ORDER_STATUS } from '@src/mfe/order-management/pages/orders/config';
import PageHeader from '@src/components/pageHeader';

function OrcaPatientDetails() {
  const { orderId } = useParams();
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = React.useState({});
  const [isDirty, setIsDirty] = React.useState(false);
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('orgId');
  const isCustomerCentreUser = AuthUtils.isCustomerCenterView();
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {}, orcaPatient } = state;
  const channelType = orderDetails?.accountDetails?.soldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const { therapyConfig = {} } = orderDetails;
  const [isOrcaValidationPanelOpen, setIsOrcaValidationPanelOpen] = React.useState(false);
  const [orcaPatientList, setOrcaPatientList] = React.useState([]);
  const [orcaVerifiedPatient, setOrcaVerifiedPatient] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const manufacturer = getManufacturer(orderDetails);
  const formikRef = React.useRef();
  const [isPatientVerified, setPatientVerified] = React.useState(false);
  const [originallyVerified, setOriginallyVerified] = React.useState(null);

  const [isPatientVerifying, setIsPatientVerifying] = React.useState(false);
  React.useEffect(() => {
    if (orderDetails.id || orcaPatient) {
      const { patient = {} } = orderDetails;
      const patientData = orcaPatient && Object.keys(orcaPatient).length > 0 ? orcaPatient : patient;
      const verifiedPatient = {
        ...patientData.patientInfo
      };

      if (patientData.medicalRecordNumber) {
        verifiedPatient.medicalRecordNumber = patientData.medicalRecordNumber;
      }

      if (patientData.patientIdentifier) {
        verifiedPatient.patientId = patientData.patientIdentifier;
      }

      if (patientData.manufacturerOrderId) {
        verifiedPatient.manufacturerOrderId = patientData.manufacturerOrderId;
      }

      setOrcaVerifiedPatient(verifiedPatient);
      setOriginallyVerified(verifiedPatient);
      setPatientVerified(['firstName', 'lastName', 'dateOfBirth'].every((key) => Boolean(verifiedPatient?.[key])));

      setInitialValues({
        patient: { ...patientData }
      });
    }
  }, [orderDetails]);

  React.useEffect(() => {
    if (formikRef.current) {
      const setFieldValue = formikRef.current?.setFieldValue;

      if (orcaVerifiedPatient) {
        formikRef.current?.setTouched({});
        formikRef.current?.setErrors({});

        setFieldValue('patient.medicalRecordNumber', removeFieldPrefixSuffix(orcaVerifiedPatient.medicalRecordNumber, 'medicalRecordNumber', orderDetails));
        setFieldValue('patient.patientIdentifier', removeFieldPrefixSuffix(orcaVerifiedPatient.patientId, 'patientIdentifier', orderDetails));
        setFieldValue('patient.manufacturerOrderId', orcaVerifiedPatient.manufacturerOrderId || '');
        setFieldValue('patient.patientInfo.firstName', orcaVerifiedPatient.firstName);
        setFieldValue('patient.patientInfo.middleName', orcaVerifiedPatient.middleName);
        setFieldValue('patient.patientInfo.lastName', orcaVerifiedPatient.lastName);
        setFieldValue('patient.patientInfo.gender', orcaVerifiedPatient.gender);
        setFieldValue('patient.patientInfo.dateOfBirth', orcaVerifiedPatient.dateOfBirth);
      } else {
        clearPatientDetails();
      }
      setIsDirty(!CommonUtils.deepEqual(originallyVerified, orcaVerifiedPatient));
    }
  }, [orcaVerifiedPatient]);

  const _setOrcaVerifiedPatient = (orcaVerifiedPatient) => {
    const setFieldValue = formikRef.current?.setFieldValue;

    if (orcaVerifiedPatient) {
      formikRef.current?.setTouched({});
      formikRef.current?.setErrors({});
      setPatientVerified(true);
      setFieldValue('patient.medicalRecordNumber', removeFieldPrefixSuffix(orcaVerifiedPatient.medicalRecordNumber, 'medicalRecordNumber', orderDetails));
      setFieldValue('patient.patientIdentifier', removeFieldPrefixSuffix(orcaVerifiedPatient.patientId, 'patientIdentifier', orderDetails));
      setFieldValue('patient.manufacturerOrderId', orcaVerifiedPatient.manufacturerOrderId || '');
      setFieldValue('patient.patientInfo.firstName', orcaVerifiedPatient.firstName);
      setFieldValue('patient.patientInfo.middleName', orcaVerifiedPatient.middleName);
      setFieldValue('patient.patientInfo.lastName', orcaVerifiedPatient.lastName);
      setFieldValue('patient.patientInfo.gender', orcaVerifiedPatient.gender);
      setFieldValue('patient.patientInfo.dateOfBirth', orcaVerifiedPatient.dateOfBirth);
    } else {
      setPatientVerified(false);
      setFieldValue('patient.patientInfo.firstName', '');
      setFieldValue('patient.patientInfo.middleName', '');
      setFieldValue('patient.patientInfo.lastName', '');
      setFieldValue('patient.patientInfo.gender', '');
      setFieldValue('patient.patientInfo.dateOfBirth', '');
    }
  };

  const getDisplayNameByFieldName = (fieldName) => {
    const materialConfig = orderDetails.therapyConfig?.config?.fields;
    return materialConfig?.find((field) => field.fieldName === fieldName)?.properties?.displayName || '';
  };

  const formatFieldWithPrefixSuffix = (value, fieldName) => {
    if (!value) return '';
    const config =
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    const regexFormat = config?.find((f) => f.fieldName === fieldName)?.properties?.fieldFormat?.validationFormat;
    const prefix = regexFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = regexFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

    let formattedValue = value;

    if (prefix && !formattedValue.startsWith(prefix)) {
      formattedValue = `${prefix}${formattedValue}`;
    }

    if (suffix && !formattedValue.endsWith(suffix)) {
      formattedValue = `${formattedValue}${suffix}`;
    }

    return formattedValue;
  };
  const validateOnBlur = (e) => {
    const { id } = e.target;
    formikRef.current?.setFieldTouched(id, true);
    if (getIn(formikRef.current?.errors, id)) {
      setAlert(null);
      clearPatientDetails();
      return;
    }
    const patientId = formatFieldWithPrefixSuffix(formikRef.current?.values?.patient?.patientIdentifier, 'patientIdentifier');
    const medicalRecordNumber = formatFieldWithPrefixSuffix(formikRef.current?.values?.patient?.medicalRecordNumber, 'medicalRecordNumber');
    if (id.includes('patientIdentifier')) validateOrcaDetails(patientId, null);
    else if (id.includes('medicalRecordNumber')) validateOrcaDetails(null, medicalRecordNumber);
  };

  const clearPatientDetails = (lastUpdatedField) => {
    const setFieldValue = formikRef.current?.setFieldValue;
    setOrcaVerifiedPatient(null);
    setPatientVerified(false);
    let newPatientIdentifier = formikRef.current?.values?.patient?.patientIdentifier,
      newMedicalRecordNumber = formikRef.current?.values?.patient?.medicalRecordNumber;
    if (isPatientVerified && lastUpdatedField === 'patientIdentifier') {
      newMedicalRecordNumber = '';
    }
    if (isPatientVerified && lastUpdatedField === 'medicalRecordNumber') {
      newPatientIdentifier = '';
    }
    setFieldValue('patient.medicalRecordNumber', removeFieldPrefixSuffix(newMedicalRecordNumber, 'medicalRecordNumber', orderDetails));
    setFieldValue('patient.patientIdentifier', removeFieldPrefixSuffix(newPatientIdentifier, 'patientIdentifier', orderDetails));
    setFieldValue('patient.manufacturerOrderId', '');
    setFieldValue('patient.patientInfo.firstName', '');
    setFieldValue('patient.patientInfo.middleName', '');
    setFieldValue('patient.patientInfo.lastName', '');
    setFieldValue('patient.patientInfo.gender', '');
    setFieldValue('patient.patientInfo.dateOfBirth', null);
  };

  const validateOrcaDetails = (patientId, medicalRecordNumber) => {
    const payload = {};
    if (patientId) payload.patientId = patientId;
    else if (medicalRecordNumber) payload.medicalRecordNumber = medicalRecordNumber;

    if (CommonUtils.isNonEmptyObject(payload)) {
      setOrcaVerifiedPatient(null);
      setIsPatientVerifying(true);
      OrderService.verifyOrcaDetails(payload)
        .then((response) => {
          if (response && Array.isArray(response) && response.length > 0) {
            setOrcaPatientList([...response]);
            setIsOrcaValidationPanelOpen(true);
          }
        })
        .catch((error) => {
          clearPatientDetails(patientId ? 'patientIdentifier' : 'medicalRecordNumber');
          setPatientVerified(false);
          setAlert({
            type: 'warning',
            description: translateFn('message.orcaPatientVerificationFailed1', {
              patientId: getDisplayNameByFieldName('patientIdentifier'),
              medicalRecordNumber: getDisplayNameByFieldName('medicalRecordNumber')
            })
          });
        })
        .finally(() => {
          setIsPatientVerifying(false);
        });
    } else {
      setAlert(null);
      clearPatientDetails();
    }
  };

  const handleOnBack = () => {
    navigate(`../summary${location.search}`);
  };

  const handleOnSave = (values) => {
    const config =
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    const updatedValue = updatePatientValues(values, config || []);
    const { patient } = updatedValue;
    if (!patient) return;

    setValue('orcaPatient', patient);
    setValue('isVerified', true);
    navigate(-1, {
      state: {
        alert: {
          description: 'Patient details updated successfully',
          type: 'success'
        }
      }
    });
  };

  const spTherapyConfig = {
    isCoiIdRequired: false,
    isPatientIdentifierRequired: false,
    isMRNRequired: false,
    ...(orderDetails?.spTherapyConfig || {})
  };
  const isCSUserReviewingOrca =
    isCustomerCentreUser && [ORDER_STATUS.CS_REVIEW, ORDER_STATUS.SUBMITTED].includes(orderDetails.status) && manufacturer === MANUFACTURER.ORCA;

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <div className="stack">
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
              {translateFn('captions.btnBackToSummary')}
            </Button>
          </div>
          <PageHeader heading="Edit Patient Details" />
        </div>
      </div>
      <div className="MCP-module-body">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="">
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(
              translateFn,
              orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA,
              spTherapyConfig,
              therapyConfig,
              manufacturer,
              isCSUserReviewingOrca
            )}
            onSubmit={handleOnSave}
            enableReinitialize
            innerRef={formikRef}>
            {({ values, errors, touched, dirty }) => {
              React.useEffect(() => {
                setIsDirty(dirty);
              }, [dirty]);
              console.log(values, errors, touched);
              return (
                <Form>
                  <div className="stack">
                    <div className="MCP-panel-container">
                      <p className="section-title">Patient Details</p>
                      <FormRenderer
                        sections={PatientSections({
                          channelType,
                          therapyConfig,
                          validateOnBlur,
                          manufacturer,
                          isPatientVerifying,
                          isPatientVerified: isPatientVerified,
                          isCSUserReviewingOrca
                        })}
                      />
                    </div>
                    <div className="controls">
                      <Button onClick={handleOnBack} variant="secondary" size="md">
                        {translateFn('captions.btnCancel')}
                      </Button>

                      <Button
                        disabled={isCSUserReviewingOrca ? false : !isPatientVerified || !isDirty || isPatientVerifying}
                        variant="primary"
                        isLoadingState={isSaving}
                        Icon={isSaving && ButtonLoadingIcon}
                        iconPosition="left"
                        type="submit"
                        size="md">
                        {translateFn('captions.btnSaveChanges')}
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
          {isOrcaValidationPanelOpen && (
            <OrcaPatientVerificationPanel
              patientId={formikRef.current?.values?.patientIdentifier}
              medicalRecordNumber={formikRef.current?.values?.patientIdentifier}
              patientList={orcaPatientList}
              setVerifiedPatient={_setOrcaVerifiedPatient}
              orderDetails={orderDetails}
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
