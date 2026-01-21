import PageHeader from '@src/components/pageHeader';
import React, { useContext } from 'react';
import OrderStepper from '../OrderStepper';
import OrderHeaderDetails from '../OrderHeaderDetails';
import { Button, IconButton, Heading, Loader } from '@mckesson/mcp-component-library';
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
import { CHANNEL_TYPE, ORDER_STAGES } from '../Constants';
import Components from '@src/components/form/Components';
import ManufacturerLogo from '../ManufacturerLogo';
import { ORDER_STATUS } from '../../../orders/config';
import { NotifyAlert } from '../OrderUtil';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { useDispatch } from 'react-redux';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';

function Payer({ readOnly, hasPermission }) {
  const [formValues, setFormValues] = React.useState(baseValues);
  const [isSecondaryMedicalInsuranceOpen, setIsSecondaryMedicalInsuranceOpen] = React.useState(false);
  const [isSecondaryPharmacyInsuranceOpen, setIsSecondaryPharmacyInsuranceOpen] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [isPayerDetailsRequired, setIsPayerDetailsRequired] = React.useState(false);
  const { controlRef } = useContext(FooterContext);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const locationState = location?.state ?? {};
  const { orderId } = useParams();
  const [isDirty, setIsDirty] = React.useState(false);
  const { isEdit = false, isApprover = false } = locationState || {};
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const { data: orderDetails = {}, isFetching, refetch: refreshOrderDetails } = useOrder(orderId);
  const { isDraft } = orderDetails;
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const { data: priceDetails } = useOrderPrice({
    channelType: orderDetails?.therapy?.channelType,
    trade: {
      ndc: orderDetails?.therapy?.ndcNumber
    },
    therapyId,
    soldToAccountId,
    shipToAccountId
  });

  React.useEffect(() => {
    if (!orderDetails) return;
    if (orderDetails.status === ORDER_STATUS.REVIEW) {
      navigate(RoutePaths.pathOrderManagement, { replace: true });
      return;
    }

    const { isPayerDetailsRequired, payerDetails } = orderDetails;

    if (isPayerDetailsRequired == null) return;

    const requiredValue = isPayerDetailsRequired ? 'yes' : 'no';

    setIsPayerDetailsRequired(requiredValue);
    setFormValues({
      payerDetailsRequired: requiredValue,
      insuranceDetails: isPayerDetailsRequired ? payerDetails ?? null : null
    });

    if (!isPayerDetailsRequired || !payerDetails) return;

    setIsSecondaryMedicalInsuranceOpen(!!payerDetails.secondaryMedicalInsurance);
    setIsSecondaryPharmacyInsuranceOpen(!!payerDetails.secondaryPharmacyInsurance);
  }, [orderDetails]);

  React.useEffect(() => {
    const { changeOnPreviousStep = false } = location.state;

    if (changeOnPreviousStep && !hasPermission) {
      const { changeOnPreviousStep, ...newState } = location.state;
      navigate(location.pathname, { state: newState });
      const state = {};
      state.title = t('title.stepSuccessfulCompletionByUnAuthorizedUser');
      state.body = (
        <div className="MCP-modal-body">
          <p>{t('message.stepSuccessfulCompletionByUnAuthorizedUser')}</p>
        </div>
      );
      dispatch(openModal(state));
    }
    return () => dispatch(hasUnsavedChanges(false));
  }, []);

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
    const navigateFn = () => {
      const prevSearch = locationState?.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    };
    if (isDirty) {
      const state = {};
      state.title = t('messages.confirmation.discardheader');
      state.body = (
        <div className="MCP-modal-body">
          <p>{t('messages.confirmation.payer')}</p>
        </div>
      );
      state.footer = (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {t('orgManagement.button.cancel')}
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              dispatch(closeModal());
              navigateFn();
            }}>
            {t('orgManagement.button.OK')}
          </Button>
        </div>
      );
      dispatch(openModal(state));
    } else {
      navigateFn();
    }
  };

  const handleOnBackButtonClick = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : 'patient');
      return;
    }

    if (isEdit) {
      navigateToSummaryStage(orderId, true);
    } else {
      navigateToPatientStage(orderId);
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      const prevSearch = locationState.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    } else if (modalSuccessCallback === 'summary') {
      navigateToSummaryStage(orderId, isEdit);
    } else if (modalSuccessCallback === 'patient') {
      navigateToPatientStage(orderId);
    }
  };

  const navigateToPatientStage = (orderId) => {
    navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
      state: {
        ...locationState,
        isEdit: false,
        isApprover: isApprover
      }
    });
  };

  const navigateToSummaryStage = (orderId, isSummaryEdit) => {
    navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
      state: {
        ...locationState,
        isEdit: isSummaryEdit,
        isApprover: isApprover
      }
    });
  };

  const navigateToNextStage = (orderId, changeOnPreviousStep) => {
    navigate(`${RoutePaths.pathOrderManagement}/${orderId}/additional-details`, {
      state: {
        ...locationState,
        isEdit: false,
        isApprover: isApprover,
        changeOnPreviousStep
      }
    });
  };

  const { isLoading: isSaving, mutate: savePayerDetails } = useMutation({
    queryKey: 'save-payer-details',
    mutationFn: ({ isPayerDetailsRequired, insuranceDetails, isSendNotification, isSavingDraft }) =>
      OrderService.savePayerDetails(orderId, isPayerDetailsRequired, insuranceDetails, orderDetails.channelType, isSavingDraft, isSendNotification),
    onSuccess: (_response, variables) => {
      if (!variables.isSavingDraft) {
        navigateToNextStage(orderId, true);
      } else {
        refreshOrderDetails();
        setIsDirty(false);
        setAlert({
          description: 'Order Saved In Draft Successfully',
          type: 'success'
        });
      }
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

  const handleOnSubmit = (values, isSavingDraft) => {
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

    if (isDirty || isDraft || orderDetails?.currentStage === ORDER_STAGES.PAYER_DETAILS) {
      savePayerDetails({ isPayerDetailsRequired, insuranceDetails, isSendNotification: isSavingDraft, isSavingDraft });
    } else {
      navigateToNextStage(orderId);
    }
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

  const isValidToSaveAsDraft = (values, errors, touched, setTouched, setErrors) => {
    let allValid = true;
    const newTouched = { ...touched };
    const newErrors = { ...errors };

    const traverse = (valObj, errObj, touchObj, errAcc) => {
      Object.keys(valObj).forEach((key) => {
        const value = valObj[key];
        const error = errObj?.[key];

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (!touchObj[key] || typeof touchObj[key] !== 'object') touchObj[key] = {};
          if (!errAcc[key] || typeof errAcc[key] !== 'object') errAcc[key] = {};
          traverse(value, error || {}, touchObj[key], errAcc[key]);
        } else {
          if (value !== undefined && value !== '' && value !== null) {
            if (error) allValid = false;
          } else {
            touchObj[key] = false;
            errAcc[key] = '';
          }
        }
      });
    };

    traverse(values, errors, newTouched, newErrors);
    setTouched(newTouched);
    setErrors(newErrors);

    return allValid;
  };

  const handleOnSaveDraft = (values, errors, touched, setTouched, setErrors) => {
    const isValid = isValidToSaveAsDraft(values, errors, touched, setTouched, setErrors);
    if (!isValid) {
      setAlert({ type: 'error', description: 'Some filled fields have errors. Please fix them before saving as draft.' });
      return;
    }
    handleOnSubmit(values, true);
  };

  const handleOnSaveAndContinue = (values) => handleOnSubmit(values);

  const handleOnClosePanel = (key, setFieldValue, currentValues, resetFormFn) => {
    const next = {
      ...currentValues,
      insuranceDetails: {
        ...currentValues.insuranceDetails,
        [key]: null
      }
    };
    resetFormFn({ values: next });

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
            {orderDetails?.collaborators && (
              <Collaborator
                collaborators={orderDetails?.collaborators}
                channelType={orderDetails?.channelType}
                orderId={orderId}
                currentStage={orderDetails?.currentStage}
              />
            )}
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
        {readOnly && (
          <NotifyAlert
            stage={ORDER_STAGES.PAYER_DETAILS}
            OnEdit={readOnly && orderDetails?.currentStage !== ORDER_STAGES.PAYER_DETAILS ? true : false}
            orderId={orderId}
            setAlert={setAlert}
          />
        )}
        <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onError={console.log}
          onSubmit={handleOnSaveAndContinue}>
          {({ setValues, errors, values, touched, setTouched, setErrors, setFieldValue, dirty, resetForm, ...rest }) => {
            React.useEffect(() => {
              dispatch(hasUnsavedChanges(dirty));
              setIsDirty(dirty);
            }, [dirty]);

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
                  <fieldset className="MCP-fieldset" disabled={readOnly}>
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
                                isDisabled: readOnly || false,
                                label: 'Yes',
                                value: 'yes'
                              },
                              {
                                isDisabled: readOnly || false,
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
                          readOnly={readOnly}
                          sections={getMedicalInsuranceUiTemplate('primaryMedicalInsurance', 'Primary Medical Insurance')}
                          ALLOWED_FILE_TYPE={'application/pdf'}
                          ALLOWED_FILE_TYPE_TEXT={'PDF'}
                        />
                        <hr className="form-section-separator" />
                        <FormRenderer
                          onUpload={handleOnUpload({
                            insurance: 'PHARMACY',
                            insuranceLevel: 'PRIMARY'
                          })}
                          sections={getPharmacyInsuranceUiTemplate('primaryPharmacyInsurance', 'Primary Pharmacy Insurance')}
                          ALLOWED_FILE_TYPE={'application/pdf'}
                          ALLOWED_FILE_TYPE_TEXT={'PDF'}
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
                              onClose={() => handleOnClosePanel('secondaryMedicalInsurance', setFieldValue, values, resetForm)}
                              closeIcon={BinRedIcon}
                              onUpload={handleOnUpload({
                                insurance: 'MEDICAL',
                                insuranceLevel: 'SECONDARY'
                              })}
                              readOnly={readOnly}
                              sections={getMedicalInsuranceUiTemplate('secondaryMedicalInsurance', 'Secondary Medical Insurance')}
                              ALLOWED_FILE_TYPE={'application/pdf'}
                              ALLOWED_FILE_TYPE_TEXT={'PDF'}
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
                              onClose={() => handleOnClosePanel('secondaryPharmacyInsurance', setFieldValue, values, resetForm)}
                              closeIcon={BinRedIcon}
                              onUpload={handleOnUpload({
                                insurance: 'PHARMACY',
                                insuranceLevel: 'SECONDARY'
                              })}
                              readOnly={readOnly}
                              sections={getPharmacyInsuranceUiTemplate('secondaryPharmacyInsurance', 'Secondary Pharmacy Insurance')}
                              ALLOWED_FILE_TYPE={'application/pdf'}
                              ALLOWED_FILE_TYPE_TEXT={'PDF'}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </fieldset>
                  <div className="footer-wrapper" ref={controlRef}>
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBackButtonClick}>
                        {t('captions.btnBack')}
                      </Button>
                      <Button
                        size="md"
                        onClick={() => handleOnSaveDraft(values, errors, touched, setTouched, setErrors)}
                        variant="primary"
                        type="button"
                        disabled={readOnly || !isDirty}>
                        {t('button.caption.saveAsDraft')}
                      </Button>
                      <Button size="md" variant="primary" type="submit" disabled={readOnly}>
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
        description={t('messages.confirmation.payer')}
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
}

// export default Payer;
export default withPermissions(Payer, ORDER_STAGES.PATIENT_DETAILS);
