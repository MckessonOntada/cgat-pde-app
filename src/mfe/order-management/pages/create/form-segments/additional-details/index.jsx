import React, { useEffect, useState } from 'react';
import { Button, Heading, CheckboxGroup, CustomDataTable, RadioGroup, Loader } from '@mckesson/mcp-component-library';
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
import { NUMBER_REGEX } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import QuestionnaireTemplate from '@src/mfe/order-management/questionnaire/QuestionnaireTemplate';
import { LANGUAGE, QUESTION_TYPE } from '@src/mfe/order-management/questionnaire/AddQuestionnaire';
import useOrder from '../../../orders/useOrder';

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  dateOfAdministration: ''
};

function AdditionalDetails() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { isEdit = false, isApprover = false, alertState } = location.state || {};
  const { orderId } = useParams();
  const [initialFormValues, setInitialFormValues] = React.useState(INITIAL_VALUES);
  const [validationSchema, setValidationSchema] = React.useState(null);

  const variantsApiRequestParam = { pageNo: 0, pageSize: 10 };
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [formikErrorMsg, setFormikErrorMsg] = React.useState(null);
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
  const { data: orderDetails, isFetching: isFetchingOrderDetails, isError, error } = useOrder(orderId);
  const { isCoiIdRequired, patientDetailsRequired } = orderDetails || {};
  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId = orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  let initialValidationSchema = Yup.object({
    coiId: Yup.string()
      .matches(NUMBER_REGEX, t('labels.COI_IdMustValidNumber'))
      .max(20, t('labels.COI_IdExceedDigits'))
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
    slotNumber: Yup.string()
      .required(t('labels.slotNumberRequired'))
      .max(20, t('labels.slotNumberLengthError'))
      .trim(t('labels.slotNumberExtraSpaceError')),
    poNumber: Yup.string()
      .required(t('labels.PONumberRequired'))
      .max(35, t('labels.PONumberLengthError'))
      .trim(t('labels.poNumberExtraSpaceError')),
    dateOfAdministration: Yup.date()
      .required(t('labels.DateOfAdministrationRequired'))
      .min(new Date(), t('labels.dateOfAdministrationFutureDateOnly'))
  });

  const formFields = getFormFields(t, { isCoiIdRequired });

  React.useEffect(() => {
    setValidationSchema(initialValidationSchema);
  }, []);

  React.useEffect(() => {
    const { paporder: isPapOrder } = orderDetails || {};
    if (isPapOrder) navigate('/orders');
  }, [orderDetails]);

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async (data) => OrderService.saveAdditionalDetails(orderId, data),
    {
      onSuccess: (result) => {
        const { id } = result;
        navigate(`../${id}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
      },
      onError: (error) => {
        showAlert({ description: error.message, type: 'error', anchorEl: alertContainerId });
      }
    }
  );

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

        if (question.isDocumentRequired && question.documentUrl) {
          questionnaireFields[fieldName].documentUrl = question.documentUrl;
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

          documentUrl:
            question.isDocumentRequired && question.isMandatory ? Yup.string().required('Please Upload Document') : Yup.string().nullable()
        });
      });
    });

    const questionnaireValidationSchema = Yup.object(validationSchemaFields);
    initialValidationSchema = initialValidationSchema.concat(questionnaireValidationSchema);
    setValidationSchema(initialValidationSchema);

    setInitialFormValues((prevState) => {
      return {
        ...prevState,
        ...questionnaireFields
      };
    });
  };

  const variantType = variant?.variant;
  const {
    data: configuredQuestions,
    isFetching: isFetchingConfiguredQuestions,
    isError: isErrorConfiguredQuestions,
    error: configuredQuestionsError,
    refetch: fetchConfiguredQuestions
  } = useQuery({
    queryKey: ['configured-questionnaire', variant ?? 'default-variant'],
    queryFn: async () => {
      const { accountDetails, therapy } = orderDetails;
      if (orderDetails.additionalDetails?.configuredQuestionnaires) return;

      const payload = {
        variantType,
        soldToCustomer: accountDetails.soldToAccount?.accountNumber,
        shipToCustomer: accountDetails.shipToAccount?.accountNumber,
        sapMaterial: therapy.materialNumber
      };
      return QuestionnaireService.getConfiguredQuestionnaire(payload);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      result && prepareQuestionnaire(result);
    },
    onError: (error) => {
      showAlert({ description: error.message, type: 'error', anchorEl: alertContainerId });
    }
  });

  const { data: uploadDocumentResponse, mutate: uploadDocument } = useMutation(
    async ({ fieldName, file }) => {
      const [templateId] = fieldName.split('#');
      return QuestionnaireService.uploadQuestionnaireDocument({ orderId, templateId, file });
    },
    {
      onSuccess: (result, variables) => {
        const { fieldName, setFieldValue } = variables;
        setFieldValue(`${fieldName}.documentUrl`, result);
      },
      onError: (error) => {
        showAlert({ description: error.message, type: 'error', anchorEl: alertContainerId });
      }
    }
  );

  const handleOnDocumentChange = (fieldName, file, setFieldValue) => {
    uploadDocument({ fieldName, file, setFieldValue });
  };

  const handleOnRemoveDocument = (fieldName) => {
    initialFormValues[fieldName].documentUrl = null;
    setInitialFormValues({ ...initialFormValues });
  };

  const { isLoading, data: variantsData = {} } = useQuery({
    queryKey: ['order', 'variants', orderId],
    queryFn: async () => OrderService.getVariants(therapyId, soldToAccountId, shipToAccountId, variantsApiRequestParam),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {},
    onError: (error) => {
      const errorKey = handleApiError(error);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

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
        variantDetails: _variant,
        configuredQuestionnaires
      } = additionalDetails;

      const initialValues = {
        dateOfAdministration,
        coiId,
        orderQuantity,
        poNumber,
        slotNumber
      };

      configuredQuestionnaires && prepareQuestionnaire(configuredQuestionnaires);

      setInitialFormValues((prevState) => ({
        ...prevState,
        ...initialValues
      }));

      if (!variantsData.content || !_variant) {
        return;
      }
      setVariant({
        variant: _variant.variant,
        variantDescription: _variant.variantDescription,
        id: variantsData.content?.find((_v) => _variant.variant === _v.variant).id
      });
      setVariantAcknowledgement((prev) => ({ ...prev, isChecked: patientConsentTaken }));
    }
  }, [orderDetails, variantsData]);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : orderDetails?.patientDetailsRequired ? 'patient' : 'account');
      return;
    }
    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
    } else {
      if (orderDetails?.patientDetailsRequired) {
        navigate(`../${orderId}/patient`, { state: { isEdit: false, isApprover: isApprover } });
      } else {
        navigate(`../${orderId}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
      }
    }
  };

  const handleOnSubmit = (values) => {
    if (CommonUtils.isNonEmptyObject(variantsData?.content) && (!variant || !variantAcknowledgement?.isChecked)) {
      setAgreementCheckboxError(t('message.acknowldge'));
      return;
    }
    const _var = !!variant
      ? {
          variant: variant.variant,
          variantDescription: variant.variantDescription,
          variantAcknowledgment: variantAcknowledgement.isChecked
        }
      : null;

    const { accountDetails, therapy } = orderDetails;
    const questionnaireDependencies = {
      soldToCustomer: accountDetails.soldToAccount.accountNumber,
      shipToCustomer: accountDetails.soldToAccount.accountNumber,
      sapMaterial: therapy.materialNumber,
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
        question.documentUrl = fieldValue.documentUrl;
      });
    });

    const payload = {
      coiId,
      orderQuantity,
      slotNumber,
      poNumber,
      dateOfAdministration,
      variantDetails: _var,
      patientConsentTaken: true,
      configuredQuestionnaires: questionnaireTemplateConfig
    };

    saveAdditionalDetails(payload);
  };

  const handleOnBackToOrders = () => {
    if (isDirty) {
      setModalSuccessCallback('list');
    } else {
      navigate(RoutePaths.pathOrderManagement);
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate(RoutePaths.pathOrderManagement);
    } else if (modalSuccessCallback === 'summary') {
      navigate(`../${orderId}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
    } else if (modalSuccessCallback === 'patient') {
      navigate(`../${orderId}/patient`, { state: { isEdit: false, isApprover: isApprover } });
    } else if (modalSuccessCallback === 'account') {
      navigate(`../${orderId}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
    }
  };

  const handleOnVariantChange = (variant) => {
    setAgreementCheckboxError(null);
    setVariant(variant);
  };

  React.useEffect(() => {
    if (orderDetails && !orderDetails.additionalDetails?.configuredQuestionnaires) {
      const { soldToAccount, shipToAccount } = orderDetails.accountDetails || {};
      if (soldToAccount && shipToAccount) {
        fetchConfiguredQuestions();
      }
    }
  }, [variant, orderDetails]);

  const handleOnAcknowledgmentChange = () => {
    const updatedOptions = { ...variantAcknowledgement, isChecked: !variantAcknowledgement.isChecked };
    setVariantAcknowledgement(updatedOptions);
  };

  if (isFetchingOrderDetails) {
    return <Loader />;
  }
  return (
    <div className="MCP-module-wrapper">
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
        {({ dirty, errors, values }) => {
          useEffect(() => setIsDirty(dirty), [dirty]);

          return (
            <Form>
              <div className="MCP-module-body">
                <OrderStepper patientDetailsRequired={patientDetailsRequired} status={orderDetails?.currentStage} />

                <OrderHeaderDetails
                  orderDetails={orderDetails}
                  therapyId={therapyId}
                  soldToAccountId={soldToAccountId}
                  shipToAccountId={shipToAccountId}
                  variant={variant?.variant}
                />
                <div id={alertContainerId} />
                <div className="MCP-panel-container">
                  <div className="row-space-between-center">
                    <Heading as="h3">{t('labels.additionalDetails')}</Heading>
                    <p className="form-instruction">
                      <span className="required">*</span> {t('labels.required')}
                    </p>
                  </div>
                  <div className="grid grid-gap-16 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
                    {formFields.map(({ name, label, placeholder, isRequired, component, maxLength, ...otherProps }, index) => (
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
                  {!!variantsData?.content && CommonUtils.isNonEmptyObject(variantsData?.content) && (
                    <>
                      <Heading as="h3">{t('labels.selectVariant')}</Heading>
                      <VariantTable variant={variant} onChange={handleOnVariantChange} data={variantsData.content} />
                      <div className="agreement-checkbox-control">
                        <Field name="variant-acknowledgement">
                          {({ field, form }) => (
                            <CheckboxGroup
                              id={'default'}
                              name="variant-acknowledgement"
                              items={[{ ...variantAcknowledgement, onChange: () => handleOnAcknowledgmentChange() }]}
                              error={Boolean(agreementCheckboxError)}
                              errorMessage={agreementCheckboxError}
                              size="md"
                            />
                          )}
                        </Field>
                      </div>
                    </>
                  )}

                  {questionnaireTemplateConfig && Array.isArray(questionnaireTemplateConfig) && questionnaireTemplateConfig.length > 0 && (
                    <div className="configured-questionnaire-form">
                      <QuestionnaireTemplate
                        onRemoveDocument={handleOnRemoveDocument}
                        onDocumentChange={handleOnDocumentChange}
                        config={questionnaireTemplateConfig}
                        isPreview={false}
                      />
                    </div>
                  )}
                  <div className="controls error-label">{formikErrorMsg}</div>
                </div>

                <div>
                  <div className="controls">
                    <Button size="md" variant="secondary" onClick={handleOnBack}>
                      {t('captions.btnBack')}
                    </Button>
                    <Button size="md" variant="primary" type="submit">
                      {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
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

  useEffect(() => {
    if (!variant && data?.length > 0) {
      const firstVariant = data[0];
      onChange(firstVariant);
    }
  }, [data, onChange]);

  const columns = [
    {
      id: 'id',
      width: '40px',
      sortable: false,
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
      cell: (props) => <span>{props.variantDescription}</span>
    }
  ];
  return <CustomDataTable id="order-management-therapy-listing" type={'normal'} columns={columns} data={data} />;
};
export default AdditionalDetails;
