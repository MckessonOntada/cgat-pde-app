import React from 'react';
import * as Yup from 'yup';
import FormRenderer from '@src/mfe/core-config/manage-providers/forms/FormRenderer';
import {
  insuranceCompanySections,
  PATIENT_RELATIONSHIP,
  PLAN_TYPES,
  sections
} from './forms/payer-details.config';
import { Form, Formik } from 'formik';
import { IconButton, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-circle-bold.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import OrderStepper from '../OrderStepper';
import OrderHeaderDetails from '../OrderHeaderDetails';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import useOrder from '../../../orders/useOrder';
import { useLocation, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';

const initialValues = {
  firstName: '',
  middleName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  zipCode: '',
  city: '',
  state: '',

  insuranceCoverageSubscriber: '',
  policyNumber: '',
  groupNumber: '',
  insurancePlanType: '',
  insuranceEffectiveDate: '',
  insuranceRxPcnNumber: '',
  insuranceGrpPcnNumber: '',
  insuranceRxIdNumber: '',
  insuranceRxBinNumber: '',

  'secondaryPayer-firstName': '',
  'secondaryPayer-middleName': '',
  'secondaryPayer-phoneNumber': '',
  'secondaryPayer-addressLine1': '',
  'secondaryPayer-addressLine2': '',
  'secondaryPayer-zipCode': '',
  'secondaryPayer-city': '',
  'secondaryPayer-state': '',

  'benefit-insurance-company-firstName': '',
  'benefit-insurance-company-middleName': '',
  'benefit-insurance-company-phoneNumber': '',
  'benefit-insurance-company-addressLine1': '',
  'benefit-insurance-company-addressLine2': '',
  'benefit-insurance-company-zipCode': '',
  'benefit-insurance-company-city': '',
  'benefit-insurance-company-state': ''
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  lastName: Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  phoneNumber: Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),

  address1: Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),

  address2: Yup.string()
    .max(100, 'Address 2 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 2 cannot contain special characters like @, #, %, etc.'
    ),

  zip: Yup.string().matches(
    /^\d{5}(-\d{4})?$/,
    'Zip Code should follow US format: 12345 or 12345-6789.'
  ),

  city: Yup.string()
    .max(15, 'City should not exceed 15 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'City should contain alphabets only and cannot include numbers or special characters.'
    ),

  state: Yup.string().nullable().notOneOf([''], 'Please select a valid State'),
  patientRelationship: Yup.string()
    .required("Please select the patient's relationship to the subscriber.")
    .notOneOf([''], 'Please select relationship to the subscriber.')
    .oneOf(PATIENT_RELATIONSHIP, 'Please select a valid relationship.'),
  policyNumber: Yup.string()
    .required('Please enter the Policy Number.')
    .max(30, 'Policy Number should not exceed 30 characters.')
    .matches(
      /^[A-Za-z0-9]+$/,
      'Policy Number should only contain letters and numbers.'
    ),
  groupNumber: Yup.string()
    .max(30, 'Group Number should not exceed 30 characters.')
    .matches(
      /^[A-Za-z0-9]*$/,
      'Group Number should only contain letters and numbers.'
    ),

  planType: Yup.string()
    .nullable()
    .notOneOf([''], 'Please select a valid Plan Type')
    .oneOf(PLAN_TYPES, 'Please select a valid Plan Type'),

  effectiveDate: Yup.date()
    .required('Please enter the Effective Date.')
    .max(new Date(), 'Effective Date cannot be in the future.')
    .typeError('Please select a valid date.'),

  rxPCNNumber: Yup.string()
    .max(30, 'Rx PCN Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx PCN Number must contain numbers only.'),

  rxGRPNumber: Yup.string()
    .max(30, 'Rx GRP Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx GRP Number must contain numbers only.'),

  rxIDNumber: Yup.string()
    .max(30, 'Rx ID Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx ID Number must contain numbers only.'),

  rxBINNumber: Yup.string()
    .max(30, 'Rx BIN Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx BIN Number must contain numbers only.'),

  'secondary-payer-firstName': Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  'secondary-payer-lastName': Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  'secondary-payer-phoneNumber': Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),

  'secondary-payer-address1': Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),

  'secondary-payer-address2': Yup.string()
    .max(100, 'Address 2 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 2 cannot contain special characters like @, #, %, etc.'
    ),

  'secondary-payer-zip': Yup.string().matches(
    /^\d{5}(-\d{4})?$/,
    'Zip Code should follow US format: 12345 or 12345-6789.'
  ),

  'secondary-payer-city': Yup.string()
    .max(15, 'City should not exceed 15 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'City should contain alphabets only and cannot include numbers or special characters.'
    ),

  'secondary-payer-state': Yup.string()
    .nullable()
    .notOneOf([''], 'Please select a valid State'),

  'benefit-insurance-company-firstName': Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  'benefit-insurance-company-lastName': Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),

  'benefit-insurance-company-phoneNumber': Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),

  'benefit-insurance-company-address1': Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),

  'benefit-insurance-company-address2': Yup.string()
    .max(100, 'Address 2 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 2 cannot contain special characters like @, #, %, etc.'
    ),

  'benefit-insurance-company-zip': Yup.string().matches(
    /^\d{5}(-\d{4})?$/,
    'Zip Code should follow US format: 12345 or 12345-6789.'
  ),

  'benefit-insurance-company-city': Yup.string()
    .max(15, 'City should not exceed 15 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'City should contain alphabets only and cannot include numbers or special characters.'
    ),

  'benefit-insurance-company-state': Yup.string()
    .nullable()
    .notOneOf([''], 'Please select a valid State')
});

const PayerDetails = () => {
  const { t } = useTranslate();
  const { orderId } = useParams();
  const location = useLocation();
  const {
    isEdit = false,
    isApprover = false,
    alertState
  } = location.state || {};
  const {
    data: orderDetails = {},
    isFetching: isFetchingOrderDetails,
    isError,
    error,
    isLoader
  } = useOrder(orderId);
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId =
    orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId =
    orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const { data: priceDetails } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId
  });
  const [isSecondaryPayerVisible, setIsSecondaryPayerVisible] =
    React.useState(false);
  const [
    isDrugBenefitInsuranceCompanyVisible,
    setIsDrugBenefitInsuranceCompanyVisible
  ] = React.useState(false);

  const handleOnAddSecondaryPayer = (state) => {
    setIsSecondaryPayerVisible(state);
  };
  const handleOnAddDrugBenefitInsuranceCompany = (state) => {
    setIsDrugBenefitInsuranceCompanyVisible(state);
  };
  const secondaryPayerSection = React.useMemo(() => {
    if (!isSecondaryPayerVisible) return null;
    const filteredSections = [
      {
        ...sections[0],
        title: null,
        subTitle: 'Secondary Payer Details',
        isRequired: false
      }
    ];

    return filteredSections;
  }, [isSecondaryPayerVisible]);

  const insuranceCompanySectionsWithActions = React.useMemo(() => {
    if (!isDrugBenefitInsuranceCompanyVisible) return null;
    const filteredSection = [
      {
        ...insuranceCompanySections[0],
        secondaryActions: (
          <div className="styled-icon-button">
            <Button
              Icon={BinRedIcon}
              size="md"
              variant="tertiary"
              color="error"
              type="button"
              onClick={() =>
                handleOnAddDrugBenefitInsuranceCompany(false)
              }></Button>
          </div>
        )
      }
    ];
    return filteredSection;
  }, [isDrugBenefitInsuranceCompanyVisible]);

  const handleOnBackToOrders = () => {};

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
          channelType={orderDetails?.channelType}
        />
        <OrderHeaderDetails
          orderDetails={orderDetails}
          priceDetails={priceDetails}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          console.log('payer details values', values);
        }}>
        <Form>
          <div className="MCP-module-body">
            <div className="MCP-CardContainer">
              <FormRenderer sections={sections} />
              <hr />
              <div>
                {isSecondaryPayerVisible ? (
                  <FormRenderer
                    sections={secondaryPayerSection}
                    fieldPrefix="secondary-payer-"
                  />
                ) : (
                  <IconButton
                    variant="tertiary"
                    label={t('button.caption.addSecondaryPayer')}
                    size="lg"
                    iconButton={false}
                    textButton={true}
                    Icon={AddIcon}
                    onClick={() => handleOnAddSecondaryPayer(true)}
                  />
                )}
              </div>
              <hr />
              <div>
                {isDrugBenefitInsuranceCompanyVisible ? (
                  <FormRenderer
                    fieldPrefix="benefit-insurance-company-"
                    sections={insuranceCompanySectionsWithActions || []}
                  />
                ) : (
                  <IconButton
                    variant="tertiary"
                    label={t('button.caption.addDrugBenefitInsuranceCompany')}
                    size="lg"
                    iconButton={false}
                    textButton={true}
                    Icon={AddIcon}
                    onClick={() => handleOnAddDrugBenefitInsuranceCompany(true)}
                  />
                )}
              </div>
            </div>
            <div className="controls">
              <Button size="md" variant="secondary" onClick={() => {}}>
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
};

export default PayerDetails;
