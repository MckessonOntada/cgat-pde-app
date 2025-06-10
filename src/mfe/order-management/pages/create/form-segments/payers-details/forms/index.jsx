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

const getMedicalInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    insuranceCompany: Yup.string()
      .required(t('messages.enterInsuranceCompanyName'))
      .max(100, t('messages.insuranceCompanyNameCharLimit'))
      .matches(/^[A-Za-z\s'-]+$/, t('messages.avoidSpecialCharsNumbers')),

    memberNumber: Yup.string().required('messages.memberNumberRequired').max(50, t('messages.memberMax')).matches(NUMERIC_ONLY, t('messages.onlyNumeric')),
    groupNumber: Yup.string()
      .notRequired()
      .max(50, t('messages.groupMax'))
      .matches(NUMERIC_ONLY, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    phoneNumber: Yup.string()
      .required(t('messages.enterPhone'))
      .matches(/^\d{10}$/, t('messages.phoneExact')),
    policyHolderFirstName: Yup.string()
      .required(t('messages.enterFirstName'))
      .max(50, t('messages.firstNameMax'))
      .matches(ALPHABETIC_ONLY, t('messages.onlyAlpha')),
    policyHolderLastName: Yup.string()
      .required(t('messages.enterLastName'))
      .max(50, t('messages.lastNameMax'))
      .matches(ALPHABETIC_ONLY, t('messages.onlyAlpha')),
    dob: Yup.date().required(t('messages.enterDOB')).max(new Date(), t('messages.dobFuture')),
    relationshipToPatient: Yup.string().required(t('messages.selectRelation')).oneOf(PATIENT_RELATIONSHIP, t('messages.invalidRelation')),
    insuranceCard: Yup.object().shape({
      front: Yup.mixed().nullable(),
      back: Yup.mixed().nullable()
    })
  })
});

const getPharmacyInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    pharmacyBenefitManagerName: Yup.string()
      .required(t('messages.enterPBM'))
      .max(100, t('messages.pbmNameMax'))
      .matches(RX_SYMBOLS_ALLOWED, t('messages.alphaSymbols')),
    rxGroupNumber: Yup.string()
      .notRequired()
      .max(50, t('messages.rxGroupMax'))
      .matches(NUMERIC_ONLY, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    rxMemberId: Yup.string().required(t('messages.enterRxID')).max(20, t('messages.rxIdMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
    rxPcn: Yup.string().required(t('messages.enterRxPCN')).max(100, t('messages.rxPcnMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
    rxBin: Yup.string().required(t('messages.enterRxBIN')).max(30, t('messages.rxBinMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
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
      ...getMedicalInsuranceSchema('primaryMedicalInsurance', t),
      ...getPharmacyInsuranceSchema('primaryPharmacyInsurance', t)
    };

    if (isSecondaryMedicalInsuranceOpen) {
      schemaShape = {
        ...schemaShape,
        ...getMedicalInsuranceSchema('secondaryMedicalInsurance', t)
      };
    }

    if (isSecondaryPharmacyInsuranceOpen) {
      schemaShape = {
        ...schemaShape,
        ...getPharmacyInsuranceSchema('secondaryPharmacyInsurance', t)
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
