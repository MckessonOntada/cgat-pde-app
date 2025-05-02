import React from 'react';
import FormRenderer from '@src/mfe/core-config/manage-providers/forms/FormRenderer';
import {
  insuranceCompanySections,
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import {
  INITIAL_VALIDATION_SCHEMA,
  INSURANCE_COMPANY_VALIDATION_SCHEMA,
  SECONDARY_PAYER_VALIDATION_SCHEMA
} from './forms/validation.schema';
import CommonUtils from '@src/util/CommonUtils';

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

const PayerDetails = () => {
  const { t } = useTranslate();
  const [formValues, setFormValues] = React.useState(INITIAL_VALUES);
  const [validationSchema, setValidationSchema] = React.useState(
    INITIAL_VALIDATION_SCHEMA(t)
  );
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
      OrderService.savePayerDetails(orderId, payload, orderDetails.channelType),
    onSuccess: (response) => {
      navigate(`/orders/${orderId}/additional-details`);
    },
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
    let schema = INITIAL_VALIDATION_SCHEMA(t);

    if (showSecondaryPayer) {
      schema = schema.concat(SECONDARY_PAYER_VALIDATION_SCHEMA(t));
    }
    if (showDrugBenefitInsurer) {
      schema = schema.concat(INSURANCE_COMPANY_VALIDATION_SCHEMA(t));
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
        patientSubscriberRelationship:
          formValues['patient-relationship']?.toUpperCase(),
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
    const finePayload = CommonUtils.cleanObject(payload);
    savePayerDetails(finePayload);
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
