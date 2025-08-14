import PageHeader from '@src/components/pageHeader';
import React, { useContext } from 'react';
import OrderStepper from '../OrderStepper';
import OrderHeaderDetails from '../OrderHeaderDetails';
import { Button, IconButton, Heading, Loader, RadioGroup } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useOrder from '@src/mfe/order-management/pages/orders/useOrder';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { getMedicalInsuranceUiTemplate, getPharmacyInsuranceUiTemplate, PATIENT_RELATIONSHIP } from './payer-details.config';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { ReactComponent as AddIcon } from '@src/assets/svg/add-circle-bold.svg';
import { FooterContext } from '@src/components/footer/FooterContext';
import * as Yup from 'yup';
import {
  baseValues,
  getBaseMedicalInsuranceValues,
  getBasePharmacyInsuranceValues,
  getInitialValidationSchema,
  getMedicalInsuranceSchema,
  getPharmacyInsuranceSchema
} from './validation.schema';
import ModuleHeader from '@src/components/module-header';
import OrderService from '@src/api/commonService/OrderService';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import Alert from '@src/components/cgat-alert/Alert';
import { CHANNEL_TYPE } from '../Constants';
import Components from '@src/components/form/Components';
import ManufacturerLogo from '../ManufacturerLogo';
import { ORDER_STATUS } from '../../../orders/config';
import Collaborator from '../Collaborator';

function Payer() {
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [isPayerDetailsRequired, setIsPayerDetailsRequired] = React.useState(false);
  const { controlRef } = useContext(FooterContext);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state ?? {};
  const { orderId } = useParams();
  const [isDirty, setIsDirty] = React.useState(false);
  const { isEdit = false, isApprover = false } = locationState || {};
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);
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
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

  React.useEffect(() => {
    const { isPayerDetailsRequired, payerDetails } = orderDetails;
    if (isPayerDetailsRequired === true) {
      const formValues = {
        payerDetailsRequired: 'yes'
      };
      if (payerDetails) {
        const { secondaryMedicalInsurance, secondaryPharmacyInsurance } = orderDetails.payerDetails;
        if (secondaryMedicalInsurance) setIsSecondaryMedicalInsuranceOpen(true);
        if (secondaryPharmacyInsurance) setIsSecondaryPharmacyInsuranceOpen(true);
        formValues.insuranceDetails = { ...orderDetails.payerDetails };
      }
      setFormValues(formValues);
      setIsPayerDetailsRequired('yes');
    } else if (isPayerDetailsRequired === false) {
      const formValues = {
        payerDetailsRequired: 'no'
      };
      setFormValues(formValues);
      setIsPayerDetailsRequired('no');
    }
  }, [orderDetails]);

  const validationSchema = React.useMemo(() => {
    let schemaShape = {
      ...getInitialValidationSchema(t)
    };

    if (isPayerDetailsRequired === 'yes') {
      let insuranceSchemaShape = {
        ...getMedicalInsuranceSchema('primaryMedicalInsurance', t),
        ...getPharmacyInsuranceSchema('primaryPharmacyInsurance', t)
      };
      if (isSecondaryMedicalInsuranceOpen) {
        insuranceSchemaShape = {
          ...insuranceSchemaShape,
          ...getMedicalInsuranceSchema('secondaryMedicalInsurance', t)
        };
      }

      if (isSecondaryPharmacyInsuranceOpen) {
        insuranceSchemaShape = {
          ...insuranceSchemaShape,
          ...getPharmacyInsuranceSchema('secondaryPharmacyInsurance', t)
        };
      }

      if (CommonUtils.isNonEmptyObject(insuranceSchemaShape)) {
        schemaShape.insuranceDetails = Yup.object().required().shape(insuranceSchemaShape);
      }
    }

    return Yup.object().shape(schemaShape);
  }, [isSecondaryMedicalInsuranceOpen, isSecondaryPharmacyInsuranceOpen, isPayerDetailsRequired]);

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
      const prevSearch = locationState.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
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

  const { isLoading: isSaving, mutate: savePayerDetails } = useMutation({
    queryKey: 'save-payer-details',
    mutationFn: ({ isPayerDetailsRequired, insuranceDetails }) => OrderService.savePayerDetails(orderId, isPayerDetailsRequired, insuranceDetails),
    onSuccess: (response) => {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/additional-details`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
        }
      });
    },
    onError: ({ err: error }) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        type: 'error',
        description
      });
    }
  });

  function normalizeInsurance(insurance, isMedical = true) {
    if (!insurance) return null;

    const { relation, relationshipToPatient, medicalCardFront, medicalCardBack, pharmacyCardFront, pharmacyCardBack, ...rest } = insurance;

    const result = {
      ...rest,
      ...(relationshipToPatient === 'OTHER' && { relation }),
      relationshipToPatient
    };

    if (isMedical) {
      result.medicalCardFront = typeof medicalCardFront === 'object' ? medicalCardFront?.url : medicalCardFront;

      result.medicalCardBack = typeof medicalCardBack === 'object' ? medicalCardBack?.url : medicalCardBack;
    } else {
      result.pharmacyCardFront = typeof pharmacyCardFront === 'object' ? pharmacyCardFront?.url : pharmacyCardFront;

      result.pharmacyCardBack = typeof pharmacyCardBack === 'object' ? pharmacyCardBack?.url : pharmacyCardBack;
    }

    return result;
  }

  const handleOnSubmit = (values) => {
    const { payerDetailsRequired, insuranceDetails = null } = values;
    const isPayerDetailsRequired = payerDetailsRequired === 'yes';
    if (isPayerDetailsRequired) {
      [
        ['primaryMedicalInsurance', true],
        ['secondaryMedicalInsurance', true],
        ['primaryPharmacyInsurance', false],
        ['secondaryPharmacyInsurance', false]
      ].forEach(([key, isMedical]) => {
        insuranceDetails[key] = normalizeInsurance(insuranceDetails[key], isMedical);
      });
    }

    savePayerDetails({ isPayerDetailsRequired, insuranceDetails });
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
    OrderService.uploadPayerDocument(orderId, payload)
      .then((response) => {
        const value = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: response
        };
        setFieldValue(key, value);
      })
      .catch((error) => {
        const description = CommonUtils.getUploadErrorMessage(error, t);
        setAlert({
          type: 'error',
          description
        });
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

  return (
    <div className="MCP-module-wrapper">
      {(isSaving || isFetching) && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <ModuleHeader
        heading={
          <PageHeader
            heading={
              isApprover
                ? t('headings.reviewOrder')
                : orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA
                ? t('headings.createNewPrescription')
                : t('headings.createNewOrder')
            }
          />
        }
        controls={
          <div className="controls">
            {orderDetails?.collaborators && <Collaborator collaborators={orderDetails?.collaborators} />}
            {orderDetails?.therapy?.manufacturerName ? <ManufacturerLogo therapyId={orderDetails.therapy?.id} /> : null}
          </div>
        }
      />

      <div className="MCP-module-body">
        <OrderStepper
          status={orderDetails?.currentStage}
          patientDetailsRequired={orderDetails?.patientDetailsRequired}
          channelType={orderDetails?.channelType}
        />
        <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <Formik initialValues={formValues} validationSchema={validationSchema} enableReinitialize={true} onError={console.log} onSubmit={handleOnSubmit}>
          {({ setValues, values, errors, setTouched, setErrors, setFieldValue }) => {
            React.useEffect(() => {
              setIsPayerDetailsRequired(values['payerDetailsRequired']);
            }, [values]);

            React.useEffect(() => {
              setValues((prevValues) => ({
                ...prevValues,
                insuranceDetails:
                  isPayerDetailsRequired === 'yes'
                    ? {
                        primaryMedicalInsurance: getBaseMedicalInsuranceValues(),
                        primaryPharmacyInsurance: getBasePharmacyInsuranceValues()
                      }
                    : null
              }));

              setErrors((prevErrors) => ({
                ...prevErrors,
                insuranceDetails: null
              }));
              setTouched((prevTouched) => ({
                ...prevTouched,
                insuranceDetails: false
              }));
            }, [isPayerDetailsRequired]);

            React.useEffect(() => {
              setValues((prevValues) => ({
                ...prevValues,
                insuranceDetails: {
                  ...prevValues.insuranceDetails,
                  secondaryMedicalInsurance: isSecondaryMedicalInsuranceOpen ? getBaseMedicalInsuranceValues() : null
                }
              }));

              setErrors((prevErrors) => ({
                ...prevErrors,
                insuranceDetails: {
                  ...prevErrors.insuranceDetails,
                  secondaryMedicalInsurance: null
                }
              }));
              setTouched((prevTouched) => ({
                ...prevTouched,
                insuranceDetails: {
                  ...prevTouched.insuranceDetails,
                  secondaryMedicalInsurance: false
                }
              }));
            }, [isSecondaryMedicalInsuranceOpen]);

            React.useEffect(() => {
              setValues((prevValues) => ({
                ...prevValues,
                insuranceDetails: {
                  ...prevValues.insuranceDetails,
                  secondaryPharmacyInsurance: isSecondaryPharmacyInsuranceOpen ? getBasePharmacyInsuranceValues() : null
                }
              }));
              setErrors((prevErrors) => ({
                ...prevErrors,
                insuranceDetails: {
                  ...prevErrors.insuranceDetails,
                  secondaryPharmacyInsurance: null
                }
              }));
              setTouched((prevTouched) => ({
                ...prevTouched,
                insuranceDetails: {
                  ...prevTouched.insuranceDetails,
                  secondaryPharmacyInsurance: false
                }
              }));
            }, [isSecondaryPharmacyInsuranceOpen]);

            React.useEffect(() => {
              setValues({ ...formValues });
            }, [formValues]);

            return (
              <Form>
                <div className="MCP-module-body">
                  <div className="MCP-CardContainer">
                    <div className="MCP-module-body">
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
                      <div className="radio-button-wrapper">
                        <Field
                          direction="rows"
                          component={Components['radioGroup']}
                          name="payerDetailsRequired"
                          id={`insurance-details-requirement`}
                          htmlFor={`insurance-details-requirement`}
                          items={[
                            {
                              isDisabled: false,
                              label: 'Yes',
                              value: 'yes'
                            },
                            {
                              isDisabled: false,
                              label: 'No',
                              value: 'no'
                            }
                          ]}
                          caption={'Do you want to use Insurance details for this patient?'}
                          radioBtnWidth="auto"
                        />
                      </div>
                    </div>
                  </div>
                  {values['payerDetailsRequired'] === 'yes' && (
                    <div className="MCP-panel-container">
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
                  )}
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
            );
          }}
        </Formik>
      </div>
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
