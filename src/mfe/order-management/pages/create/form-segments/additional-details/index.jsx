import React, { useContext, useEffect, useState } from 'react';
import { Button, Heading, CheckboxGroup, RadioGroup, Loader, TextError } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as InfoIcon } from '@src/assets/svg/info_icon_circle_filled.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import PageHeader from '@src/components/pageHeader';
import { Field, Form, Formik } from 'formik';
import { getClinicalDetailFields, getFormFields } from './fields';
import * as Yup from 'yup';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation, useQuery } from 'react-query';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
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
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  dateOfAdministration: '',

  diagnosisCode: '',
  hasAllergies: '',
  allergyDetails: '',
  hasDiseases: '',

  variant: {
    variant: '',
    variantDescription: '',
    productLevelPricing: false
  },
  variantAcknowledgement: false
};

const ALLOWED_FILE_TYPE = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg'
];
const ALLOWED_FILE_TYPE_TEXT = 'PDF, Word, PNG, JPEG, JPG, .TXT';

function AdditionalDetails() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location?.state ?? {};
  const { controlRef } = useContext(FooterContext);
  const { isEdit = false, isApprover = false, alertState } = locationState;
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
  const [alert, setAlert] = React.useState(null);
  const { data: orderDetails = {}, isFetching } = useOrder(orderId);
  const { tradeDetails = {}, isCoiIdRequired, channelType = CHANNEL_TYPE.BUY_AND_BILL, patientDetailsRequired } = orderDetails || {};
  const therapyId = orderDetails.therapy?.materialNumber;
  const soldToAccountId = orderDetails.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails.accountDetails?.shipToAccount?.accountNumber;
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

  const initialValidationSchema = (isVariantRequired, channelType) => {
    let schema = Yup.object({
      poNumber: Yup.string()
        .required(t('labels.PONumberRequired'))
        .matches(ALPHA_NUMERIC_ONLY, t('labels.poNumberMustValid'))
        .max(35, t('labels.PONumberLengthError'))
        .test('no-leading-trailing-spaces', t('labels.poNumberExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length),

      dateOfAdministration: Yup.date()
        .typeError(t('labels.enterValidDateOfAdministration'))
        .min(new Date(), t('labels.dateOfAdministrationFutureDateOnly'))
        .nullable(),
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
      variantAcknowledgement: Yup.boolean().when([], {
        is: () => isVariantRequired,
        then: (schema) => schema.oneOf([true], t('message.acknowldge')),
        otherwise: (schema) => schema.nullable()
      })
    });

    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      schema = schema.concat(
        Yup.object({
          diagnosisCode: Yup.string().required(t('labels.diagnosisCodeRequired')).max(50, t('labels.COI_IdExceedDigits')),
          hasAllergies: Yup.string().required(t('labels.selectHaveAllergies')).oneOf(['yes', 'no'], t('labels.invalidSelection')),

          allergyDetails: Yup.string().when('hasAllergies', {
            is: (val) => val === 'yes',
            then: (schema) => schema.required(t('labels.allergiesDetailsRequired')),
            otherwise: (schema) => schema.notRequired()
          }),
          hasDiseases: Yup.string().required(t('labels.selectHasDiseases')).oneOf(['yes', 'no'], t('labels.invalidSelection'))
        })
      );
    } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      schema = schema.concat(
        Yup.object({
          coiId: Yup.string()
            .matches(ALPHA_NUMERIC_ONLY, t('labels.COI_IdMustValidNumber'))
            .max(10, t('labels.COI_IdExceedDigits'))
            .when('$isCoiIdRequired', {
              is: true,
              then: (schema) => schema.required(t('labels.COIIdRequired')),
              otherwise: (schema) => schema.notRequired()
            }),
          orderQuantity: Yup.number()
            .typeError(t('labels.OrderQuantityShouldPositive'))
            .min(1, t('labels.OrderQuantityMin', { min: 1 }))
            .max(99, t('labels.OrderQuantityMax', { max: 99 }))
            .required(t('labels.orderQuantityRequired'))
            .positive(t('labels.OrderQuantityShouldGreaterThanZero'))
            .integer(t('labels.OrderQuantityMustBeInteger')),
          slotNumber: Yup.string()
            .required(t('labels.slotNumberRequired'))
            .max(20, t('labels.slotNumberLengthError'))
            .trim(t('labels.slotNumberExtraSpaceError'))
        })
      );
    }

    return schema;
  };

  const { data: variantsData = {} } = useQuery({
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
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  React.useEffect(() => {
    const isVariantRequired = !!variantsData?.content && CommonUtils.isNonEmptyObject(variantsData?.content);

    const updatedValidationSchema = initialValidationSchema(isVariantRequired, channelType);

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
  }, [variantsData, questionnaireTemplateConfig, channelType]);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    const prevSearch = locationState.__prevSearch || '';
    if (isPapOrder) navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  }, [orderDetails]);

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(async (data) => OrderService.saveAdditionalDetails(orderId, data), {
    onSuccess: (result) => {
      const { id } = result;
      navigate(`${RoutePaths.pathOrderManagement}/${id}/summary`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  useEffect(() => {
    if (!alertState) {
      return;
    }
    setAlert({ ...alertState });
  }, []);

  const prepareQuestionnaire = (result) => {
    setQuestionnaireTemplateConfig(result);
    if (!result || !Array.isArray(result)) {
      throw new Error('Not a valid questionnaire config');
    }

    const questionnaireFields = {};
    const validationSchemaFields = {};

    result.forEach((template) => {
      template.sectionsDetails.forEach((section) => {
        section.questions.forEach((question) => {
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
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

      setAlert({
        description,
        type: 'error'
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
        const description = CommonUtils.getUploadErrorMessage(error, t);
        setAlert({
          description,
          type: 'error'
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
        const statusCode = error?.response?.status;
        let description = t('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
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
        configuredQuestionnaires,
        diagnosisCode,
        clinicalDetails
      } = additionalDetails;

      const { variantDocumentPath, ...otherDetails } = variantDetails || {};
      const initialValues = {
        poNumber,
        variant: {
          ...otherDetails,
          document: variantDocumentPath ? JSON.parse(variantDocumentPath) : undefined
        },
        variantAcknowledgement: patientConsentTaken
      };

      if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
        initialValues.allergyDetails = clinicalDetails.allergiesSpecification;
        initialValues.dateOfAdministration = clinicalDetails.dateOfAdministration;
        initialValues.hasAllergies = clinicalDetails.hasAllergies ? 'yes' : 'no';
        initialValues.hasDiseases = clinicalDetails.hasDiseaseIndication ? 'yes' : 'no';
        initialValues.diagnosisCode = diagnosisCode;
      } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
        initialValues.dateOfAdministration = dateOfAdministration;
        initialValues.coiId = coiId;
        initialValues.orderQuantity = orderQuantity;
        initialValues.slotNumber = slotNumber;
      }

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
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...locationState,
          isEdit: isEdit,
          isApprover: isApprover
        }
      });
    } else {
      if (orderDetails?.patientDetailsRequired) {
        const targetPage = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'payer' : 'patient';
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/${targetPage}`, {
          state: {
            ...locationState,
            isEdit: false,
            isApprover: isApprover
          }
        });
      } else {
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/accounts`, {
          state: {
            ...locationState,
            isEdit: false,
            isApprover: isApprover
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

    const { coiId, orderQuantity, slotNumber, poNumber, dateOfAdministration } = values;

    questionnaireTemplateConfig.forEach((template) => {
      if (!template.sectionsDetails) return;

      template.sectionsDetails.forEach((section, sectionIndex) => {
        section.questions.forEach((question) => {
          const fieldName = CommonUtils.generateUniqueCode(`${template.id}#${question.text[LANGUAGE.ENGLISH]}`);
          const fieldValue = values[fieldName];
          if (!fieldName) return;

          question.value = fieldValue.value;
          question.document = fieldValue.document;
        });
      });
    });

    const payload = {
      poNumber,
      variantDetails: variantDetails,
      patientConsentTaken: !!variant ? variantDetails.variantAcknowledgment : false,
      configuredQuestionnaires: questionnaireTemplateConfig
    };

    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      const { hasAllergies, allergyDetails, hasDiseases, dateOfAdministration } = values;
      const clinicalDetails = {
        hasAllergies: hasAllergies === 'yes',
        hasDiseaseIndication: hasDiseases === 'yes'
      };

      if (hasAllergies === 'yes') {
        clinicalDetails.allergiesSpecification = allergyDetails;
      }

      if (dateOfAdministration) {
        clinicalDetails.dateOfAdministration = dateOfAdministration;
      }

      payload.clinicalDetails = clinicalDetails;
      payload.diagnosisCode = values['diagnosisCode'];
    } else {
      payload.coiId = coiId;
      payload.orderQuantity = orderQuantity;
      payload.slotNumber = slotNumber;
      payload.dateOfAdministration = dateOfAdministration;
    }

    saveAdditionalDetails(payload);
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      const prevSearch = locationState?.__prevSearch || '';
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    }
  };

  const handleNavigate = () => {
    const prevSearch = locationState?.__prevSearch || '';

    if (modalSuccessCallback === 'list') {
      navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/summary`, {
        state: {
          ...state.location,
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
    } else if (modalSuccessCallback === 'account') {
      navigate(`/${orderId}/accounts`, {
        state: {
          ...locationState,
          isEdit: false,
          isApprover: isApprover
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

  const handleOnAcknowledgmentChange = (setErrors, errors, setFieldValue) => {
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

  return (
    <div className="MCP-module-wrapper">
      {(isSaving || isFetching) && <Loader type={'screen'} />}
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={isApprover ? t('headings.reviewOrder') : t('headings.createNewOrder')} />
      <div className="MCP-module-body">
        <OrderStepper patientDetailsRequired={patientDetailsRequired} status={orderDetails?.currentStage} channelType={orderDetails.channelType} />
        <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} channelType={orderDetails.channelType} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <Formik
          initialValues={initialFormValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onError={console.log}
          validationContext={{ isCoiIdRequired }}
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
                  <div className="MCP-panel-container">
                    <ModuleHeader
                      heading={
                        <div>
                          <Heading as="h2">{t('labels.additionalDetails')}</Heading>
                        </div>
                      }
                      controls={
                        <p className="form-instruction">
                          <span className="required">*</span> {t('labels.required')}
                        </p>
                      }
                    />
                    <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                      {getFormFields(t, { isCoiIdRequired, channelType }, setFieldValue).map(
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
                    {channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (
                      <React.Fragment>
                        <hr className="form-section-separator" />
                        <div className="row-space-between-center">
                          <Heading as="h3">{t('labels.clinicalDetails')}</Heading>
                          <p className="form-instruction">
                            <span className="required">*</span> {t('labels.required')}
                          </p>
                        </div>
                        <React.Fragment>
                          {getClinicalDetailFields(t, { isCoiIdRequired, channelType, values }, setFieldValue, setFieldTouched).map(
                            ({ name, label, placeholder, isRequired, component, maxLength, layout = {}, ...otherProps }, index) => (
                              <div key={index} className={`${layout.classes}`}>
                                <Field
                                  name={name}
                                  label={label}
                                  placeholder={placeholder}
                                  isRequired={isRequired}
                                  component={component}
                                  maxLength={maxLength}
                                  {...otherProps}
                                />
                              </div>
                            )
                          )}
                        </React.Fragment>
                      </React.Fragment>
                    )}
                    {!!variantsData?.content && CommonUtils.isNonEmptyObject(variantsData?.content) && (
                      <div>
                        <div className="MCP-module-body">
                          <hr className="form-section-separator" />
                          <div className="row-space-between-center">
                            <Heading as="h3">{t('labels.selectVariant')}</Heading>
                            <p className="form-instruction">
                              <span className="required">*</span> {t('labels.required')}
                            </p>
                          </div>
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
                              validateOnChange={(file) => validateFile(t, file, ALLOWED_FILE_TYPE)}
                              onFileChange={(file) => handleOnVariantDocumentChange('variant', file, setFieldValue)}
                              fileTypeText={ALLOWED_FILE_TYPE_TEXT}
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
                          <React.Fragment>
                            <div className="configured-questionnaire-form">
                              <div className="MCP-module-body">
                                <hr className="form-section-separator" />
                                {/* <Heading as="h3">{t('labels.configuredQuestionnaires')}</Heading> */}
                                <QuestionnaireTemplate
                                  onRemoveDocument={handleOnRemoveDocument}
                                  onDocumentChange={handleOnDocumentChange}
                                  config={questionnaireTemplateConfig}
                                  isPreview={false}
                                />
                              </div>
                            </div>
                          </React.Fragment>
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
