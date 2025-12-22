import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { Form, Formik } from 'formik';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHANNEL_TYPE } from '../../Constants';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { PatientSections } from '../../patient-details/forms/patient-details.config';
import OrderService from '@src/api/commonService/OrderService';
import { Alert, Button, Heading, Loader } from '@mckesson/mcp-component-library';
import PageHeader from '@src/components/pageHeader';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { OrcaPatientVerificationPanel } from '../../orca-patient-verification-panel';
import { useMutation } from 'react-query';

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
  const formikRef = React.useRef();

  console.log(orcaVerifiedPatient?.id > 0);

  React.useEffect(() => {
    if (orcaVerifiedPatient) {
      let type, description;
      if (orcaVerifiedPatient.id > 0) {
        setInitialValues({
          ...initialValues,
          patient: {
            ...initialValues.patient,
            medicalRecordNumber: orcaVerifiedPatient.medicalRecordNumber,
            patientIdentifier: orcaVerifiedPatient.patientId,
            patientInfo: {
              firstName: orcaVerifiedPatient.firstName,
              middleName: orcaVerifiedPatient.middleName,
              lastName: orcaVerifiedPatient.lastName,
              gender: orcaVerifiedPatient.gender,
              dateOfBirth: orcaVerifiedPatient.dateOfBirth
            }
          }
        });
        type = 'success';
        description = 'Patient id verified';
      } else {
        type = 'warning';
        if (orcaVerifiedPatient.id === -1)
          description =
            'The Orca Bio Patient ID or MRN and Date of Birth entered is not valid. Please continue entering remaining order details and submit the order. A Customer Support representative will contact you shortly.';
        else if (orcaVerifiedPatient.id === 0)
          description = 'Verification was not successful. Please re-enter the Patient ID or MRN to restart the verification process.';
      }
      setAlert({
        type,
        description
      });
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
    if (medicalRecordNumber) payload.medicalRecordNumber = medicalRecordNumber;
    OrderService.verifyOrcaDetails(payload)
      .then((response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          setOrcaPatientList([...response]);
          setIsOrcaValidationPanelOpen(true);
        }
      })
      .catch((error) => {});
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
          <Formik initialValues={initialValues} onSubmit={handleOnSave} enableReinitialize innerRef={formikRef}>
            <Form>
              <div className="MCP-panel-container">
                <p className="section-title">Patient Details</p>
                <FormRenderer sections={PatientSections(channelType, therapyConfig, validateOnBlur, orcaVerifiedPatient?.id > 0)} />
              </div>
              <div className="controls">
                <Button onClick={handleOnBack} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </Form>
          </Formik>
          {isOrcaValidationPanelOpen && (
            <OrcaPatientVerificationPanel
              patientId={formikRef.current?.values?.patientIdentifier}
              medicalRecordNumber={formikRef.current?.values?.patientIdentifier}
              patientList={orcaPatientList}
              onClose={(patient) => {
                setOrcaVerifiedPatient(patient || { id: 0 });
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
