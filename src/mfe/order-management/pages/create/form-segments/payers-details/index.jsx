import PageHeader from '@src/components/pageHeader';
import React, { useContext } from 'react';
import OrderStepper from '../OrderStepper';
import OrderHeaderDetails from '../OrderHeaderDetails';
import { Button, IconButton, Alert, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOrderPrice } from '../additional-details/useOrderPrice';
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
import OrderService from '@src/api/commonService/OrderService';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';

function Payer() {
  const [validationSchema, setValidationSchema] = React.useState(null);
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const { controlRef } = useContext(FooterContext);
  const [flag, setFlag] = React.useState(false);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { orderId } = useParams();
  const [isDirty, setIsDirty] = React.useState(false);
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
    if (flag) {
      setFlag(false);
      return;
    }
    let newValues = { ...formValues };

    if (isSecondaryPharmacyInsuranceOpen) {
      newValues.secondaryPharmacyInsurance = getBasePharmacyInsuranceValues();
    }

    setFormValues({ ...newValues });
  }, [isSecondaryPharmacyInsuranceOpen]);

  React.useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }
    let newValues = { ...formValues };
    if (isSecondaryMedicalInsuranceOpen) {
      newValues.secondaryMedicalInsurance = getBaseMedicalInsuranceValues();
    }

    setFormValues({ ...newValues });
  }, [isSecondaryMedicalInsuranceOpen]);

  React.useEffect(() => {
    if (orderDetails.payerDetails) {
      const { secondaryMedicalInsurance, secondaryPharmacyInsurance } = orderDetails.payerDetails;
      if (secondaryMedicalInsurance) setIsSecondaryMedicalInsuranceOpen(true);
      if (secondaryPharmacyInsurance) setIsSecondaryPharmacyInsuranceOpen(true);
      setFormValues(orderDetails.payerDetails);
      setFlag(true);
    }
  }, [orderDetails]);

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

  const handleOnBack = () =>
    navigate(`/orders?${searchParams.toString()}`, {
      state: {
        activeTab: location?.state?.fromTab,
        fromOrderView: location?.state?.fromOrderView
      }
    });

  const handleOnCancel = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'account');
      return;
    }

    if (isEdit) {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: true,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else {
      navigate(`../${orderId}/accounts?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    }
  };

  const handleOnSubmit = (values) => {
    console.log('Submitted values:', values);

    OrderService.savePayerDetails(orderId, values).then((response) => {
      navigate(`../${orderId}/additional-details?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: false,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    });
  };

  const handleOnUpload = (config) => (file, setFieldValue, key) => {
    const side = key.endsWith('Front') ? 'FRONT' : 'BACK';
    const { insurance, insuranceLevel } = config;
    const payload = {
      file,
      side,
      insurance,
      insuranceLevel
    };
    OrderService.uploadPayerDocument(orderId, payload).then((response) => {
      setFieldValue(key, response);
    });
  };
  console.log(orderDetails.payerDetails, formValues);
  const handleOnClosePanel = (key, setFieldValue) => {
    setFieldValue(key, null);
    if (key === 'secondaryMedicalInsurance') {
      setIsSecondaryMedicalInsuranceOpen(false);
    } else {
      setIsSecondaryPharmacyInsuranceOpen(false);
    }
  };

  if (isLoader) return isLoader;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>
      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <OrderStepper status={orderDetails?.currentStage} patientDetailsRequired={orderDetails?.patientDetailsRequired} channelType={orderDetails?.channelType} />
      <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />
      <Formik initialValues={formValues} validationSchema={validationSchema} enableReinitialize={true} onError={console.log} onSubmit={handleOnSubmit}>
        {({ dirty, setFieldValue }) => {
          React.useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);
          return (
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
                  <FormRenderer
                    onUpload={handleOnUpload({
                      insurance: 'MEDICAL',
                      insuranceLevel: 'PRIMARY'
                    })}
                    sections={getMedicalInsuranceUiTemplate('primaryMedicalInsurance', 'Primary Medical Insurance')}
                  />
                  <hr className="form-section-separator" />
                  <FormRenderer
                    onUpload={handleOnUpload({
                      insurance: 'PHARMACY',
                      insuranceLevel: 'PRIMARY'
                    })}
                    sections={getPharmacyInsuranceUiTemplate('primaryPharmacyInsurance', 'Primary Pharmacy Insurance')}
                  />
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
                        onClick={() => setIsSecondaryMedicalInsuranceOpen(true)}
                      />
                    ) : (
                      <FormRenderer
                        onClose={() => handleOnClosePanel('secondaryMedicalInsurance', setFieldValue)}
                        closeIcon={BinRedIcon}
                        onUpload={handleOnUpload({
                          insurance: 'MEDICAL',
                          insuranceLevel: 'SECONDARY'
                        })}
                        sections={getMedicalInsuranceUiTemplate('secondaryMedicalInsurance', 'Secondary Medical Insurance')}
                      />
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
                        onClick={() => setIsSecondaryPharmacyInsuranceOpen(true)}
                      />
                    ) : (
                      <FormRenderer
                        onClose={() => handleOnClosePanel('secondaryPharmacyInsurance', setFieldValue)}
                        closeIcon={BinRedIcon}
                        onUpload={handleOnUpload({
                          insurance: 'PHARMACY',
                          insuranceLevel: 'SECONDARY'
                        })}
                        sections={getPharmacyInsuranceUiTemplate('secondaryPharmacyInsurance', 'Secondary Pharmacy Insurance')}
                      />
                    )}
                  </div>
                </div>
                <div className="footer-wrapper" ref={controlRef}>
                  <div className="controls footer-controls">
                    <Button size="md" variant="secondary" onClick={handleOnCancel}>
                      {t('captions.btnBack')}
                    </Button>
                    <Button size="md" variant="primary" type="submit">
                      {t('captions.btnSaveAndContinue')}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default Payer;
