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
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import useResponsiveView from '@src/hooks/useResponsiveView';
import FormRenderer from '@src/mfe/core-config/admin/manage-providers/forms/FormRenderer';
import { LANGUAGE, QUESTION_TYPE } from '@src/mfe/core-config/system-admin/manage-questionnaire/AddQuestionnaire';
import QuestionnaireTemplate from '@src/mfe/core-config/system-admin/manage-questionnaire/QuestionnaireTemplate';
import withPermissions from '@src/mfe/order-management/routes/OrderPermissions';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { RoutePaths } from '@src/routes/constants';
import { openModal } from '@src/store/reducer/modalReducer';
import { hasUnsavedChanges } from '@src/store/reducer/orderReducer';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { Field, Form, Formik, useFormikContext } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { ORDER_STATUS } from '../../../orders/config';
import Collaborator from '../Collaborator';
import { CHANNEL_TYPE, MANUFACTURER, ORDER_STAGES } from '../Constants';
import ManufacturerLogo from '../ManufacturerLogo';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import {
  getManufacturer,
  NotifyAlert,
  getValueWIthoutPrefixAndSuffix,
  updateAdditionalDetailsValues,
  normalizeOrderResponse,
  getOrderStepCaption
} from '../OrderUtil';
import { ALLOWED_FILE_TYPE, ALLOWED_FILE_TYPE_TEXT } from './constants';
import {
  getClinicalDetailFields,
  getDefaultAdditionalDetailsFields,
  getPrescriptionDetailsFields,
  getPrescriptionDetailsSummaryFieldsConfig,
  getShipmentInformationForm
} from './fields';
import { useOrderPrice } from './useOrderPrice';
import { scrollToTopUtil } from '@src/components/scrollToTop/scrollUtils';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import { useWidgetContext } from '@src/context/WidgetContext';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  shipToPONumber: '',
  dateOfAdministration: '',
  dateOfApheresis: '',
  timeOfApheresis: '',
  timeOfAdministration: '',
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
  const { isEdit = false, alertState } = locationState;
  const { orderId } = useParams();
  const [initialFormValues, setInitialFormValues] = React.useState(INITIAL_VALUES);
  const [storedValue, setStoredValue] = useState([]);
  const [validationSchema, setValidationSchema] = React.useState(null);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [skipTerms, setSkipTerms] = React.useState(false);
  const [questionnaireTemplateConfig, setQuestionnaireTemplateConfig] = React.useState(null);
  const [variantAcknowledgement, setVariantAcknowledgement] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.variantAcknowledgement'),
    value: false
  });
  const [variant, setVariant] = React.useState();
  const [alert, setAlert] = React.useState(null);
  const [triageAlert, setTriageAlert] = React.useState(null);
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {}, isApprover } = state;
  const { tradeDetails = {}, spTherapyConfig = {}, therapyConfig = {}, channelType = CHANNEL_TYPE.BUY_AND_BILL, patientDetailsRequired } = orderDetails || {};
  const therapyId = orderDetails.therapy?.materialNumber;
  const soldToAccountId = orderDetails.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails.accountDetails?.shipToAccount?.accountNumber;
  const therapyChannelType = tradeDetails?.channelType || CHANNEL_TYPE.BUY_AND_BILL;
  const [diagnosisCode, setDiagnosisCode] = React.useState([]);
  const [diagnosisSearchQuery, setDiagnosisSearchQuery] = React.useState('');
  const isSPCrossWalked = therapyChannelType === CHANNEL_TYPE.BUY_AND_BILL && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const isSPNonCrossWalked = therapyChannelType === CHANNEL_TYPE.SPECIALTY_PHARMA && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA;
  const isStageInDraft = orderDetails.isDraft;
  const [isOrderInDraft, setIsOrderInDraft] = React.useState(true);
  const [isAllowedToProceed, setIsAllowedToProceed] = React.useState(true);
  const [isEmptyFirstTime, setEmptyFirstTime] = React.useState(true);
  const [isSecondLegShipInfoRequired, setIsSecondLegShipInfoRequired] = React.useState(false);

  const manufacturer = getManufacturer(orderDetails);
  const dispatch = useDispatch();
  const formikRef = React.useRef();

  const variantsApiRequestParam = {
    pageNo: 0,
    pageSize: 10,
    channelType
  };

  const { data: priceDetails = {} } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId,
    ...(variant && { variant: variant.variant }),
    channelType: orderDetails?.therapy?.channelType,
    trade: {
      ndc: orderDetails?.therapy?.ndcNumber
    }
  });

  React.useEffect(() => {
    if (orderDetails.id) {
      setIsSecondLegShipInfoRequired(orderDetails.therapyConfig?.config?.secondLegShipInfoRequired);

      const prevSearch = locationState.__prevSearch || '';
      if (orderDetails.isPapOrder) navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
      if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
    }
  }, [orderDetails]);

  const initialValidationSchema = ({ isVariantRequired, channelType, secondLegShipInfoRequired = false }) => {
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
      const dynamicFields = {};
      therapyConfig?.config?.fields?.forEach((field) => {
        if (field.fieldName !== 'patientIdentifier' && field.fieldName !== 'medicalRecordNumber' && field.properties.displayOnForm) {
          let validator = Yup.string().matches(field.properties.fieldFormat.validationRegex, field.properties.errorMessage);
          if (field.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY') {
            const vf = field.properties.fieldFormat.validationFormat;

            const minMatch = vf.match(/minDate\('([^']+)'\)/);
            const maxMatch = vf.match(/maxDate\('([^']+)'\)/);

            const minDate = minMatch ? minMatch[1] : null;
            const maxDate = maxMatch ? maxMatch[1] : null;

            validator = validator.test('date-range', `Please enter a date between ${minDate} and ${maxDate}.`, (value) => {
              if (!value) return true;

              const toDate = (d) => {
                const [m, day, y] = d.split('/');
                return new Date(`${y}-${m}-${day}`);
              };

              const inputDate = toDate(value);

              if (minDate && inputDate < toDate(minDate)) return false;
              if (maxDate && inputDate > toDate(maxDate)) return false;

              return true;
            });
            validator = validator.test('future-date-only', t('labels.error.selectFutureDate'), (value) => {
              if (!value) return true;

              const [m, d, y] = value.split('/');
              const selectedDate = new Date(y, m - 1, d);

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              return selectedDate >= today;
            });
          }

          if (field.properties.fieldFormat.formatType === 'Integer') {
            const vf = field.properties.fieldFormat.validationFormat || '';

            const minMatch = vf.match(/minValue\('([^']+)'\)/);
            const maxMatch = vf.match(/maxValue\('([^']+)'\)/);

            const minValue = minMatch ? Number(minMatch[1]) : null;
            const maxValue = maxMatch ? Number(maxMatch[1]) : null;

            validator = validator.test('integer-range', field.properties.errorMessage, (value) => {
              if (value === undefined || value === null || value === '') return true;

              const num = Number(value);

              if (Number.isNaN(num)) return false;

              if (minValue !== null && num < minValue) return false;
              if (maxValue !== null && num > maxValue) return false;

              return true;
            });
          }

          validator = validator.when([], {
            is: () => field.properties.mandatoryField,
            then: (s) => s.required(`${field.properties.displayName} is required`),
            otherwise: (s) => s.notRequired()
          });

          dynamicFields[field.fieldName] = validator;
        }
      });
      dynamicFields.orderQuantity = Yup.number()
        .typeError(t('labels.OrderQuantityShouldPositive'))
        .min(1, t('labels.OrderQuantityMin', { min: 1 }))
        .max(99, t('labels.OrderQuantityMax', { max: 99 }))
        .required(t('labels.orderQuantityRequired'))
        .positive(t('labels.OrderQuantityShouldGreaterThanZero'))
        .integer(t('labels.OrderQuantityMustBeInteger'));
      schema = schema.concat(Yup.object().shape(dynamicFields));
    }

    if (secondLegShipInfoRequired) {
      const secondLegShipValidationSchema = Yup.object({
        secondLegShipInfo: Yup.object({
          transactionId: Yup.string(),
          name: Yup.string().required(t('message.nameIsRequired')),
          address: Yup.object({
            address1: Yup.string()
              .required(t('userManagement.create_user.validation.address_1_required'))
              .test('no-leading-trailing-spaces', t('message.noLeadingTrailingSpace'), (value) => value === value?.trim())
              .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
              .min(2, t('userManagement.create_user.validation.address_1'))
              .max(100, t('userManagement.create_user.validation.address_1')),
            address2: Yup.string()
              .test('no-leading-trailing-spaces', t('message.noLeadingTrailingSpace'), (value) => value === value?.trim())
              .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')),
            city: Yup.string()
              .required(t('userManagement.create_user.validation.city_required'))
              .matches(ALPHABETIC_WITH_SPACE, t('userManagement.create_user.validation.city')) // Only alphabets
              .min(2, t('userManagement.create_user.validation.city_min_max'))
              .max(50, t('userManagement.create_user.validation.city_min_max')),
            state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
            zip: Yup.string()
              .required(t('userManagement.create_user.validation.zip_required'))
              .matches(ZIP_REGEX, t('userManagement.create_user.validation.zip')) // Only digits
              .max(10, t('userManagement.create_account.validation.zip_max')),
            country: Yup.string().required(t('userManagement.create_user.validation.state_required'))
          }),
          phoneNumber: Yup.string()
            .required(t('userManagement.create_user.validation.phone_no_required'))
            .matches(PHONE_REGEX, t('userManagement.create_user.validation.phone_no')) // 10 digits only
        })
      });

      schema = schema.concat(secondLegShipValidationSchema);
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
    const updatedValidationSchema = initialValidationSchema({ isVariantRequired, channelType, secondLegShipInfoRequired: isSecondLegShipInfoRequired });

    let questionnaireValidationSchema = Yup.object();
    let questionnaireFields = {};

    if (questionnaireTemplateConfig) {
      const { validationSchema, fields } = prepareQuestionnaire(questionnaireTemplateConfig);
      questionnaireValidationSchema = validationSchema;
      questionnaireFields = fields;
    }

    const finalValidationSchema = updatedValidationSchema.concat(questionnaireValidationSchema);
    setValidationSchema(finalValidationSchema);

    const initialQuantityDetails = {};
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      if (spTherapyConfig.maxQuantity === spTherapyConfig.minQuantity && spTherapyConfig.minQuantity > 0) {
        initialQuantityDetails.orderQuantity = spTherapyConfig.minQuantity;
      }
    } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      if (therapyConfig.maxQuantity === therapyConfig.minQuantity && therapyConfig.minQuantity > 0) {
        initialQuantityDetails.orderQuantity = therapyConfig.minQuantity;
      }
    }

    setInitialFormValues({
      ...formikRef.current?.values,
      ...initialQuantityDetails,
      ...storedValue,
      ...questionnaireFields
    });
  }, [variantsData, questionnaireTemplateConfig, channelType]);

  const navigateToNextStage = (id) => {
    navigate(`${RoutePaths.pathOrderManagement}/${id}/summary`, {
      state: {
        ...locationState,
        isEdit: isEdit
      }
    });
  };

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async ({ payload, isSendNotification, isSavingAsDraft }) => OrderService.saveAdditionalDetails(orderId, payload, isSavingAsDraft, isSendNotification),
    {
      onSuccess: (result, variables) => {
        const { id } = result;
        const beautifiedOrderDetails = normalizeOrderResponse(result);
        setValue('orderDetails', beautifiedOrderDetails);
        if (!variables?.isSavingAsDraft) {
          setValue('isChangeOnPreviousStep', true);
          navigateToNextStage(id);
        } else {
          setIsDirty(false);
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
  }, [location]);

  const prepareQuestionnaire = (result) => {
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
            value: question.value ?? ''
            // ...(question.isDocumentRequired ? { document: question.document ?? null } : {})
          };

          if (question.isDocumentRequired && question.document) {
            questionnaireFields[fieldName].document = question.document ?? null;
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
      validationSchema: Yup.object().shape(validationSchemaFields),
      fields: questionnaireFields
    };
  };

  const variantType = isSPCrossWalked || isSPNonCrossWalked ? null : variant?.variant;

  const { isFetching: isFetchingConfiguredQuestions, refetch: fetchConfiguredQuestions } = useQuery({
    queryKey: ['configured-questionnaire', orderId, variant ? variant.materialNumber : 'default-variant'],
    queryFn: async () => {
      const { accountDetails, therapy } = orderDetails;
      if (orderDetails.additionalDetails?.configuredQuestionnaires.length > 0) return;

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
    onSuccess: (result = {}) => {
      setQuestionnaireTemplateConfig(result);
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

  const { mutate: uploadDocument } = useMutation(
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

  const { mutate: uploadVariantDocument } = useMutation(
    async ({ file }) => {
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
      const { isChangeOnPreviousStep } = state;

      if (isChangeOnPreviousStep && !hasPermission) {
        navigate(location.pathname, { state: location.state });
        const state = {};
        state.title = t('title.stepSuccessfulCompletionByUnAuthorizedUser');
        state.body = (
          <div className="MCP-modal-body">
            <p>{t('message.stepSuccessfulCompletionByUnAuthorizedUser')}</p>
          </div>
        );
        dispatch(openModal(state));
      }
    }
  }, [orderDetails]);

  React.useEffect(() => {
    if (orderDetails.id) {
      if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && variantsData.content?.length === 0 && !orderDetails.spTherapyConfig?.consentPolicy) {
        setAlert({
          type: 'error',
          description: t('message.additionalDetails.missingPrescriptionDetails')
        });
      }
      if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && variantsData?.content?.length === 0) {
        const diagnosisList = orderDetails?.spTherapyConfig?.diagnosisCodes || [];

        if (diagnosisList.length === 0) {
          setDiagnosisCode([]);
          setTriageAlert({
            type: 'error',
            description: t('message.additionalDetails.diagnosisCodeNotConfigured')
          });
        } else {
          setDiagnosisCode(
            diagnosisList.map((item) => ({
              code: item.code,
              description: item.longDescription
            }))
          );
          setTriageAlert(null);
        }
      }
    }
  }, [orderDetails, variantsData]);

  React.useEffect(() => {
    const { additionalDetails, spTherapyConfig, therapy } = orderDetails || {};
    const initialValues = {};

    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && spTherapyConfig && CommonUtils.isNonEmptyObject(therapy)) {
      Object.assign(initialValues, {
        drugName: therapy?.materialDescription,
        strength: spTherapyConfig.strength,
        daysSupply: spTherapyConfig.daysSupply,
        quantity: spTherapyConfig.quantity,
        orderQuantity: additionalDetails?.orderQuantity,
        refills: spTherapyConfig.refills,
        instructions: spTherapyConfig.instructions,
        terms: false,
        consentPolicy: spTherapyConfig.consentPolicy,
        acknowledgement: false
      });
      if (spTherapyConfig.maxQuantity === spTherapyConfig.minQuantity && spTherapyConfig.minQuantity > 0) {
        initialValues.orderQuantity = spTherapyConfig.minQuantity;
      }
    } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      getValueWIthoutPrefixAndSuffix(initialValues, orderDetails?.therapyConfig?.config?.fields || []);
      if (therapyConfig.maxQuantity === therapyConfig.minQuantity && therapyConfig.minQuantity > 0) {
        initialValues.orderQuantity = therapyConfig.minQuantity;
      }
    }

    if (additionalDetails) {
      const additionalDetailsWithoutPrefixAndSuffix = getValueWIthoutPrefixAndSuffix(additionalDetails, orderDetails?.therapyConfig?.config?.fields || []);
      const {
        dateOfAdministration,
        dateOfApheresis,
        timeOfApheresis,
        timeOfAdministration,
        coiId,
        orderQuantity,
        patientConsentTaken,
        poNumber,
        shipToPONumber,
        slotNumber,
        variantDetails = {},
        configuredQuestionnaires,
        diagnosisCode,
        clinicalDetails = {}
      } = additionalDetailsWithoutPrefixAndSuffix;

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
          allergyDetails: clinicalDetails.allergiesSpecification ?? '',
          dateOfAdministration: clinicalDetails.dateOfAdministration,
          dateOfApheresis: clinicalDetails.dateOfApheresis,
          timeOfApheresis: clinicalDetails.timeOfApheresis || '',
          timeOfAdministration: clinicalDetails.timeOfAdministration || '',
          hasAllergies: clinicalDetails.hasAllergies ? 'yes' : 'no',
          diagnosisCode: []
        });

        if (typeof diagnosisCode === 'string') {
          try {
            const parsedDiagnosisCodes = JSON.parse(diagnosisCode);
            initialValues.diagnosisCode = parsedDiagnosisCodes.map((item) => ({
              label: `${item.code} ${item.description}`,
              value: item.code,
              code: item.code,
              description: item.description,
              isChecked: true
            }));
          } catch {
            initialValues.diagnosisCode = [];
          }
        } else if (Array.isArray(diagnosisCode)) {
          initialValues.diagnosisCode = diagnosisCode.map((item) => ({
            label: `${item.code} ${item.description}`,
            value: item.code,
            code: item.code,
            description: item.description,
            isChecked: true
          }));
        }
      } else if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
        Object.assign(initialValues, {
          dateOfAdministration,
          dateOfApheresis,
          timeOfApheresis,
          timeOfAdministration,
          coiId,
          orderQuantity,
          slotNumber,
          shipToPONumber
        });
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
    const secondLegShipInfo = orderDetails.additionalDetails?.secondLegShipInfo || {};
    if (isSecondLegShipInfoRequired) {
      initialValues.secondLegShipInfo = {
        transactionId: secondLegShipInfo.transactionId || '',
        name: secondLegShipInfo.name || '',
        address: {
          address1: secondLegShipInfo.address?.address1 || '',
          address2: secondLegShipInfo.address?.address2 || '',
          zip: secondLegShipInfo.address?.zip || '',
          state: secondLegShipInfo.address?.state || '',
          city: secondLegShipInfo.address?.city || '',
          country: secondLegShipInfo.address?.country || 'USA'
        },
        phoneNumber: secondLegShipInfo.phoneNumber || ''
      };
    }

    setInitialFormValues((prev) => ({
      ...prev,
      ...initialValues
    }));
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
          isEdit: isEdit
        }
      });
    } else {
      if (orderDetails?.patientDetailsRequired) {
        const targetPage = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'payer' : 'patient';
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/${targetPage}`, {
          state: {
            ...locationState,
            isEdit: false
          }
        });
      } else {
        navigate(`${RoutePaths.pathOrderManagement}/${orderId}/accounts`, {
          state: {
            ...locationState,
            isEdit: false
          }
        });
      }
    }
  };

  const handleOnSubmit = (values, isSavingAsDraft) => {
    setIsOrderInDraft(isSavingAsDraft);
    if (channelType !== CHANNEL_TYPE.SPECIALTY_PHARMA && manufacturer === MANUFACTURER.REGENERON && !values?.coiId && isEmptyFirstTime) {
      setAlert({
        description: t('orderManagement.coiId.empty', {
          coiId: getDisplayNameByFieldName('coiId')
        }),
        type: 'warning'
      });
      setEmptyFirstTime(false);
      scrollToTopUtil();
      return;
    }
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

    const {
      coiId,
      orderQuantity,
      slotNumber,
      poNumber,
      dateOfAdministration,
      dateOfApheresis,
      diagnosisCode,
      shipToPONumber,
      timeOfAdministration,
      timeOfApheresis
    } = values;
    let orderQuantityConfig = {};
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      orderQuantityConfig = therapyConfig;
    } else if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      orderQuantityConfig = spTherapyConfig;
    }
    if (orderQuantity) {
      const minQty = orderQuantityConfig.minQuantity ?? 1;
      const maxQty = orderQuantityConfig.maxQuantity ?? 99;

      if (orderQuantity < minQty || orderQuantity > maxQty) {
        setAlert({
          type: 'error',
          description: `${t('additional.details.order.quantity.error')} ${minQty} and ${maxQty}.`
        });

        return;
      }
    }

    questionnaireTemplateConfig.forEach((template) => {
      if (!template.sectionsDetails) return;

      template.sectionsDetails.forEach((section, sectionIndex) => {
        section.questions.forEach((question) => {
          const fieldName = CommonUtils.generateUniqueCode(`${template.id}-${sectionIndex}#${question.text[LANGUAGE.ENGLISH]}`);
          const fieldValue = values[fieldName];
          if (!fieldName) return;

          question.value = fieldValue?.value;
          question.document = fieldValue?.document;
        });
      });
    });

    const payload = {
      poNumber,
      variantDetails: variantDetails,
      patientConsentTaken: !!variant ? variantDetails.variantAcknowledgment : false,
      configuredQuestionnaires: questionnaireTemplateConfig
    };

    if (isSecondLegShipInfoRequired) {
      payload.secondLegShipInfo = values.secondLegShipInfo;
    }

    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      const { hasAllergies, allergyDetails, dateOfAdministration, dateOfApheresis } = values;
      const clinicalDetails = {
        hasAllergies: hasAllergies === 'yes'
      };

      if (hasAllergies === 'yes') {
        clinicalDetails.allergiesSpecification = allergyDetails;
      }

      if (dateOfAdministration) {
        clinicalDetails.dateOfAdministration = dateOfAdministration;
      }

      if (dateOfApheresis) {
        clinicalDetails.dateOfApheresis = dateOfApheresis;
      }

      payload.clinicalDetails = clinicalDetails;
      payload.orderQuantity = orderQuantity;
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
      payload.shipToPONumber = shipToPONumber;
      payload.dateOfAdministration = dateOfAdministration;
      payload.dateOfApheresis = dateOfApheresis;
      payload.timeOfAdministration = timeOfAdministration;
      payload.timeOfApheresis = timeOfApheresis;
    }
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      updateAdditionalDetailsValues(payload, orderDetails?.therapyConfig?.config?.fields || []);
    }
    if (skipTerms && channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      if (isStageInDraft) {
        saveAdditionalDetails({ payload, isSendNotification: isSavingAsDraft, isSavingAsDraft });
      } else {
        saveAdditionalDetails({ payload, isSendNotification: false, isSavingAsDraft });
      }
    } else if (isDirty || isStageInDraft) {
      saveAdditionalDetails({ payload, isSendNotification: isSavingAsDraft, isSavingAsDraft });
    } else if (!isDirty && !isStageInDraft) {
      if (orderDetails?.currentStage === ORDER_STAGES.ADDITIONAL_DETAILS) {
        saveAdditionalDetails({ payload, isSendNotification: false, isSavingAsDraft });
      } else {
        navigateToNextStage(orderId);
      }
    }
    dispatch(hasUnsavedChanges(false));
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
          isEdit: isEdit
        }
      });
    } else if (modalSuccessCallback === 'patient') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/patient`, {
        state: {
          ...locationState,
          isEdit: false
        }
      });
    } else if (modalSuccessCallback === 'account') {
      navigate(`${RoutePaths.pathOrderManagement}/${orderId}/accounts`, {
        state: {
          ...locationState,
          isEdit: false
        }
      });
    }
  };

  const handleOnVariantChange = (variant, setFieldValue) => {
    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) {
      if (variant.diagnosisCodes && variant.diagnosisCodes.length > 0) {
        setDiagnosisCode(
          variant?.diagnosisCodes?.map((item) => ({
            code: item.code,
            description: item.longDescription
          }))
        );
        setTriageAlert(null);
      } else {
        setDiagnosisCode([]);
        setTriageAlert({
          type: 'error',
          description: t('message.additionalDetails.diagnosisCodeNotConfigured')
        });
      }
    }

    setVariantAcknowledgement((prevState) => ({
      ...prevState,
      isChecked: false
    }));

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
      if (isSPCrossWalked && !['SP', 'HUB'].includes(spTherapyConfig?.config?.triageChannel)) {
        setIsAllowedToProceed(false);
        setTriageAlert({
          description: t('message.triageChannelConfigMissing'),
          type: 'error'
        });
      }

      setStoredValue((pre) => {
        const updated = { ...pre, ...prescriptionDetails };
        return updated;
      });
      setFieldValue('drugName', prescriptionDetails.drugName);
      setFieldValue('daysSupply', prescriptionDetails.daysSupply, false);
      setFieldValue('quantity', prescriptionDetails.quantity, false);
      setFieldValue('refills', prescriptionDetails.refills, false);
      setFieldValue('instructions', prescriptionDetails.instructions, false);
      setFieldValue('consentPolicy', prescriptionDetails.consentPolicy, false);
    });
    setVariant(variant);
  };

  React.useEffect(() => {
    if (orderDetails.id) {
      const { additionalDetails, accountDetails } = orderDetails || {};
      const { soldToAccount, shipToAccount } = accountDetails || {};

      if (!soldToAccount || !shipToAccount) return;

      const canProceed = !isSPCrossWalked || (isSPCrossWalked && variant);

      if (!canProceed) return;

      const configuredQuestionnaires = additionalDetails?.configuredQuestionnaires;

      if (configuredQuestionnaires?.length > 0) {
        setQuestionnaireTemplateConfig(configuredQuestionnaires);
      } else {
        fetchConfiguredQuestions();
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

  const isValidToSaveAsDraft = (values, errors, touched, setTouched, setErrors) => {
    setIsOrderInDraft(true);
    let allValid = true;
    const newTouched = { ...touched };
    const newErrors = { ...errors };

    const traverse = (valObj, errObj, touchObj, errAcc) => {
      Object.keys(valObj).forEach((key) => {
        const value = valObj[key];
        const error = errObj?.[key];

        if (key === 'variantAcknowledgement' || key === 'variant' || key === 'terms' || key === 'acknowledgement' || key === 'diagnosisCode') {
          touchObj[key] = false;
          errAcc[key] = '';
          return;
        }

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

  const { mutate: coiIdValidation, isLoading: isCoiIdValidationLoading } = useMutation(
    async ({ patientId, coiId }) => {
      const res = await OrderService.regeneronCoiIdVerification(patientId, coiId);
      return res.data;
    },
    {
      onSuccess: (res) => {
        if (res) {
          setAlert({
            description: t('orderManagement.coiId.valid', { coiId: getDisplayNameByFieldName('coiId') }),
            type: 'success'
          });
        } else {
          setAlert({
            description: t('orderManagement.coiId.verification', { coiId: getDisplayNameByFieldName('coiId') }),
            type: 'warning'
          });
        }
      },
      onError: () => {
        setAlert({
          type: 'error',
          description: t('errors.default')
        });
      }
    }
  );

  const formatFieldWithPrefixSuffix = (value, fieldName) => {
    if (!value) return;
    const config =
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    const regexFormat = config?.find((f) => f.fieldName === fieldName)?.properties?.fieldFormat?.validationFormat;
    const prefix = regexFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = regexFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
    return `${prefix ?? ''}${value}${suffix ?? ''}`;
  };

  const getDisplayNameByFieldName = (fieldName) => {
    const materialConfig =
      orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;
    return materialConfig?.find((field) => field.fieldName === fieldName)?.properties?.displayName || '';
  };

  const handleCoiIdValidation = (e, setFieldTouched, errors) => {
    const { id, value } = e.target;
    const fieldValue = formatFieldWithPrefixSuffix(value, 'coiId');
    setFieldTouched('coiId', true);

    if (errors?.coiId) return;

    if (!value || manufacturer !== MANUFACTURER.REGENERON) return;
    if (!orderDetails.patient.patientIdentifier) {
      setAlert({
        description: t('orderManagement.coiId.verification', { coiId: getDisplayNameByFieldName('coiId') }),
        type: 'warning'
      });
      return;
    }
    coiIdValidation({
      patientId: orderDetails?.patient?.patientIdentifier,
      coiId: fieldValue
    });
  };
  const handleOnSaveDraft = (values, errors, touched, setTouched, setErrors) => {
    const isValid = isValidToSaveAsDraft(values, errors, touched, setTouched, setErrors);
    if (!isValid) return;

    handleOnSubmit(values, true);
  };

  return (
    <div className="MCP-module-wrapper">
      {isCoiIdValidationLoading && <Loader type={'screen'} />}
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
            {orderDetails?.collaborators && (
              <Collaborator
                collaborators={orderDetails?.collaborators}
                channelType={orderDetails.channelType}
                orderId={orderId}
                currentStage={orderDetails?.currentStage}
              />
            )}
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
        <div className="stack">
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
          {triageAlert && <Alert {...triageAlert} onClose={() => setTriageAlert(null)} />}
        </div>

        <Formik
          innerRef={formikRef}
          initialValues={initialFormValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onError={console.log}
          validationContext={{ ...therapyConfig }}
          onSubmit={(values) => handleOnSubmit(values)}>
          {({ dirty, values, setFieldValue, errors, touched, setTouched, setErrors, setFieldTouched }) => {
            React.useEffect(() => {
              formEffects(values, initialFormValues, setFieldValue);
            }, [values, initialFormValues]);

            console.log(initialFormValues, validationSchema);

            React.useEffect(() => {
              const isReallyDirty = checkReallyDirty(initialFormValues, values);

              setSkipTerms(!isReallyDirty);
              setIsDirty(isReallyDirty);

              setStoredValue((prev) => (checkReallyDirty(prev, values) ? values : prev));

              dispatch(hasUnsavedChanges(isReallyDirty));
            }, [dirty, values, initialFormValues]);

            return (
              <Form>
                <div className="MCP-module-body">
                  <fieldset className="MCP-fieldset" disabled={readOnly || !isAllowedToProceed}>
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
                        <AdditionalDetailsDefaultFields
                          {...{ therapyConfig, channelType, spTherapyConfig }}
                          readOnly={readOnly || !isAllowedToProceed}
                          handleCoiIdValidation={(e) => handleCoiIdValidation(e, setFieldTouched, errors)}
                        />
                        {isSecondLegShipInfoRequired && (
                          <ShipmentInformation
                            channelType={channelType}
                            onDiagnosisCodeSearch={setDiagnosisSearchQuery}
                            diagnosisCode={diagnosisCode}
                            readOnly={readOnly || !isAllowedToProceed}
                            setAlert={setAlert}
                          />
                        )}
                        <VariantDetails
                          variantAcknowledgement={variantAcknowledgement}
                          handleOnAcknowledgmentChange={handleOnAcknowledgmentChange}
                          variantsData={variantsData}
                          channelType={channelType}
                          variant={variant}
                          handleOnVariantChange={handleOnVariantChange}
                          handleOnVariantDocumentChange={handleOnVariantDocumentChange}
                          readOnly={readOnly || !isAllowedToProceed}
                        />

                        <ClinicalDetails
                          channelType={channelType}
                          onDiagnosisCodeSearch={setDiagnosisSearchQuery}
                          diagnosisCode={diagnosisCode}
                          readOnly={readOnly || !isAllowedToProceed}
                        />

                        <PrescriptionDetails channelType={channelType} readOnly={readOnly || !isAllowedToProceed} />

                        <QuestionnaireDetails
                          isLoading={isFetchingConfiguredQuestions}
                          onRemoveDocument={handleOnRemoveDocument}
                          onDocumentChange={handleOnDocumentChange}
                          config={questionnaireTemplateConfig}
                          questionnaireTemplateConfig={questionnaireTemplateConfig}
                          channelType={channelType}
                          readOnly={readOnly || !isAllowedToProceed}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <div className="footer-wrapper" ref={controlRef}>
                    <div className="controls footer-controls">
                      <Button size="md" variant="secondary" onClick={handleOnBack}>
                        {t('captions.btnBack')}
                      </Button>{' '}
                      <Button
                        size="md"
                        onClick={() => handleOnSaveDraft(values, errors, touched, setTouched, setErrors)}
                        variant="primary"
                        type="button"
                        disabled={readOnly || (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? skipTerms || !values.consentPolicy : !isDirty)}>
                        {t('button.caption.saveAsDraft')}
                      </Button>
                      <Button
                        variant="primary"
                        isLoadingState={isSaving}
                        Icon={isSaving && ButtonLoadingIcon}
                        iconPosition="left"
                        type="submit"
                        disabled={
                          (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA && (!values.consentPolicy || diagnosisCode.length === 0)) ||
                          readOnly ||
                          !isAllowedToProceed
                        }
                        size="md">
                        {t(getOrderStepCaption(isSaving))}
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

const QuestionnaireDetails = ({ isLoading, questionnaireTemplateConfig, onRemoveDocument, onDocumentChange, readOnly, channelType }) => {
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
            channelType={channelType}
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

const AdditionalDetailsDefaultFields = ({ therapyConfig, spTherapyConfig, channelType, readOnly, handleCoiIdValidation }) => {
  const { t } = useTranslate();
  const { setFieldValue } = useFormikContext();
  const defaultFields = getDefaultAdditionalDetailsFields({
    translationFn: t,
    therapyConfig,
    spTherapyConfig,
    channelType,
    setFieldValue,
    handleCoiIdValidation
  });

  if (CommonUtils.isEmptyArray(defaultFields)) return null;

  return (
    <div className="form-segment ">
      <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
        {defaultFields.map(({ name, label, placeholder, isRequired, readOnly: _readOnly, component, maxLength, ...otherProps }, index) => {
          return (
            <Field
              key={index}
              name={name}
              label={label}
              placeholder={placeholder}
              isRequired={isRequired}
              component={component}
              maxLength={maxLength}
              readOnly={readOnly || _readOnly}
              isDisabled={readOnly || _readOnly}
              {...otherProps}
            />
          );
        })}
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
  readOnly,
  channelType
}) => {
  const { t } = useTranslate();
  const { setErrors, errors, touched, values, setFieldValue } = useFormikContext();
  if (!variantsData?.content || !CommonUtils.isNonEmptyObject(variantsData.content)) return null;
  const allowedFileTypes = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? ALLOWED_FILE_TYPE.filter((type) => type === 'application/pdf') : ALLOWED_FILE_TYPE;
  const allowedFileTypeText = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'PDF' : ALLOWED_FILE_TYPE_TEXT;

  return (
    <FormSectionWrapper title={t('labels.selectVariant')} isRequired={true}>
      <div>
        <Field name="variant">
          {({ field, form }) => (
            <VariantTable
              variant={field.value}
              data={variantsData.content}
              readOnly={readOnly}
              onChange={(selectedVariant) => {
                handleOnVariantChange(selectedVariant);
                form.setFieldValue(field.name, selectedVariant);
                form.setFieldTouched(field.name, true, false);
                setFieldValue('variantAcknowledgement', false);
              }}
            />
          )}
        </Field>
        {touched?.variant && !values.variant.variant && errors.variant && <TextError errorMessage={errors.variant.variant} showErrorIcon={false} />}
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
          validateOnChange={(file) => validateFile(t, file, allowedFileTypes)}
          onFileChange={(file) => handleOnVariantDocumentChange('variant', file, setFieldValue)}
          fileTypeText={allowedFileTypeText}
        />
      </div>
    </FormSectionWrapper>
  );
};

const ShipmentInformation = ({ readOnly, setAlert }) => {
  const { values, setFieldValue, initialValues } = useFormikContext();
  const [isVerifyingTransactionId, setIsVerifyingTransactionId] = React.useState(false);
  const [isTransactionIdVerified, setIsTransactionIdVerified] = React.useState(false);
  React.useEffect(() => {
    const transactionId = initialValues.secondLegShipInfo?.transactionId;
    setIsTransactionIdVerified(Boolean(transactionId));
  }, [initialValues]);
  const { t } = useTranslate();
  const fields = getShipmentInformationForm({
    translationFn: t,
    formValues: values,
    setFieldValue,
    isVerifyingTransactionId,
    setIsVerifyingTransactionId,
    isTransactionIdVerified,
    setIsTransactionIdVerified,
    setAlert
  });
  if (CommonUtils.isEmptyArray(fields)) return null;
  const [row1, row2] = fields;
  return (
    <FormSectionWrapper title="Second-Leg Shipment Information" isRequired={true}>
      <div className="grid grid-gap-16 grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 align-items-baseline">
        {row1.map(({ name, label, placeholder, isRequired, component, maxLength, layout = {}, ...otherProps }, index) => (
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
      </div>
      <div className="grid grid-gap-16 grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
        {row2.map(({ name, label, placeholder, isRequired, component, maxLength, layout = {}, ...otherProps }, index) => (
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

const formEffects = (values, initialFormValues, setFieldValue) => {
  if (!values || !initialFormValues) return;

  Object.keys(values).forEach((k) => {
    const curObj = values[k];
    const initObj = initialFormValues[k];
    if (!curObj || typeof curObj !== 'object' || !('value' in curObj)) return;
    const cur = curObj.value;
    const init = initObj?.value;
    if (typeof init === 'string') {
      if (Array.isArray(cur) && cur.length === 0) {
        setFieldValue(`${k}.value`, '', false);
        return;
      }
    }
    if (Array.isArray(init)) {
      if (cur === '' || cur == null) {
        setFieldValue(`${k}.value`, [], false);
        return;
      }
      if (Array.isArray(cur) && cur.length > 1) {
        const sorted = [...cur].map(String).sort();
        if (JSON.stringify(sorted) !== JSON.stringify(cur)) {
          setFieldValue(`${k}.value`, sorted, false);
        }
      }

      if ('document' in init && init.document === null && cur.document === undefined) {
        setFieldValue(`${k}.document`, null, false);
      }
    }
  });
};

const checkReallyDirty = (values, initialFormValues) => {
  const ignored = new Set(['terms', 'acknowledgement']);

  const isDirtyRecursive = (initial, current) => {
    if (initial == null && current == null) return false;

    if (typeof initial === 'object' && typeof current === 'object' && !Array.isArray(initial)) {
      const allKeys = new Set([...Object.keys(initial), ...Object.keys(current)]);
      return Array.from(allKeys).some((key) => {
        if (!(key in initial) && (current[key] == null || current[key] === '')) return false;
        return isDirtyRecursive(initial[key], current[key]);
      });
    }
    return JSON.stringify(initial) !== JSON.stringify(current);
  };

  const isReallyDirty = Object.keys(initialFormValues || {}).some((k) => {
    if (ignored.has(k)) return false;
    if (!(k in values)) return true;
    return isDirtyRecursive(initialFormValues[k], values[k]);
  });
  return isReallyDirty;
};

export default withPermissions(AdditionalDetails, ORDER_STAGES.ADDITIONAL_DETAILS);
