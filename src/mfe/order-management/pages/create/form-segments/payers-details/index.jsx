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
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';

function toggleProperties(a, b, flag) {
  if (flag) {
    return { ...a, ...b };
  } else {
    const keysToRemove = new Set(Object.keys(b));
    return Object.fromEntries(
      Object.entries(a).filter(([key]) => !keysToRemove.has(key))
    );
  }
}

const INITIAL_VALUES = {
  'first-name': '',
  'last-name': '',
  'phone-number': '',
  'address-line-1': '',
  'address-line-2': '',
  zip: '',
  city: '',
  state: '',

  'patient-relationship': '',
  'policy-number': '',
  'group-number': '',
  'plan-type': '',
  'effective-date': '',
  'rx-pcn-number': '',
  'rx-grp-number': '',
  'rx-id-number': '',
  'rx-bin-number': ''
};
const SECONDARY_PAYER_INITIAL_VALUES = {
  'secondary-payer-first-name': '',
  'secondary-payer-last-name': '',
  'secondary-payer-phone-number': '',
  'secondary-payer-address-line-1': '',
  'secondary-payer-address-line-2': '',
  'secondary-payer-zip': '',
  'secondary-payer-city': '',
  'secondary-payer-state': ''
};
const INSURANCE_COMPANY_DETAILS = {
  'insurance-company-first-name': '',
  'insurance-company-last-name': '',
  'insurance-company-phone-number': '',
  'insurance-company-address-line-1': '',
  'insurance-company-address-line-2': '',
  'insurance-company-zip': '',
  'insurance-company-city': '',
  'insurance-company-state': ''
};

const INITIAL_VALIDATION_SCHEMA = Yup.object().shape({
  'first-name': Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'last-name': Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'phone-number': Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),
  'address-line-1': Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),
  'address-line-2': Yup.string()
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
  'patient-relationship': Yup.string()
    .required("Please select the patient's relationship to the subscriber.")
    .notOneOf([''], 'Please select relationship to the subscriber.')
    .oneOf(PATIENT_RELATIONSHIP, 'Please select a valid relationship.'),
  'policy-number': Yup.string()
    .required('Please enter the Policy Number.')
    .max(30, 'Policy Number should not exceed 30 characters.')
    .matches(
      /^[A-Za-z0-9]+$/,
      'Policy Number should only contain letters and numbers.'
    ),
  'group-number': Yup.string()
    .max(30, 'Group Number should not exceed 30 characters.')
    .matches(
      /^[A-Za-z0-9]*$/,
      'Group Number should only contain letters and numbers.'
    ),
  'plan-type': Yup.string()
    .nullable()
    .notOneOf([''], 'Please select a valid Plan Type')
    .oneOf(PLAN_TYPES, 'Please select a valid Plan Type'),
  'effective-date': Yup.date()
    .required('Please enter the Effective Date.')
    .max(new Date(), 'Effective Date cannot be in the future.')
    .typeError('Please select a valid date.'),
  'rx-pcn-number': Yup.string()
    .max(30, 'Rx PCN Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx PCN Number must contain numbers only.'),
  'rx-grp-number': Yup.string()
    .max(30, 'Rx GRP Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx GRP Number must contain numbers only.'),
  'rx-id-number': Yup.string()
    .max(30, 'Rx ID Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx ID Number must contain numbers only.'),
  'rx-bin-number': Yup.string()
    .max(30, 'Rx BIN Number should not exceed 30 digits.')
    .matches(/^\d*$/, 'Rx BIN Number must contain numbers only.')
});

const SECONDARY_PAYER_VALIDATION_SCHEMA = Yup.object().shape({
  'secondary-payer-first-name': Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'secondary-payer-last-name': Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'secondary-payer-phone-number': Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),
  'secondary-payer-address-line-1': Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),
  'secondary-payer-address-line-2': Yup.string()
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
    .notOneOf([''], 'Please select a valid State')
});

const INSURANCE_COMPANY_VALIDATION_SCHEMA = Yup.object().shape({
  'insurance-company-first-name': Yup.string()
    .required('Please enter the First Name.')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      'First Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'insurance-company-last-name': Yup.string()
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'Last Name should contain alphabets only and cannot include special characters or numbers.'
    ),
  'insurance-company-phone-number': Yup.string()
    .max(50, 'Phone Number should not exceed 50 characters.')
    .matches(/^\d*$/, 'Phone Number must contain valid digits only.'),
  'insurance-company-address-line-1': Yup.string()
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 1 cannot contain special characters like @, #, %, etc.'
    ),
  'insurance-company-address-line-2': Yup.string()
    .max(100, 'Address 2 should not exceed 100 characters.')
    .matches(
      /^[^@#%]*$/,
      'Address 2 cannot contain special characters like @, #, %, etc.'
    ),
  'insurance-company-zip': Yup.string().matches(
    /^\d{5}(-\d{4})?$/,
    'Zip Code should follow US format: 12345 or 12345-6789.'
  ),
  'insurance-company-city': Yup.string()
    .max(15, 'City should not exceed 15 characters.')
    .matches(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
      'City should contain alphabets only and cannot include numbers or special characters.'
    ),
  'insurance-company-state': Yup.string()
    .nullable()
    .notOneOf([''], 'Please select a valid State')
});

const PayerDetails = () => {
  const [formValues, setFormValues] = React.useState(INITIAL_VALUES);
  const [validationSchema, setValidationSchema] = React.useState(
    INITIAL_VALIDATION_SCHEMA
  );
  const { t } = useTranslate();
  const { orderId } = useParams();
  const location = useLocation();
  const { isApprover = false } = location.state || {};
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails } =
    useOrder(orderId);
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
  const { mutate: savePayerDetails } = useMutation({
    mutationFn: async (payload) =>
      OrderService.savePayerDetails(orderId, payload),
    onSuccess: console.log,
    onError: console.error
  });

  const [showSecondaryPayer, setShowSecondaryPayer] = React.useState(false);
  const [showDrugBenefitInsurer, setShowDrugBenefitInsurer] =
    React.useState(false);

  const handleOnAddSecondaryPayer = (state) => {
    setShowSecondaryPayer(state);
  };
  React.useEffect(() => {
    const newInitialFormValues = toggleProperties(
      formValues,
      SECONDARY_PAYER_INITIAL_VALUES,
      showSecondaryPayer
    );
    setFormValues({ ...newInitialFormValues });
  }, [showSecondaryPayer]);
  React.useEffect(() => {
    const newInitialFormValues = toggleProperties(
      formValues,
      INSURANCE_COMPANY_DETAILS,
      showDrugBenefitInsurer
    );
    setFormValues({ ...newInitialFormValues });
  }, [showDrugBenefitInsurer]);

  React.useEffect(() => {
    let schema = INITIAL_VALIDATION_SCHEMA;

    if (showSecondaryPayer) {
      schema = schema.concat(SECONDARY_PAYER_VALIDATION_SCHEMA);
    }
    if (showDrugBenefitInsurer) {
      schema = schema.concat(INSURANCE_COMPANY_VALIDATION_SCHEMA);
    }

    setValidationSchema(schema);
  }, [showSecondaryPayer, showDrugBenefitInsurer]);

  const handleOnAddDrugBenefitInsuranceCompany = (state) => {
    setShowDrugBenefitInsurer(state);
  };
  const secondaryPayerSection = React.useMemo(() => {
    if (!showSecondaryPayer) return null;
    const filteredSections = [
      {
        ...sections[0],
        title: null,
        subTitle: 'Secondary Payer Details',
        isRequired: false
      }
    ];

    return filteredSections;
  }, [showSecondaryPayer]);

  const insuranceCompanySectionsWithActions = React.useMemo(() => {
    if (!showDrugBenefitInsurer) return null;
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
  }, [showDrugBenefitInsurer]);

  const handleOnSubmit = (formValues) => {
    const payload = {
      primaryInsuranceCompany: {
        name: {
          firstName: formValues['first-name'],
          middleName: '', // Assuming not available in formValues
          lastName: formValues['last-name']
        },
        phone: formValues['phone-number'],
        address: {
          address1: formValues['address-line-1'],
          address2: formValues['address-line-2'],
          zip: formValues['zip'],
          state: formValues['state'],
          city: formValues['city']
        }
      },
      primaryInsuranceCoverage: {
        patientSubscriberRelationship: formValues['patient-relationship'],
        policyNumber: formValues['policy-number'],
        groupNumber: formValues['group-number'],
        planType: formValues['plan-type'],
        effectiveDate: formValues['effective-date'],
        pcnNumber: formValues['rx-pcn-number'],
        grpNumber: formValues['rx-grp-number'],
        idNumber: formValues['rx-id-number'],
        binNumber: formValues['rx-bin-number']
      },
      secondaryInsuranceCompany: {
        name: {
          firstName: formValues['secondary-payer-first-name'],
          middleName: '', // Optional fallback
          lastName: formValues['secondary-payer-last-name']
        },
        phone: formValues['secondary-payer-phone-number'],
        address: {
          address1: formValues['secondary-payer-address-line-1'],
          address2: formValues['secondary-payer-address-line-2'],
          zip: formValues['secondary-payer-zip'],
          state: formValues['secondary-payer-state'],
          city: formValues['secondary-payer-city']
        }
      },
      drugBenefitInsuranceCompany: {
        name: {
          firstName: formValues['insurance-company-first-name'],
          middleName: '',
          lastName: formValues['insurance-company-last-name']
        },
        phone: formValues['insurance-company-phone-number'],
        address: {
          address1: formValues['insurance-company-address-line-1'],
          address2: formValues['insurance-company-address-line-2'],
          zip: formValues['insurance-company-zip'],
          state: formValues['insurance-company-state'],
          city: formValues['insurance-company-city']
        }
      }
    };
    savePayerDetails(payload);
  };

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
        initialValues={formValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onError={console.log}
        onSubmit={handleOnSubmit}>
        {({ values }) => {
          React.useEffect(() => {
            setFormValues(values);
          }, [values]);

          return (
            <Form>
              <div className="MCP-module-body">
                <div className="MCP-CardContainer">
                  <FormRenderer sections={sections} />
                  <hr />
                  <div>
                    {showSecondaryPayer ? (
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
                    {showDrugBenefitInsurer ? (
                      <FormRenderer
                        fieldPrefix="insurance-company-"
                        sections={insuranceCompanySectionsWithActions || []}
                      />
                    ) : (
                      <IconButton
                        variant="tertiary"
                        label={t(
                          'button.caption.addDrugBenefitInsuranceCompany'
                        )}
                        size="lg"
                        iconButton={false}
                        textButton={true}
                        Icon={AddIcon}
                        onClick={() =>
                          handleOnAddDrugBenefitInsuranceCompany(true)
                        }
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
          );
        }}
      </Formik>
    </div>
  );
};

export default PayerDetails;
