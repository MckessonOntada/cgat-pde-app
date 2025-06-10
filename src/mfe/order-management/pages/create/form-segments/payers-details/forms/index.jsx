import PageHeader from '@src/components/pageHeader';
import React, { useContext } from 'react';
import OrderStepper from '../../OrderStepper';
import OrderHeaderDetails from '../../OrderHeaderDetails';
import { Button, IconButton } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderPrice } from '../../additional-details/useOrderPrice';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { getMedicalInsuranceUiTemplate, getPharmacyInsuranceUiTemplate, PATIENT_RELATIONSHIP } from './payer-details.config';
import { Form, Formik } from 'formik';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-circle-bold.svg';
import * as Yup from 'yup';
import { FooterContext } from '@src/components/footer/FooterContext';
const ALPHABETIC_ONLY = /^[A-Za-z\s'-]+$/;
const NUMERIC_ONLY = /^\d+$/;
const ALPHANUMERIC_ONLY = /^[A-Za-z0-9]+$/;
const RX_SYMBOLS_ALLOWED = /^[A-Za-z&\s-]+$/;

const getMedicalInsuranceSchema = (key) => ({
  [key]: Yup.object().shape({
    insuranceCompany: Yup.string()
      .required('Please enter the Insurance Company name.')
      .max(100, 'Insurance Company name must not exceed 100 characters.')
      .matches(/^[A-Za-z\s'-]+$/, 'Avoid using special characters or numbers.'),
    memberNumber: Yup.string()
      .required('Please enter the Member Number.')
      .max(50, 'Member Number should not exceed 50 digits.')
      .matches(NUMERIC_ONLY, 'Only numeric values are allowed. No spaces or special characters are permitted.'),
    groupNumber: Yup.string()
      .notRequired()
      .max(50, 'Group Number should not exceed 50 digits.')
      .matches(NUMERIC_ONLY, { message: 'Only numeric values are allowed. No letters or special characters are allowed.', excludeEmptyString: true }),
    phoneNumber: Yup.string()
      .required('Please enter the Insurance Company phone number.')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits. Only numeric values are allowed. No country codes, letters, or special characters.'),
    policyHolderFirstName: Yup.string()
      .required("Please enter the Policy Holder's First Name.")
      .max(50, 'First Name should not exceed 50 characters.')
      .matches(ALPHABETIC_ONLY, 'Only alphabetic characters are allowed.'),
    policyHolderLastName: Yup.string()
      .required("Please enter the Policy Holder's Last Name.")
      .max(50, 'Last Name should not exceed 50 characters.')
      .matches(ALPHABETIC_ONLY, 'Only alphabetic characters are allowed.'),
    dob: Yup.date().required('Date of Birth is required.').max(new Date(), 'Date of Birth cannot be in the future.'),
    relationshipToPatient: Yup.string()
      .required('Please select the relationship to the patient.')
      .oneOf(PATIENT_RELATIONSHIP, 'Invalid selection. Please choose a valid relationship.'),
    insuranceCard: Yup.object().shape({
      front: Yup.mixed().nullable(),
      back: Yup.mixed().nullable()
    })
  })
});

const getPharmacyInsuranceSchema = (key) => ({
  [key]: Yup.object().shape({
    pharmacyBenefitManagerName: Yup.string()
      .required('Please enter the Pharmacy Benefit Manager name.')
      .max(100, 'Name must not exceed 100 characters.')
      .matches(RX_SYMBOLS_ALLOWED, 'Only alphabetic characters and valid symbols (e.g., & or -) are allowed.'),
    rxGroupNumber: Yup.string()
      .notRequired()
      .max(50, 'RX Group Number should not exceed 50 digits.')
      .matches(NUMERIC_ONLY, { message: 'Only numeric values are allowed. No letters or special characters are permitted.', excludeEmptyString: true }),
    rxMemberId: Yup.string()
      .required('Please enter the RX Member ID.')
      .max(20, 'RX Member ID must not exceed 20 characters.')
      .matches(ALPHANUMERIC_ONLY, 'Only alphanumeric characters are allowed. No spaces or special characters are allowed.'),
    rxPcn: Yup.string()
      .required('Please enter the RX PCN.')
      .max(100, 'RX PCN must not exceed 100 characters.')
      .matches(ALPHANUMERIC_ONLY, 'Alphanumeric characters only. Special characters are not allowed.'),
    rxBin: Yup.string()
      .required('Please enter the RX BIN.')
      .max(30, 'RX BIN must not exceed 30 characters.')
      .matches(ALPHANUMERIC_ONLY, 'Only alphanumeric characters are allowed. No spaces or special characters.'),
    insuranceCard: Yup.object().shape({
      front: Yup.mixed().nullable(),
      back: Yup.mixed().nullable()
    })
  })
});

const getBaseMedicalInsuranceValues = () => ({
  insuranceCompany: '',
  memberNumber: '',
  groupNumber: '',
  phoneNumber: '',
  policyHolderFirstName: '',
  policyHolderLastName: '',
  dob: '',
  relationshipToPatient: '',
  cardFrontImage: null,
  cardBackImage: null
});

const getBasePharmacyInsuranceValues = () => ({
  pharmacyBenefitManagerName: '',
  rxGroupNumber: '',
  rxMemberId: '',
  rxPcn: '',
  rxBin: '',
  rxCardFrontImage: null,
  rxCardBackImage: null
});

const baseValues = {
  primaryMedicalInsurance: getBaseMedicalInsuranceValues(),
  primaryPharmacyInsurance: getBasePharmacyInsuranceValues()
};

function Payer() {
  const [validationSchema, setValidationSchema] = React.useState(null);
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const { controlRef } = useContext(FooterContext);

  const { t } = useTranslate();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isApprover = false } = location.state || {};
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails } = useOrder(orderId);
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const { data: priceDetails } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId
  });

  React.useEffect(() => {
    let schemaShape = {
      ...getMedicalInsuranceSchema('primaryMedicalInsurance'),
      ...getPharmacyInsuranceSchema('primaryPharmacyInsurance')
    };

    if (isSecondaryMedicalInsuranceOpen) {
      schemaShape = {
        ...schemaShape,
        ...getMedicalInsuranceSchema('secondaryMedicalInsurance')
      };
    }

    if (isSecondaryPharmacyInsuranceOpen) {
      schemaShape = {
        ...schemaShape,
        ...getPharmacyInsuranceSchema('secondaryPharmacyInsurance')
      };
    }

    setValidationSchema(Yup.object().shape(schemaShape));
  }, [isSecondaryMedicalInsuranceOpen, isSecondaryPharmacyInsuranceOpen]);

  React.useEffect(() => {
    let newValues = { ...formValues };
    if (isSecondaryMedicalInsuranceOpen) {
      newValues.secondaryMedicalInsurance = getBaseMedicalInsuranceValues();
    }
    if (isSecondaryPharmacyInsuranceOpen) {
      newValues.secondaryPharmacyInsurance = getBasePharmacyInsuranceValues();
    }

    setFormValues({ ...newValues });
  }, [isSecondaryMedicalInsuranceOpen, isSecondaryPharmacyInsuranceOpen]);

  console.log(formValues);

  const handleOnBackToOrders = () =>
    navigate(`/orders?${searchParams.toString()}`, {
      state: {
        activeTab: location?.state?.fromTab,
        fromOrderView: location?.state?.fromOrderView
      }
    });

  const handleOnBackClick = () => {};

  const handleOnSubmit = (values) => {
    console.log('Submitted values:', values);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />
      <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} channelType={orderDetails?.channelType} />
      <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />
      <Formik initialValues={formValues} validationSchema={validationSchema} enableReinitialize={true} onError={console.log} onSubmit={handleOnSubmit}>
        <Form>
          <div className="MCP-CardContainer">
            <FormRenderer sections={getMedicalInsuranceUiTemplate('primaryMedicalInsurance', 'Primary Medical Insurance')} />
            <hr className="form-section-separator" />
            <FormRenderer sections={getPharmacyInsuranceUiTemplate('primaryPharmacyInsurance', 'Primary Medical Insurance')} />
            <hr className="form-section-separator" />
            <div>
              {!isSecondaryMedicalInsuranceOpen ? (
                <IconButton
                  className="icon-button"
                  variant="tertiary"
                  label={t('button.caption.addSecondaryMedicalInsurance')}
                  size="lg"
                  iconButton={false}
                  textButton={true}
                  Icon={AddIcon}
                  onClick={() => setIsSecondaryMedicalInsuranceOpen(!isSecondaryMedicalInsuranceOpen)}
                />
              ) : (
                <FormRenderer sections={getMedicalInsuranceUiTemplate('secondaryMedicalInsurance', 'Secondary Medical Insurance')} />
              )}
            </div>
            <hr className="form-section-separator" />
            <div>
              {!isSecondaryPharmacyInsuranceOpen ? (
                <IconButton
                  variant="tertiary"
                  label={t('button.caption.addSecondaryPharmacyInsurance')}
                  size="lg"
                  iconButton={false}
                  textButton={true}
                  Icon={AddIcon}
                  onClick={() => setIsSecondaryPharmacyInsuranceOpen(!isSecondaryPharmacyInsuranceOpen)}
                />
              ) : (
                <FormRenderer sections={getPharmacyInsuranceUiTemplate('secondaryPharmacyInsurance', 'Secondary Pharmacy Insurance')} />
              )}
            </div>
          </div>
          <div className="footer-wrapper" ref={controlRef}>
            <div className="controls footer-controls">
              <Button size="md" variant="secondary" onClick={handleOnBackClick}>
                {t('captions.btnBack')}
              </Button>
              <Button size="md" variant="primary" type="submit">
                {t('captions.btnSaveAndContinue')}
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Payer;
