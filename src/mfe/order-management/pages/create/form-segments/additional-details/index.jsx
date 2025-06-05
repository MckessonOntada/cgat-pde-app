import React, { useContext, useEffect, useState } from 'react';
import { Button, Heading, CheckboxGroup, RadioGroup, Loader, TextError } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as InfoIcon } from '@src/assets/svg/info_icon_circle_filled.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import PageHeader from '@src/components/pageHeader';
import { Field, Form, Formik } from 'formik';
import { getFormFields } from './fields';
import * as Yup from 'yup';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation, useQuery } from 'react-query';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { LANGUAGE, QUESTION_TYPE } from '@src/mfe/core-config/system-admin/manage-questionnaire/AddQuestionnaire';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from './useOrderPrice';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import Components from '@src/components/form/Components';
import { CHANNEL_TYPE } from '../Constants';
import { FooterContext } from '@src/components/footer/FooterContext';
import QuestionnaireTemplate from '@src/mfe/core-config/system-admin/manage-questionnaire/QuestionnaireTemplate';

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  dateOfAdministration: '',
  variant: {
    variant: '',
    variantDescription: '',
    productLevelPricing: false
  },
  variantAcknowledgement: false
};

function AdditionalDetails() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { controlRef } = useContext(FooterContext);
  const searchParams = new URLSearchParams(location.search);
  const { isEdit = false, isApprover = false, alertState } = location.state || {};
  const { orderId } = useParams();
  const [initialFormValues, setInitialFormValues] = React.useState(INITIAL_VALUES);
  const [storedValue, setStoredValue] = useState([]);
  const [validationSchema, setValidationSchema] = React.useState(null);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [questionnaireTemplateConfig, setQuestionnaireTemplateConfig] = React.useState(null);
  const [variantAcknowledgement, setVariantAcknowledgement] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.variantAcknowledgement'),
    value: false
  });
  const [agreementCheckboxError, setAgreementCheckboxError] = React.useState(null);
  const [variant, setVariant] = React.useState();
  const { showAlert } = useAlert();
  const alertContainerId = 'additionalDetails-alert-container';
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails, isError, error, isLoader } = useOrder(orderId);
  const { isCoiIdRequired, patientDetailsRequired } = orderDetails || {};
  const { therapy = {}, tradeDetails = {} } = orderDetails;
  const therapyId = orderDetails.therapy?.materialNumber;
  const soldToAccountId = orderDetails.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails.accountDetails?.shipToAccount?.accountNumber;
  const channelType = orderDetails.accountDetails?.soldToAccount?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const therapyChannelType = orderDetails.therapy?.channelType || CHANNEL_TYPE.BUY_AND_BILL;

  const isSPCrossWalked = therapyChannelType === CHANNEL_TYPE.BUY_AND_BILL && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const isSPNonCrossWalked = therapyChannelType === CHANNEL_TYPE.SPECIALTY_PHARMA && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;

  const variantsApiRequestParam = {
    pageNo: 0,
    pageSize: 10,
    channelType
  };

  const { data: priceDetails = {} } = useOrderPrice(
    {
      therapyId,
      soldToAccountId,
      shipToAccountId,
      ...(variant && { variant: variant.variant }),
      channelType
    },
    null,
    null
  );

  const initialValidationSchema = (isVariantRequired) => {
    return Yup.object({
      coiId: Yup.string()
        .matches(ALPHA_NUMERIC_ONLY, t('labels.COI_IdMustValidNumber'))
        .max(10, t('labels.COI_IdExceedDigits'))
        .when([], {
          is: () => isCoiIdRequired === true,
          then: (schema) => schema.required(t('labels.COIIdRequired')),
          otherwise: (schema) => schema
        }),
      orderQuantity: Yup.number()
        .typeError(t('labels.OrderQuantityShouldPositive'))
        .required(t('labels.orderQuantityRequired'))
        .positive(t('labels.OrderQuantityShouldGreaterThanZero'))
        .integer(t('labels.OrderQuantityMustBeInteger')),
      slotNumber: Yup.string().required(t('labels.slotNumberRequired')).max(20, t('labels.slotNumberLengthError')).trim(t('labels.slotNumberExtraSpaceError')),
      poNumber: Yup.string().required(t('labels.PONumberRequired')).max(35, t('labels.PONumberLengthError')).trim(t('labels.poNumberExtraSpaceError')),
      dateOfAdministration: Yup.date().min(new Date(), t('labels.dateOfAdministrationFutureDateOnly')).nullable(),

      // Conditionally Require Variant
      variant: Yup.object()
        .shape({
          variant: Yup.string().when([], {
            is: () => isVariantRequired,
            then: (schema) => schema.required('Please select at least one variant'),
            otherwise: (schema) => schema.nullable()
          }),
          variantDescription: Yup.string().nullable(),
          productLevelPricing: Yup.boolean().nullable(),
          document: Yup.object()
            .shape({
              url: Yup.string(),
              size: Yup.number(),
              name: Yup.string()
            })
            .nullable()
        })
        .nullable(),

      // Conditionally Require Acknowledgement Checkbox
      variantAcknowledgement: Yup.boolean().when([], {
        is: () => isVariantRequired,
        then: (schema) => schema.oneOf([true], t('message.acknowldge')),
        otherwise: (schema) => schema.nullable()
      })
    });
  };

  const { isLoading, data: variantsData = {} } = useQuery({
    queryKey: ['order', 'variants', orderId],
    queryFn: async () =>
      OrderService.getVariants(
        {
          soldToAccountId,
          shipToAccountId,
          ndc: tradeDetails.ndc
        },
        variantsApiRequestParam
      ),
    enabled: !!tradeDetails.ndc && !!soldToAccountId && !!shipToAccountId,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {},
    onError: (error) => {
      const errorKey = handleApiError(error);
      showAlert({
        description: t(errorKey),
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  });

  React.useEffect(() => {
    // To check if variant selection is required
    const isVariantRequired = !!variantsData?.content && CommonUtils.isNonEmptyObject(variantsData?.content);

    // Get the Initial Validation Schema based on Variant Required
    const updatedValidationSchema = initialValidationSchema(isVariantRequired);

    // Prepare Questionnaire Fields and Get its Validation Schema
    let questionnaireValidationSchema = Yup.object();
    let questionnaireFields = {};

    if (questionnaireTemplateConfig) {
      const { validationSchema, fields } = prepareQuestionnaire(questionnaireTemplateConfig);
      questionnaireValidationSchema = validationSchema;
      questionnaireFields = fields;
    }

    const finalValidationSchema = updatedValidationSchema.concat(questionnaireValidationSchema);
    setInitialFormValues((pre) => ({
      ...pre,
      ...storedValue,
      ...questionnaireFields
    }));
    setValidationSchema(finalValidationSchema);
  }, [variantsData, questionnaireTemplateConfig]);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder)
      navigate(`/orders?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab }
      });
  }, [orderDetails]);

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(async (data) => OrderService.saveAdditionalDetails(orderId, data), {
    onSuccess: (result) => {
      const { id } = result;
      navigate(`../${id}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    },
    onError: (error) => {
      const errorKey = handleApiError(error);
      showAlert({
        description: t(errorKey),
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  });

  useEffect(() => {
    if (!alertState) {
      return;
    }
    showAlert({ ...alertState, anchorEl: alertContainerId });
  }, []);

  const prepareQuestionnaire = (result) => {
    setQuestionnaireTemplateConfig(result);
    if (!result || !Array.isArray(result)) {
      throw new Error('Not a valid questionnaire config');
    }

    const questionnaireFields = {};
    const validationSchemaFields = {};

    result.forEach((template) => {
      template.questions.forEach((question) => {
        const fieldName = CommonUtils.generateUniqueCode(`${template.id}#${question.text[LANGUAGE.ENGLISH]}`);
        questionnaireFields[fieldName] = {
          value: question.value
        };

        if (question.isDocumentRequired && question.document) {
          questionnaireFields[fieldName].document = question.document;
        }

        validationSchemaFields[fieldName] = Yup.object({
          value:
            question.type === QUESTION_TYPE.INPUT || question.type === QUESTION_TYPE.DROPDOWN
              ? question.isMandatory
                ? Yup.string().required('Value is required')
                : Yup.string().nullable()
              : question.type === QUESTION_TYPE.RADIO_BUTTON
              ? question.isMandatory
                ? Yup.string().required('Select at least one option')
                : Yup.string().nullable()
              : question.type === QUESTION_TYPE.CHECKBOX
              ? question.isMandatory
                ? Yup.array()
                    .of(Yup.string())
                    .min(1, 'Select at least one option')
                    .test('not-empty', 'Select at least one option', (value) => Array.isArray(value) && value.length > 0)
                : Yup.array().of(Yup.string()).nullable()
              : question.isMandatory
              ? Yup.array().of(Yup.string()).min(1, 'Select at least one option')
              : Yup.array().of(Yup.string()).nullable(),

          document: Yup.object()
            .shape({
              url: Yup.string(),
              size: Yup.number(),
              name: Yup.string()
            })
            .nullable()
        });
      });
    });

    return {
      validationSchema: Yup.object().shape(validationSchemaFields), // Return validation schema
      fields: questionnaireFields // Return initial values
    };
  };

  const variantType = isSPCrossWalked || isSPNonCrossWalked ? null : variant?.variant;

  const {
    data: configuredQuestions,
    isFetching: isFetchingConfiguredQuestions,
    isError: isErrorConfiguredQuestions,
    error: configuredQuestionsError,
    refetch: fetchConfiguredQuestions
  } = useQuery({
    queryKey: ['configured-questionnaire', orderId, variant ? variant.materialNumber : 'default-variant'],
    queryFn: async () => {
      const { accountDetails, therapy } = orderDetails;
      if (orderDetails.additionalDetails?.configuredQuestionnaires) return;

      let materialOrNdcNumber = '';
      if (isSPCrossWalked) {
        materialOrNdcNumber = variant && variant?.materialNumber;
      } else if (isSPNonCrossWalked) {
        materialOrNdcNumber = therapy.materialNumber;
      } else {
        materialOrNdcNumber = tradeDetails.ndc;
      }

      const payload = {
        ...(variantType ? { variantType } : {}),
        materialOrNdcNumber,
        soldToCustomer: accountDetails.soldToAccount?.accountNumber,
        shipToCustomer: accountDetails.shipToAccount?.accountNumber,
        sapMaterial: isSPCrossWalked && !!variant ? variant?.materialNumber : therapy?.materialNumber,
        channelType: isSPCrossWalked || isSPNonCrossWalked ? CHANNEL_TYPE.SPECIALTY_PHARMA : CHANNEL_TYPE.BUY_AND_BILL
      };
      return QuestionnaireService.getConfiguredQuestionnaire(payload);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      result && prepareQuestionnaire(result);
    },
    onError: (error) => {
      showAlert({
        description: error.message,
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  });

  const { data: uploadDocumentResponse, mutate: uploadDocument } = useMutation(
    async ({ fieldName, file }) => {
      const [templateId] = fieldName.split('#');
      return QuestionnaireService.uploadQuestionnaireDocument({
        orderId,
        templateId,
        file
      });
    },
    {
      onSuccess: (result, variables) => {
        const { file, fieldName, setFieldValue } = variables;
        const { name, size } = file;
        const document = { url: result, name, size };
        setFieldValue(`${fieldName}.document`, document);
      },
      onError: (error) => {
        showAlert({
          description: error.message,
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  const { data: uploadVariantDocumentResponse, mutate: uploadVariantDocument } = useMutation(
    async ({ fieldName, file }) => {
      return QuestionnaireService.uploadVariantDocument({
        orderId,
        variantId: variant.variant,
        file
      });
    },
    {
      onSuccess: (result, variables) => {
        const { file, fieldName, setFieldValue } = variables;
        const { name, size } = file;
        const document = { url: result, name, size };
        setFieldValue(`${fieldName}.document`, document);
      },
      onError: (error) => {
        showAlert({
          description: error.message,
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  const handleOnDocumentChange = (fieldName, file, setFieldValue) => {
    uploadDocument({ fieldName, file, setFieldValue });
  };

  const handleOnVariantDocumentChange = (fieldName, file, setFieldValue) => {
    uploadVariantDocument({ fieldName, file, setFieldValue });
  };

  const handleOnRemoveDocument = (fieldName) => {
    initialFormValues[fieldName].document = null;
    setInitialFormValues({ ...initialFormValues });
  };

  React.useEffect(() => {
    const { additionalDetails } = orderDetails || {};
    if (additionalDetails) {
      const {
        dateOfAdministration,
        coiId,
        orderQuantity,
        patientConsentTaken,
        poNumber,
        slotNumber,
        variantDetails = {},
        configuredQuestionnaires
      } = additionalDetails;

      const { variantDocumentPath, ...otherDetails } = variantDetails || {};
      const initialValues = {
        dateOfAdministration,
        coiId,
        orderQuantity,
        poNumber,
        slotNumber,
        variant: {
          ...otherDetails,
          document: variantDocumentPath ? JSON.parse(variantDocumentPath) : undefined
        },
        variantAcknowledgement: patientConsentTaken
      };

      configuredQuestionnaires && prepareQuestionnaire(configuredQuestionnaires);

      setInitialFormValues((prevState) => ({
        ...prevState,
        ...initialValues
      }));
      setStoredValue((prevState) => ({
        ...prevState,
        ...initialValues
      }));
      if (!variantsData?.content || !variantDetails) {
        return;
      }

      const targetVariant = variantsData.content?.find((v) => variantDetails.variant === v.variant);
      setVariant({
        ...targetVariant
      });
      setVariantAcknowledgement((prev) => ({
        ...prev,
        isChecked: patientConsentTaken
      }));
    }
  }, [orderDetails, variantsData]);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : orderDetails?.patientDetailsRequired ? 'patient' : 'account');
      return;
    }
    if (isEdit) {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else {
      if (orderDetails?.patientDetailsRequired) {
        const targetPage = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'payer' : 'patient';
        navigate(`../${orderId}/${targetPage}?${searchParams.toString()}`, {
          state: {
            fromTab: location?.state?.fromTab,
            isEdit: false,
            isApprover: isApprover,
            fromOrderView: location?.state?.fromOrderView
          }
        });
      } else {
        navigate(`../${orderId}/accounts?${searchParams.toString()}`, {
          state: {
            fromTab: location?.state?.fromTab,
            isEdit: false,
            isApprover: isApprover,
            fromOrderView: location?.state?.fromOrderView
          }
        });
      }
    }
  };

  const handleOnSubmit = (values) => {
    const variantDetails = !!variant
      ? {
          variant: variant.variant,
          variantDescription: variant.variantDescription,
          variantAcknowledgment: variantAcknowledgement.isChecked,
          variantDocumentPath: values.variant?.document && JSON.stringify(values.variant?.document),
          therapy: {
            id: variant.therapyId
          }
        }
      : null;

    const { accountDetails, therapy } = orderDetails;
    const questionnaireDependencies = {
      soldToCustomer: accountDetails.soldToAccount.accountNumber,
      shipToCustomer: accountDetails.soldToAccount.accountNumber,
      sapMaterial: tradeDetails.ndcNumber,
      variant
    };

    const questionnaireResponse = {
      response: [...questionnaireTemplateConfig],
      dependencies: questionnaireDependencies
    };
    const { coiId, orderQuantity, slotNumber, poNumber, dateOfAdministration, ...rest } = values;

    questionnaireTemplateConfig.forEach((template) => {
      if (!template.questions) return;

      template.questions.forEach((question) => {
        const fieldName = CommonUtils.generateUniqueCode(`${template.id}#${question.text[LANGUAGE.ENGLISH]}`);
        const fieldValue = values[fieldName];
        if (!fieldName) return;

        question.value = fieldValue.value;
        question.document = fieldValue.document;
      });
    });

    const payload = {
      coiId,
      orderQuantity,
      slotNumber,
      poNumber,
      dateOfAdministration,
      variantDetails: variantDetails,
      patientConsentTaken: !!variant ? variantDetails.variantAcknowledgment : false,
      configuredQuestionnaires: questionnaireTemplateConfig
    };

    saveAdditionalDetails(payload);
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }
      });
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}?${searchParams.toString()}`, {
        state: { activeTab: location?.state?.fromTab, fromOrderView: location?.state?.fromOrderView }
      });
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: isEdit,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else if (modalSuccessCallback === 'patient') {
      navigate(`../${orderId}/patient?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: false,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    } else if (modalSuccessCallback === 'account') {
      navigate(`../${orderId}/accounts?${searchParams.toString()}`, {
        state: {
          fromTab: location?.state?.fromTab,
          isEdit: false,
          isApprover: isApprover,
          fromOrderView: location?.state?.fromOrderView
        }
      });
    }
  };

  const handleOnVariantChange = (variant, setErrors, errors, setFieldValue, setFieldTouched) => {
    setAgreementCheckboxError(null);
    if (errors && errors.variant) {
      const { variant, ...newErrors } = errors;
      setErrors(newErrors);
    }
    setFieldValue('variant', variant);
    setFieldTouched('variant', true, false);
    setFieldValue('variantAcknowledgement', false);
    setVariantAcknowledgement((prevState) => ({
      ...prevState,
      isChecked: false
    }));

    setVariant(variant);
  };

  React.useEffect(() => {
    if (orderDetails && !orderDetails.additionalDetails?.configuredQuestionnaires) {
      const { soldToAccount, shipToAccount } = orderDetails.accountDetails || {};
      if (soldToAccount && shipToAccount) {
        if ((isSPCrossWalked && variant) || !isSPCrossWalked) fetchConfiguredQuestions();
      }
    }
  }, [variant, orderDetails, isSPCrossWalked]);

  const handleOnAcknowledgmentChange = (setErrors, errors, setFieldValue, setFieldTouched) => {
    const updatedOptions = {
      ...variantAcknowledgement,
      isChecked: !variantAcknowledgement.isChecked
    };
    if (errors && errors.variantAcknowledgement) {
      const { variantAcknowledgement, ...newErrors } = errors;
      setErrors(newErrors);
    }
    setFieldValue('variantAcknowledgement', updatedOptions.isChecked);
    setVariantAcknowledgement(updatedOptions);
  };

  if (isLoader) {
    return isLoader;
  }

  return (
    <div className="MCP-module-wrapper">
      {isSaving && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />
      <Formik
        initialValues={initialFormValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onError={(value) => {
          console.log(value);
        }}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}>
        {({ dirty, errors, values, setFieldValue, setErrors, setFieldTouched, touched }) => {
          useEffect(() => {
            setIsDirty(dirty);
            setStoredValue(values);
          }, [dirty, values]);

          return (
            <Form>
              <div className="MCP-module-body">
                <OrderStepper patientDetailsRequired={patientDetailsRequired} status={orderDetails?.currentStage} channelType={orderDetails.channelType} />

                <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} />
                <div id={alertContainerId} />

                <div className="MCP-panel-container">
                  <div className="row-space-between-center">
                    <Heading as="h3">{t('labels.additionalDetails')}</Heading>
                    <p className="form-instruction">
                      <span className="required">*</span> {t('labels.required')}
                    </p>
                  </div>
                  <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                    {getFormFields(t, { isCoiIdRequired }, setFieldValue).map(
                      ({ name, label, placeholder, isRequired, component, maxLength, ...otherProps }, index) => (
                        <Field
                          key={index}
                          name={name}
                          label={label}
                          placeholder={placeholder}
                          isRequired={isRequired}
                          component={component}
                          maxLength={maxLength}
                          {...otherProps}
                        />
                      )
                    )}
                  </div>
                  {!!variantsData?.content && CommonUtils.isNonEmptyObject(variantsData?.content) && (
                    <div>
                      <div className="MCP-module-body">
                        <Heading as="h3">{t('labels.selectVariant')}</Heading>
                        <div>
                          <VariantTable
                            variant={variant}
                            onChange={(variant) => handleOnVariantChange(variant, setErrors, errors, setFieldValue, setFieldTouched)}
                            data={variantsData.content}
                          />
                          {touched?.variant && !values.variant && <TextError errorMessage={errors.variant.variant} showErrorIcon={true} />}
                        </div>
                        <div className="agreement-checkbox-control">
                          <Field name="variant-acknowledgement">
                            {({ field, form }) => (
                              <CheckboxGroup
                                id={'default'}
                                name="variant-acknowledgement"
                                items={[
                                  {
                                    ...variantAcknowledgement,
                                    onChange: () => handleOnAcknowledgmentChange(setErrors, errors, setFieldValue)
                                  }
                                ]}
                                error={errors.variantAcknowledgement && touched?.variantAcknowledgement ? Boolean(!values.variantAcknowledgement) : false}
                                errorMessage={touched?.variantAcknowledgement && errors.variantAcknowledgement}
                                size="md"
                              />
                            )}
                          </Field>
                        </div>
                        <div>
                          <Field
                            name="variant.document"
                            component={Components['inputFile']}
                            setFieldValue={setFieldValue}
                            disabled={Boolean(!variant)}
                            attachmentValue={values?.variant?.document || null}
                            onFileChange={(file) => handleOnVariantDocumentChange('variant', file, setFieldValue)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isFetchingConfiguredQuestions ? (
                    <div>
                      <Loader variant="circular" />
                    </div>
                  ) : (
                    <div>
                      {questionnaireTemplateConfig && Array.isArray(questionnaireTemplateConfig) && questionnaireTemplateConfig.length > 0 && (
                        <div className="configured-questionnaire-form">
                          <div className="MCP-module-body">
                            <Heading as="h3">{t('labels.configuredQuestionnaires')}</Heading>
                            <QuestionnaireTemplate
                              onRemoveDocument={handleOnRemoveDocument}
                              onDocumentChange={handleOnDocumentChange}
                              config={questionnaireTemplateConfig}
                              isPreview={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="footer-wrapper" ref={controlRef}>
                  <div className="controls footer-controls">
                    <Button size="md" variant="secondary" onClick={handleOnBack}>
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

const VariantTable = ({ variant, onChange, data }) => {
  const { t } = useTranslate();
  const showCardView = useResponsiveView();
  const columns = [
    {
      id: 'id',
      width: '40px',
      sortable: false,
      showInMobileHeader: true,
      isSelectable: true,
      cell: (props) => (
        <span className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-variant-${props.variant}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.variant
              }
            ]}
            onChangeValue={() => {
              onChange(props);
            }}
            radioBtnWidth="auto"
            value={variant?.variant === props.variant ? props.variant : ''}
          />
        </span>
      )
    },
    {
      id: 'variant',
      name: (
        <div className="variant-table-cell icon">
          <span>{t('labels.variant')}</span>
          <InfoIcon />
        </div>
      ),
      selector: () => {},
      minWidth: '220px',
      maxWidth: '280px',
      sortable: false,
      showInMobileHeader: true,

      cardHeader: true,
      cell: (props) => (
        <span className="flex" aria-label={t('labels.variant')}>
          <EclipsesTextcss str={props.variant} maxWidth={240} />
        </span>
      )
    },
    {
      id: 'variantDescription',
      name: <div className="variant-table-cell">{t('labels.variantDescription')}</div>,
      minWidth: '300px',
      selector: () => {},
      sortable: false,
      showInMobileHeader: true,
      // showColumnNameInHeader: true,
      cell: (props) => <span>{props.variantDescription}</span>
    }
  ];
  return (
    <CustomDataTable
      id="order-management-therapy-listing"
      type={'normal'}
      columns={columns}
      data={data}
      showCardView={showCardView}
      defaultExpandedCardView={true}
    />
  );
};
export default AdditionalDetails;
