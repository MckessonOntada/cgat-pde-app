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
import { Form, Formik, useFormikContext } from 'formik';
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
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';

const FormStateTracker = ({ setFormValues, setIsDirty }) => {
  const formik = useFormikContext();

  const [hasBeenDirty, setHasBeenDirty] = React.useState(false);

  React.useEffect(() => {
    if (formik) {
      setFormValues(formik.values);

      if (formik.dirty && !hasBeenDirty) {
        setIsDirty(true);

        setHasBeenDirty(true);
      }
    }
  }, [formik?.values, formik?.dirty]);

  return null;
};
function Payer() {
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const { controlRef } = useContext(FooterContext);
  const [flag, setFlag] = React.useState(false);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { state: locationState = {} } = useLocation();
  const { orderId } = useParams();
  const [isDirty, setIsDirty] = React.useState(false);
  const { isEdit = false, isApprover = false } = locationState || {};
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails, isLoader } = useOrder(orderId);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
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

  const validationSchema = React.useMemo(() => {
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

    return Yup.object().shape(schemaShape);
  }, [isSecondaryMedicalInsuranceOpen, isSecondaryPharmacyInsuranceOpen]);

  const handleOnBack = () => {
    const prevSearch = locationState?.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  const handleOnBackButtonClick = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'patient');
      return;
    }

    if (isEdit) {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          isEdit: true,
          isApprover: isApprover
        }
      });
    } else {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}${locationState.__prevSearch}`);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    } else if (modalSuccessCallback === 'patient') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
        }
      });
    }
  };

  const handleOnSubmit = (values) => {
    if (values.primaryMedicalInsurance?.relationshipToPatient !== 'OTHER') values.primaryMedicalInsurance.relation = '';
    if (values.secondaryMedicalInsurance?.relationshipToPatient !== 'OTHER') values.secondaryMedicalInsurance.relation = '';

    OrderService.savePayerDetails(orderId, values).then((response) => {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/additional-details`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
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
      <Formik
        key={`payer-details-${isSecondaryMedicalInsuranceOpen ? 'secondary-medical-insurance' : ''}-${
          isSecondaryPharmacyInsuranceOpen ? 'secondary-pharmacy-insurance' : ''
        }`}
        initialValues={formValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onError={console.log}
        onSubmit={handleOnSubmit}>
        {({ setFieldValue }) => (
          <Form>
            <FormStateTracker setFormValues={setFormValues} setIsDirty={setIsDirty} />
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
                  <Button size="md" variant="secondary" onClick={handleOnBackButtonClick}>
                    {t('captions.btnBack')}
                  </Button>
                  <Button size="md" variant="primary" type="submit">
                    {t('captions.btnSaveAndContinue')}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <DiscardChangesModal
        heading={t('messages.confirmation.discardheader')}
        description={t('messages.confirmation.addition')}
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
}

export default Payer;
