import React from 'react';
import FormRenderer from '@src/mfe/core-config/manage-providers/forms/FormRenderer';
import {
  payerPersonalDetailsTemplate,
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
import * as Yup from 'yup';

import {
  getInsuranceCoverageDetailsTemplate,
  getPersonalDetailsTemplate,
  insuranceCompanySchema,
  insuranceCoverageSchema
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

const PayerDetails = () => {
  const { t } = useTranslate();
  const [formValues, setFormValues] = React.useState(() => {
    return {
      primaryInsuranceCompany: getPersonalDetailsTemplate(),
      primaryInsuranceCoverage: getInsuranceCoverageDetailsTemplate()
    };
  });
  const [validationSchema, setValidationSchema] = React.useState(() => {
    return Yup.object({
      primaryInsuranceCompany: insuranceCompanySchema(t),
      primaryInsuranceCoverage: insuranceCoverageSchema(t)
    });
  });
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
    const newValues = {};
    const schemaShape = {
      primaryInsuranceCompany: insuranceCompanySchema(t),
      primaryInsuranceCoverage: insuranceCoverageSchema(t),
      secondaryInsuranceCompany: undefined,
      drugBenefitInsuranceCompany: undefined
    };

    if (showSecondaryPayer) {
      schemaShape.secondaryInsuranceCompany = insuranceCompanySchema(t);
      if (!formValues.secondaryInsuranceCompany) {
        newValues.secondaryInsuranceCompany = getPersonalDetailsTemplate();
      }
    } else {
      formValues.secondaryInsuranceCompany = undefined;
    }
    if (showDrugBenefitInsurer) {
      schemaShape.drugBenefitInsuranceCompany = insuranceCompanySchema(t);
      if (!formValues.drugBenefitInsuranceCompany) {
        newValues.drugBenefitInsuranceCompany = getPersonalDetailsTemplate();
      }
    } else {
      formValues.drugBenefitInsuranceCompany = undefined;
    }
    setFormValues({ ...newValues, ...formValues });
    setValidationSchema(Yup.object(schemaShape));
  }, [showSecondaryPayer, showDrugBenefitInsurer]);

  React.useEffect(() => {
    const { secondaryInsuranceCompany, drugBenefitInsuranceCompany } =
      orderDetails.payerDetails || {};
    if (secondaryInsuranceCompany) {
      setShowSecondaryPayer(true);
    }
    if (drugBenefitInsuranceCompany) {
      setShowDrugBenefitInsurer(true);
    }

    if (orderDetails.payerDetails) {
      setFormValues({ ...orderDetails.payerDetails });
    }
  }, [orderDetails]);

  const handleOnAddDrugBenefitInsuranceCompany = (state) => {
    setShowDrugBenefitInsurer(state);
  };

  const secondaryPayerSection = React.useMemo(() => {
    if (!showSecondaryPayer) return null;
    const filteredSections = [
      {
        rows: payerPersonalDetailsTemplate('secondaryInsuranceCompany'),
        title: null,
        subTitle: 'Secondary Payer Details',
        isRequired: false
      }
    ];

    return filteredSections;
  }, [showSecondaryPayer]);

  const insuranceCompanySectionsWithActions = () => {
    if (!showDrugBenefitInsurer) return null;
    const filteredSection = [
      {
        rows: payerPersonalDetailsTemplate('drugBenefitInsuranceCompany'),
        subTitle: 'Drug Benefit Insurance Company',
        secondaryActions: (
          <div className="styled-icon-button">
            <Button
              Icon={BinRedIcon}
              size="md"
              class="IonButton-module"
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
  };

  const handleOnSubmit = (formValues) => {
    savePayerDetails(CommonUtils.cleanObject(formValues));
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
        {({ values, errors }) => {
          React.useEffect(() => {
            console.log(values, errors);
          }, [values]);
          return (
            <Form>
              <div className="MCP-module-body">
                <div className="MCP-CardContainer">
                  <FormRenderer sections={sections} />
                  <hr />
                  <div>
                    {showSecondaryPayer ? (
                      <FormRenderer sections={secondaryPayerSection} />
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
                        sections={insuranceCompanySectionsWithActions() || []}
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
