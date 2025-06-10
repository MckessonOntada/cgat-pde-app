import PageHeader from '@src/components/pageHeader';
import React, { useContext } from 'react';
import OrderStepper from '../../OrderStepper';
import OrderHeaderDetails from '../../OrderHeaderDetails';
import { Button, IconButton, Alert, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderPrice } from '../../additional-details/useOrderPrice';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { getMedicalInsuranceUiTemplate, getPharmacyInsuranceUiTemplate, PATIENT_RELATIONSHIP } from './payer-details.config';
import { Form, Formik } from 'formik';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-circle-bold.svg';
import { FooterContext } from '@src/components/footer/FooterContext';
import * as Yup from 'yup';
import {
  baseValues,
  getBaseMedicalInsuranceValues,
  getBasePharmacyInsuranceValues,
  getMedicalInsuranceSchema,
  getPharmacyInsuranceSchema
} from './validation.schema';
import ModuleHeader from '@src/components/module-header';

function Payer() {
  const [validationSchema, setValidationSchema] = React.useState(null);
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const { controlRef } = useContext(FooterContext);

  const { t } = useTranslate();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isApprover = false } = location.state || {};
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails, isLoader } = useOrder(orderId);
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

  if (isLoader) return isLoader;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} channelType={orderDetails?.channelType} />
      <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />
      <Formik initialValues={formValues} validationSchema={validationSchema} enableReinitialize={true} onError={console.log} onSubmit={handleOnSubmit}>
        <Form>
          <div className="MCP-module-body">
            <div className="MCP-CardContainer">
              <ModuleHeader
                heading={
                  <div>
                    <Heading as="h2">{t('labels.payerDetails')}</Heading>
                  </div>
                }
                controls={
                  <p className="form-instruction">
                    <span className="required">*</span> {t('labels.required')}
                  </p>
                }
              />
              <FormRenderer sections={getMedicalInsuranceUiTemplate('primaryMedicalInsurance', 'Primary Medical Insurance')} />
              <hr className="form-section-separator" />
              <FormRenderer sections={getPharmacyInsuranceUiTemplate('primaryPharmacyInsurance', 'Primary Medical Insurance')} />
              <hr className="form-section-separator" />
              <div>
                {!isSecondaryMedicalInsuranceOpen ? (
                  <IconButton
                    variant="tertiary"
                    label={t('button.caption.addSecondaryMedicalInsurance')}
                    size="lg"
                    className="icon-button"
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
                    className="icon-button"
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
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Payer;
