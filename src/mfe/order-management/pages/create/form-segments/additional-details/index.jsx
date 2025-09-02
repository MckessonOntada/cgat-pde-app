import { Button, CheckboxGroup, Heading, Loader, RadioGroup, TextError } from '@mckesson/mcp-component-library';
import OrderService from '@src/api/commonService/OrderService';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as InfoIcon } from '@src/assets/svg/info_icon_circle_filled.svg';
import Alert from '@src/components/cgat-alert/Alert';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { FooterContext } from '@src/components/footer/FooterContext';
import Components from '@src/components/form/Components';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import useResponsiveView from '@src/hooks/useResponsiveView';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { LANGUAGE, QUESTION_TYPE } from '@src/mfe/core-config/system-admin/manage-questionnaire/AddQuestionnaire';
import QuestionnaireTemplate from '@src/mfe/core-config/system-admin/manage-questionnaire/QuestionnaireTemplate';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { RoutePaths } from '@src/routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { Field, Form, Formik, useFormikContext } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { ORDER_STATUS } from '../../../orders/config';
import useOrder from '../../../orders/useOrder';
import { CHANNEL_TYPE, ORDER_STAGES } from '../Constants';
import ManufacturerLogo from '../ManufacturerLogo';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { ALLOWED_FILE_TYPE, ALLOWED_FILE_TYPE_TEXT } from './constants';
import { getClinicalDetailFields, getDefaultAdditionalDetailsFields, getPrescriptionDetailsFields, getPrescriptionDetailsSummaryFieldsConfig } from './fields';
import { useOrderPrice } from './useOrderPrice';
import Collaborator from '../Collaborator';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import { NotifyAlert, showSaveAsDraftConfirm } from '../OrderUtil';
import OrderAttestation from '../OrderAttestation';
import { showAlert } from '@src/store/reducer/alertReducer';
import { useDispatch } from 'react-redux';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { openModal } from '@src/store/reducer/modalReducer';

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  dateOfAdministration: '',
  hasAllergies: '',
  allergyDetails: '',
  diagnosisCode: [],
  variant: {
    variant: '',
    variantDescription: '',
    productLevelPricing: false
  },
  variantAcknowledgement: false
};

function AdditionalDetails({ readOnly, hasPermission }) {
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
  const [variant, setVariant] = React.useState();
  const [alert, setAlert] = React.useState(null);
  const { data: orderDetails = {}, isFetching, refetch: refreshOrderDetails } = useOrder(orderId);
  const { tradeDetails = {}, therapyConfig = {}, channelType = CHANNEL_TYPE.BUY_AND_BILL, patientDetailsRequired } = orderDetails || {};
  const therapyId = orderDetails.therapy?.materialNumber;
  const soldToAccountId = orderDetails.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails.accountDetails?.shipToAccount?.accountNumber;
  const therapyChannelType = orderDetails.therapy?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const [diagnosisCode, setDiagnosisCode] = React.useState([]);
  const [diagnosisSearchQuery, setDiagnosisSearchQuery] = React.useState('');
  const isSPCrossWalked = therapyChannelType === CHANNEL_TYPE.BUY_AND_BILL && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const isSPNonCrossWalked = therapyChannelType === CHANNEL_TYPE.SPECIALTY_PHARMA && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const [isSelfAttested, setIsSelfAttested] = React.useState(false);
  const dispatch = useDispatch();

  const handleConfirmChange = (checked) => {
    setIsSelfAttested(checked);
  };
  React.useEffect(() => {
    const stage = orderDetails?.currentStage;
    if (stage == null) {
      setIsSelfAttested(false);
    } else if (stage !== ORDER_STAGES.ADDITIONAL_DETAILS) {
      setIsSelfAttested(true);
    } else {
      setIsSelfAttested(isSelfAttested);
    }
  }, [orderDetails?.currentStage]);

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

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    const prevSearch = locationState.__prevSearch || '';
    if (isPapOrder) navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

  const initialValidationSchema = (isVariantRequired, channelType) => {
    let schema = Yup.object({
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
          terms: Yup.boolean().oneOf([true], t('message.additionalDetails.terms')),
          acknowledgement: Yup.boolean().oneOf([true], 'You must acknowledge'),
          diagnosisCode: Yup.array()
            .of(Yup.object().required(t('labels.diagnosisCodeRequired')))
            .min(1, 'Select at least on diagnosis code')
            .required('Diagnosis code is required'),
          hasAllergies: Yup.string().required(t('labels.selectHaveAllergies')).oneOf(['yes', 'no'], t('labels.invalidSelection')),

          allergyDetails: Yup.string().when('hasAllergies', {
            is: (val) => val === 'yes',
            then: (schema) => schema.required(t('labels.allergiesDetailsRequired')),
            otherwise: (schema) => schema.notRequired()
          })
        })
      );
    } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      schema = schema.concat(
        Yup.object({
          dateOfAdministration: Yup.date()
            .typeError(t('labels.enterValidDateOfAdministration'))
            .min(new Date(), t('labels.dateOfAdministrationFutureDateOnly'))
            .when([], {
              is: () => therapyConfig.isDOARequired,
              then: (schema) => schema.required(t('labels.enterValidDateOfAdministration')),
              otherwise: (schema) => schema.notRequired()
            }),
          coiId: Yup.string()
            .matches(ALPHA_NUMERIC_ONLY, t('labels.COI_IdMustValidNumber'))
            .max(10, t('labels.COI_IdExceedDigits'))
            .when([], {
              is: () => therapyConfig.isCoiIdRequired,
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
            .trim(t('labels.slotNumberExtraSpaceError')),
          poNumber: Yup.string()
            .matches(ALPHA_NUMERIC_ONLY, t('labels.poNumberMustValid'))
            .max(35, t('labels.PONumberLengthError'))
            .test('no-leading-trailing-spaces', t('labels.poNumberExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
            .when([], {
              is: () => therapyConfig.isPORequired,
              then: (schema) => schema.required(t('labels.PONumberRequired')),
              otherwise: (schema) => schema.notRequired()
            })
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

  const navigateToNextStage = (id, changeOnPreviousStep) => {
    navigate(`${RoutePaths.pathOrderManagement}/${id}/summary`, {
      state: {
        ...locationState,
        isEdit: isEdit,
        isApprover: isApprover,
        changeOnPreviousStep
      }
    });
  };

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async ({ isDraft, isAttested, ...data }) => OrderService.saveAdditionalDetails(orderId, data, isDraft),
    {
      onSuccess: (result, variables) => {
        const { id } = result; 
        if (isSelfAttested || variables?.isAttested) {
          navigateToNextStage(id); 
        } else {
          refreshOrderDetails();
          setAlert({
            description: 'Order Saved In Draft Successfully',
            type: 'success'
          });
        }
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

  useEffect(() => {
    if (alertState) {
      setAlert({ ...alertState });
    }
    return () => {
      dispatch(hasUnsavedChanges(false));
    };
  }, []);

  const prepareQuestionnaire = (result) => {
    setQuestionnaireTemplateConfig(result);
    if (!result || !Array.isArray(result)) {
      throw new Error('Not a valid questionnaire config');
    }

    const questionnaireFields = {};
    const validationSchemaFields = {};

    result.forEach((template) => {
      template.sectionsDetails.forEach((section, sectionIndex) => {
        section.questions.forEach((question) => {
          const fieldName = CommonUtils.generateUniqueCode(`${template.id}-${sectionIndex}#${question.text[LANGUAGE.ENGLISH]}`);
          questionnaireFields[fieldName] = {
            value: question.value
          };

          if (question.isDocumentRequired && question.document) {
            questionnaireFields[fieldName].document = question.document;
          }

          validationSchemaFields[fieldName] = Yup.object({
            value: [QUESTION_TYPE.INPUT, QUESTION_TYPE.DROPDOWN].includes(question.type)
              ? question.isMandatory
                ? Yup.string().required('Value is required')
                : Yup.string().nullable()
              : question.type === QUESTION_TYPE.RADIO_BUTTON
              ? question.isMandatory
                ? Yup.string().required('Select at least one option')
                : Yup.string().nullable()
              : question.type === QUESTION_TYPE.DATE_PICKER
              ? question.isMandatory
                ? Yup.date().required('Date is required')
                : Yup.date().nullable()
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
      fields: questionnaireFields
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
        file,
        channelType
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
        file,
        channelType
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
    if (orderDetails) {
      const { changeOnPreviousStep = false } = location.state;

      if (changeOnPreviousStep && !hasPermission) {
        let message = '';

        if (orderDetails.channelType === CHANNEL_TYPE.BUY_AND_BILL && !orderDetails.patientDetailsRequired) {
          message = 'message.stepSuccessfulCompletionAlert.accountSelection2';
        } else {
          message = 'message.stepSuccessfulCompletionAlert.patientDetails';
        }
        const { changeOnPreviousStep, ...newState } = location.state;
        navigate(location.pathname, { state: newState });
        const state = {};
        state.title = 'Alert';
        state.body = (
          <div className="MCP-modal-body">
            <p>{t(message)}</p>
          </div>
        );
        dispatch(openModal(state));
      }
    }
  }, [orderDetails]);

  React.useEffect(() => {
    const { additionalDetails, spTherapyConfig, therapy } = orderDetails || {};
    const initialValues = {};

    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && spTherapyConfig) {
      Object.assign(initialValues, {
        drugName: therapy?.materialDescription,
        strength: spTherapyConfig.strength,
        daysSupply: spTherapyConfig.daysSupply,
        quantity: spTherapyConfig.quantity,
        refills: spTherapyConfig.refills,
        instructions: spTherapyConfig.instructions,
        terms: false,
        consentPolicy: spTherapyConfig.consentPolicy,
        acknowledgement: false
      });
    }

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
        clinicalDetails = {}
      } = additionalDetails;

      if (variantDetails) {
        const { variantDocumentPath, ...otherDetails } = variantDetails;

        initialValues.variant = {
          ...otherDetails
        };
        try {
          const parsedVariantDocumentDetails = JSON.parse(variantDocumentPath);
          initialValues.document = parsedVariantDocumentDetails;
        } catch (error) {
          initialValues.document = undefined;
        }
      }

      initialValues.poNumber = poNumber;
      initialValues.variantAcknowledgement = patientConsentTaken;

      if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
        Object.assign(initialValues, {
          allergyDetails: clinicalDetails.allergiesSpecification,
          dateOfAdministration: clinicalDetails.dateOfAdministration,
          hasAllergies: clinicalDetails.hasAllergies ? 'yes' : 'no',
          diagnosisCode: []
        });

        if (typeof diagnosisCode === 'string') {
          try {
            initialValues.diagnosisCode = JSON.parse(diagnosisCode);
          } catch {
            initialValues.diagnosisCode = [];
          }
        }
      } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
        Object.assign(initialValues, {
          dateOfAdministration,
          coiId,
          orderQuantity,
          slotNumber
        });
      }

      if (configuredQuestionnaires) {
        prepareQuestionnaire(configuredQuestionnaires);
      }

      setStoredValue((prev) => ({
        ...prev,
        ...initialValues
      }));

      if (variantsData?.content && variantDetails) {
        const targetVariant = variantsData.content.find((v) => variantDetails.variant === v.variant);

        setVariant({ ...targetVariant });
        setVariantAcknowledgement((prev) => ({
          ...prev,
          isChecked: patientConsentTaken
        }));
      }
    }

    setInitialFormValues((prev) => ({
      ...prev,
      ...initialValues
    }));
  }, [orderDetails, variantsData]);

  React.useEffect(() => {
    setAlert(null);
    if (variant) {
      OrderService.getPrescriptionDetailsByTherapy(variant.therapyId).then((result) => {
        const { spTherapyConfig, therapy } = result;
        const prescriptionDetails = {
          drugName: '',
          daysSupply: '',
          quantity: '',
          refills: '',
          instructions: '',
          consentPolicy: '',
          terms: false,
          acknowledgement: false
        };

        if (CommonUtils.isNonEmptyObject(spTherapyConfig)) {
          prescriptionDetails.drugName = therapy?.materialDescription;
          prescriptionDetails.daysSupply = spTherapyConfig.daysSupply;
          prescriptionDetails.quantity = spTherapyConfig.quantity;
          prescriptionDetails.refills = spTherapyConfig.refills;
          prescriptionDetails.instructions = spTherapyConfig.instructions;
          prescriptionDetails.consentPolicy = spTherapyConfig.consentPolicy;
        }

        if (!spTherapyConfig || !spTherapyConfig.consentPolicy) {
          setAlert({
            type: 'error',
            description: t('message.additionalDetails.missingPrescriptionDetails')
          });
        }

        setStoredValue((pre) => ({ ...pre, ...prescriptionDetails }));
        setInitialFormValues({
          ...storedValue,
          ...prescriptionDetails
        });
      });
    }
  }, [variant]);

  React.useEffect(() => {
    if (variantsData && orderDetails) {
      if (Array.isArray(variantsData) && variantsData.length === 0 && CommonUtils.isNonEmptyObject(orderDetails)) {
        showAlert({
          type: 'error',
          description: t('message.additionalDetails.missingPrescriptionDetails')
        });
      } else if (!orderDetails.spTherapyConfig || !orderDetails.spTherapyConfig?.consentPolicy) {
        showAlert({
          type: 'error',
          description: t('message.additionalDetails.missingPrescriptionDetails')
        });
      }
    }
  }, [variantsData, orderDetails]);

  React.useEffect(() => {
    OrderService.getDiagnosisCodes(diagnosisSearchQuery).then((result) => {
      if (result.content && CommonUtils.isNonEmptyArray(result.content)) {
        setDiagnosisCode(
          result.content.map((item) => ({
            code: item.code,
            description: item.longDescription
          }))
        );
      }
    });
  }, [diagnosisSearchQuery]);

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

    const { coiId, orderQuantity, slotNumber, poNumber, dateOfAdministration, diagnosisCode } = values;
    questionnaireTemplateConfig.forEach((template) => {
      if (!template.sectionsDetails) return;

      template.sectionsDetails.forEach((section, sectionIndex) => {
        section.questions.forEach((question) => {
          const fieldName = CommonUtils.generateUniqueCode(`${template.id}-${sectionIndex}#${question.text[LANGUAGE.ENGLISH]}`);
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
      const { hasAllergies, allergyDetails, dateOfAdministration } = values;
      const clinicalDetails = {
        hasAllergies: hasAllergies === 'yes'
      };

      if (hasAllergies === 'yes') {
        clinicalDetails.allergiesSpecification = allergyDetails;
      }

      if (dateOfAdministration) {
        clinicalDetails.dateOfAdministration = dateOfAdministration;
      }

      payload.clinicalDetails = clinicalDetails;
      payload.diagnosisCode = JSON.stringify(
        diagnosisCode.map((item) => ({
          code: item.code,
          description: item.description
        }))
      );
    } else {
      payload.coiId = coiId;
      payload.orderQuantity = orderQuantity;
      payload.slotNumber = slotNumber;
      payload.dateOfAdministration = dateOfAdministration;
    }

    if (!isSelfAttested) {
      showSaveAsDraftConfirm({
        t,
        onOk: () => {
          const draftPayload = { ...payload, isDraft: true };
          saveAdditionalDetails(draftPayload);
        },
        onContinue: () => {
          const attestationPayload = { ...payload, isAttested: true };
          saveAdditionalDetails(attestationPayload);
        }
      });
    } else {
      if (isDirty) {
        saveAdditionalDetails(payload);
      } else {
        navigateToNextStage(orderId);
      }
      dispatch(hasUnsavedChanges(false));
    }
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

  if (isSaving || isFetching) return <Loader type={'screen'} />;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
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
            {orderDetails?.collaborators && <Collaborator collaborators={orderDetails?.collaborators} channelType={orderDetails.channelType} />}
            {orderDetails?.therapy?.manufacturerName ? <ManufacturerLogo therapyId={orderDetails.therapy?.id} /> : null}
          </div>
        }
      />

      <div className="MCP-module-body">
        <OrderStepper patientDetailsRequired={patientDetailsRequired} status={orderDetails?.currentStage} channelType={orderDetails.channelType} />
        {readOnly && (
          <NotifyAlert
            OnEdit={readOnly && orderDetails?.currentStage !== ORDER_STAGES.ADDITIONAL_DETAILS ? true : false}
            stage={ORDER_STAGES.ADDITIONAL_DETAILS}
            orderId={orderId}
            setAlert={setAlert}
            patientDetailsRequired={patientDetailsRequired}
          />
        )}
        <OrderHeaderDetails orderDetails={orderDetails} priceDetails={priceDetails} channelType={orderDetails.channelType} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <Formik
          initialValues={initialFormValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onError={console.log}
          validationContext={{ ...therapyConfig }}
          onSubmit={(values) => {
            handleOnSubmit(values);
          }}>
          {({ dirty, values, errors, touched }) => {
            React.useEffect(() => {
              const isAnyFieldTouched = Object.keys(touched).length > 0;
              dispatch(hasUnsavedChanges(isAnyFieldTouched && dirty));
            }, [touched]);

            useEffect(() => {
              setIsDirty(dirty);
              setStoredValue(values);
              dispatch(hasUnsavedChanges(dirty));
              if (dirty) {
                setIsSelfAttested(false);
              }
            }, [dirty, values]);

            return (
              <Form>
                <div className="MCP-module-body">
                  <fieldset className="MCP-fieldset" disabled={readOnly}>
                    <div className="MCP-panel-container">
                      <ModuleHeader
                        heading={<Heading as="h2">{t('labels.additionalDetails')}</Heading>}
                        controls={
                          <p className="form-instruction">
                            <span className="required">*</span> {t('labels.required')}
                          </p>
                        }
                      />
                      <div className="form-segment-list">
                        <AdditionalDetailsDefaultFields therapyConfig={therapyConfig} channelType={channelType} readOnly={readOnly} />

                        <VariantDetails
                          variantAcknowledgement={variantAcknowledgement}
                          handleOnAcknowledgmentChange={handleOnAcknowledgmentChange}
                          variantsData={variantsData}
                          channelType={channelType}
                          variant={variant}
                          handleOnVariantChange={handleOnVariantChange}
                          handleOnVariantDocumentChange={handleOnVariantDocumentChange}
                          readOnly={readOnly}
                        />

                        <ClinicalDetails
                          channelType={channelType}
                          onDiagnosisCodeSearch={setDiagnosisSearchQuery}
                          diagnosisCode={diagnosisCode}
                          readOnly={readOnly}
                        />

                        <PrescriptionDetails channelType={channelType} readOnly={readOnly} />

                        <QuestionnaireDetails
                          isLoading={isFetchingConfiguredQuestions}
                          onRemoveDocument={handleOnRemoveDocument}
                          onDocumentChange={handleOnDocumentChange}
                          config={questionnaireTemplateConfig}
                          questionnaireTemplateConfig={questionnaireTemplateConfig}
                          readOnly={readOnly}
                        />
                      </div>
                    </div>
                    <OrderAttestation stage={ORDER_STAGES?.ADDITIONAL_DETAILS} onCheck={handleConfirmChange} isChecked={isSelfAttested} />
                  </fieldset>
                  <div className="footer-wrapper" ref={controlRef}>
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBack}>
                        {t('captions.btnBack')}
                      </Button>
                      <Button
                        size="md"
                        disabled={(channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && !initialFormValues.consentPolicy) || readOnly}
                        variant="primary"
                        type="submit">
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

const QuestionnaireDetails = ({ isLoading, questionnaireTemplateConfig, onRemoveDocument, onDocumentChange, readOnly }) => {
  if (isLoading)
    return (
      <div>
        <Loader variant="circular" />
      </div>
    );
  if ((!isLoading && !questionnaireTemplateConfig) || !CommonUtils.isNonEmptyArray(questionnaireTemplateConfig)) return null;

  return (
    <div className="form-segment configured-questionnaire-form">
      <div className="MCP-module-body">
        <div className="">
          <QuestionnaireTemplate
            onRemoveDocument={onRemoveDocument}
            onDocumentChange={onDocumentChange}
            config={questionnaireTemplateConfig}
            isPreview={false}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
};

const VariantTable = ({ variant, onChange, data, readOnly }) => {
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
                isDisabled: readOnly || false,
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

const AdditionalDetailsDefaultFields = ({ therapyConfig, channelType, readOnly }) => {
  const { t } = useTranslate();
  const { setFieldValue } = useFormikContext();
  const defaultFields = getDefaultAdditionalDetailsFields({ translationFn: t, therapyConfig, channelType, setFieldValue });

  if (CommonUtils.isEmptyArray(defaultFields)) return null;

  return (
    <div className="form-segment ">
      <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
        {defaultFields.map(({ name, label, placeholder, isRequired, component, maxLength, ...otherProps }, index) => (
          <Field
            key={index}
            name={name}
            label={label}
            placeholder={placeholder}
            isRequired={isRequired}
            component={component}
            maxLength={maxLength}
            readOnly={readOnly}
            isDisabled={readOnly}
            {...otherProps}
          />
        ))}
      </div>
    </div>
  );
};

const ClinicalDetails = ({ channelType, onDiagnosisCodeSearch, diagnosisCode, readOnly }) => {
  const { values, setFieldValue } = useFormikContext();
  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) return null;
  const { t } = useTranslate();
  const fields = getClinicalDetailFields({
    translationFn: t,
    formValues: values,
    setFieldValue,
    onDiagnosisCodeSearch,
    diagnosisCode
  });
  if (CommonUtils.isEmptyArray(fields)) return null;
  return (
    <FormSectionWrapper title={t('labels.clinicalDetails')} isRequired={true}>
      {fields.map(({ name, label, placeholder, isRequired, component, maxLength, layout = {}, ...otherProps }, index) => (
        <div key={index} className={`${layout.classes}`}>
          <Field
            name={name}
            label={label}
            placeholder={placeholder}
            isRequired={isRequired}
            component={component}
            maxLength={maxLength}
            isDisabled={readOnly}
            {...otherProps}
          />
        </div>
      ))}
    </FormSectionWrapper>
  );
};

const PrescriptionDetails = ({ channelType, readOnly }) => {
  if (channelType === CHANNEL_TYPE.BUY_AND_BILL) return null;
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const { t } = useTranslate();
  const fields = getPrescriptionDetailsFields({
    translationFn: t,
    formValues: values,
    setFieldValue,
    setFieldTouched,
    readOnly
  });
  if (CommonUtils.isEmptyArray(fields)) return null;
  return (
    <FormSectionWrapper title={t('Prescription Details')} isRequired={true}>
      <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-baseline">
        {fields.map(({ name, label, placeholder, isRequired, component, maxLength, ...otherProps }, index) => (
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
        ))}
      </div>
      <FormRenderer sections={getPrescriptionDetailsSummaryFieldsConfig({ translationFn: t, formValues: values, setFieldValue })} />
    </FormSectionWrapper>
  );
};

const VariantDetails = ({
  variantsData,
  variantAcknowledgement,
  handleOnVariantDocumentChange,
  handleOnAcknowledgmentChange,
  variant,
  handleOnVariantChange,
  readOnly
}) => {
  const { t } = useTranslate();
  const { setErrors, errors, touched, values, setFieldTouched, setFieldValue } = useFormikContext();
  if (!variantsData?.content || !CommonUtils.isNonEmptyObject(variantsData.content)) return null;

  return (
    <FormSectionWrapper title={t('labels.selectVariant')} isRequired={true}>
      <div>
        <VariantTable
          variant={variant}
          onChange={(variant) => handleOnVariantChange(variant, setErrors, errors, setFieldValue, setFieldTouched)}
          data={variantsData.content}
          readOnly={readOnly}
        />
        {touched?.variant && !values.variant && <TextError errorMessage={errors.variant.variant} showErrorIcon={true} />}
      </div>
      <div className="agreement-checkbox-control">
        <Field name="variant-acknowledgement">
          {() => (
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
    </FormSectionWrapper>
  );
};

const FormSectionWrapper = ({ title, isRequired, children }) => {
  const { t } = useTranslate();
  return (
    <div className="form-segment MCP-module-body">
      <div className="row-space-between-center">
        <Heading as="h3">{title}</Heading>
        <p className="form-instruction">
          {isRequired && (
            <React.Fragment>
              <span className="required">*</span> {t('labels.required')}
            </React.Fragment>
          )}
        </p>
      </div>
      {children}
    </div>
  );
};

export default withPermissions(AdditionalDetails, ORDER_STAGES.ADDITIONAL_DETAILS);
