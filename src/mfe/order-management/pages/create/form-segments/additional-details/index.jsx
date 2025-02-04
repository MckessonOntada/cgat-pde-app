import React, { useEffect } from 'react';
import { Button, Heading, Required, CheckboxGroup, CustomDataTable, RadioGroup } from '@mckesson/mcp-component-library';
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
import { useManageOrder } from '@src/mfe/order-management/context/ManageOrderContext';
import OrderHeaderDetails from '../OrderHeaderDetails';
import OrderStepper from '../OrderStepper';
import { ORDER_STAGES } from '@src/mfe/order-management/routes/constants';
import { NUMBER_REGEX } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import { RoutePaths } from '@src/routes/constants';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import QuestionnaireTemplate from '@src/mfe/order-management/questionnaire/QuestionnaireTemplate';
import { LANGUAGE, QUESTION_TYPE } from '@src/mfe/order-management/questionnaire/AddQuestionnaire';

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
  const { formState, setActiveRecord, setCurrentOrder, editByStage } = useManageOrder();
  const therapyId = formState.activeRecord?.therapy?.materialNumber;
  const soldToAccountId = formState.activeRecord?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId = formState.activeRecord?.accountDetails?.shipToAccount?.accountNumber;
  const variantsApiRequestParam = { pageNo: 0, pageSize: 10 };
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [uploadList, setUploadList] = React.useState({});
  const [variantAcknowledgement, setVariantAcknowledgement] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.variantAcknowledgement'),
    value: false
  });
  const [variant, setVariant] = React.useState();
  const { showAlert } = useAlert();
  const alertContainerId = 'additionalDetails-alert-container';

  const initialValidationSchema = Yup.object({
    coiId: Yup.string()
      .matches(NUMBER_REGEX, t('labels.COI_IdMustValidNumber'))
      .max(20, t('labels.COI_IdExceedDigits'))
      .required(t('labels.COIIdRequired')),
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
  React.useEffect(() => {
    setValidationSchema(initialValidationSchema);
  }, []);

  React.useEffect(() => {
    const { paporder: isPapOrder } = formState.activeRecord || {};
    if (isPapOrder) navigate('/orders');
  }, [formState.activeRecord]);

  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async (data) => OrderService.saveAdditionalDetails(orderId, data),
    {
      onSuccess: (result) => {
        const { id } = result;
        setActiveRecord(result);
        navigate(`../${id}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
      },
      onError: (error) => {
        showAlert({ description: err.message, type: 'error', anchorEl: alertContainerId });
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
    if (!result || !Array.isArray(result)) {
      throw new Error('Not a valid questionnaire config');
      return;
    }
    const questionnaireFields = {};
    const validationSchemaFields = {};
    result.forEach((template) => {
      template.questions.forEach((question) => {
        const fieldName = `${template.id}#${question.text[LANGUAGE.ENGLISH]?.trim().replace(/ /g, '_')}`;
        questionnaireFields[fieldName] = '';
        validationSchemaFields[fieldName] =
          question.type === QUESTION_TYPE.INPUT || question.type === QUESTION_TYPE.RADIO_BUTTON
            ? Yup.string()[question.isMandatory ? 'required' : 'nullable'](`Value is required`)
            : Yup.array().of(Yup.string())[question.isMandatory ? 'min' : 'nullable'](1, `Select at least on option`);
      });
      const questionnaireValidationSchema = Yup.object(validationSchemaFields);
      const newValidationSchema = initialValidationSchema.concat(questionnaireValidationSchema);
      setInitialFormValues((prevState) => ({
        ...prevState,
        ...questionnaireFields
      }));
      setValidationSchema(newValidationSchema);
    });
  };

  const {
    data: configuredQuestions,
    isFetching: isFetchingConfiguredQuestions,
    isError: isErrorConfiguredQuestions,
    error: configuredQuestionsError,
    refetch: fetchConfiguredQuestions
  } = useQuery({
    queryKey: ['configured-questionnaire', variant ?? 'default-variant'],
    queryFn: async () => {
      const { accountDetails, therapy } = formState.activeRecord;
      const payload = {
        variant,
        soldToCustomer: accountDetails.soldToAccount.accountNumber,
        shipToCustomer: accountDetails.shipToAccount.accountNumber,
        sapMaterial: therapy.materialNumber
      };
      return QuestionnaireService.getConfiguredQuestionnaire(payload);
    },
    enabled: false,
    refetchOnWindowFocus: false,
    onSuccess: prepareQuestionnaire,
    onError: console.log
  });

  const { data: uploadDocumentResponse, mutate: uploadDocument } = useMutation(
    async ({ fieldName, file }) => {
      const [templateId] = fieldName.split('#');
      return QuestionnaireService.uploadQuestionnaireDocument({ orderId, templateId, file });
    },
    {
      onSuccess: (result, variables) => {
        const { fieldName } = variables;
        uploadList[fieldName] = result;
        setUploadList(uploadList);
      }
    }
  );

  const handleOnFileChange = (fieldName, file) => {
    uploadDocument({ fieldName, file });
  };

  const { isLoading, data: variantsData = {} } = useQuery({
    queryKey: ['order', 'variants', orderId],
    queryFn: async () => OrderService.getVariants(therapyId, soldToAccountId, shipToAccountId, variantsApiRequestParam),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId,
    refetchOnWindowFocus: false,
    onSuccess: (result) => {},
    onError: (error) => {
      const errorKey = handleApiError(err);
      showAlert({ description: t(errorKey), type: 'error', anchorEl: alertContainerId });
    }
  });

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ADDITIONAL_DETAILS);
  }, []);

  React.useEffect(() => {
    const { additionalDetails } = formState.activeRecord || {};
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

      prepareQuestionnaire(configuredQuestionnaires);
      // if (configuredQuestionnaires) {
      //   configuredQuestionnaires.forEach((template) => {
      //     if (template.questions && Array.isArray(template.questions)) {
      //       template.questions.map((question) => {
      //         initialValues[`${template.id}`] = question.value;
      //         // ${id}#${questionLabel.text[LANGUAGE.ENGLISH].replace(/ /g, '_')}`
      //       });
      //     }
      //   });
      // }
      setInitialFormValues({
        ...initialValues
      });

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
  }, [formState.activeRecord, variantsData]);

  const handleOnBack = () => {
    if (isDirty) {
      setModalSuccessCallback(isEdit ? 'summary' : formState.activeRecord?.patientDetailsRequired ? 'patient' : 'account');
      return;
    }
    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: isEdit, isApprover: isApprover } });
    } else {
      if (formState.activeRecord?.patientDetailsRequired) {
        editByStage(ORDER_STAGES.PATIENT_DETAILS);
        navigate(`../${orderId}/patient`, { state: { isEdit: false, isApprover: isApprover } });
      } else {
        editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
        navigate(`../${orderId}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
      }
    }
  };

  const handleOnSubmit = (values) => {
    const _var = !!variant
      ? {
          variant: variant.variant,
          variantDescription: variant.variantDescription,
          variantAcknowledgment: variantAcknowledgement.isChecked
        }
      : null;

    // question template response
    const { accountDetails, therapy } = formState.activeRecord;
    const questionnaireDependencies = {
      soldToCustomer: accountDetails.soldToAccount.accountNumber,
      shipToCustomer: accountDetails.soldToAccount.accountNumber,
      sapMaterial: therapy.materialNumber,
      variant
    };
    //template/question
    const response = [];
    const questionnaireResponse = {
      response: [...configuredQuestions],
      dependencies: questionnaireDependencies
    };
    const { coiId, orderQuantity, slotNumber, poNumber, dateOfAdministration, ...rest } = values;
    Object.entries(rest).forEach(([key, value]) => {
      if (!key) return;

      const [templateId, fieldKey, attachment] = key.split('#');
      if (!templateId || !fieldKey) {
        return;
      }

      const template = questionnaireResponse.response.find((_template) => _template.id == templateId);
      if (!template) return;
      const answeredTemplate = {
        templateName: template.templateName,
        questions: template.questions
      };
      const question = answeredTemplate.questions.find((question) => {
        const fieldName = `${question.text[LANGUAGE.ENGLISH].replace(/ /g, '_')}`;
        return fieldName === fieldKey;
      });

      if (attachment) {
        const documentUrl = uploadList[key];
        question.documentUrl = documentUrl;
      } else {
        question.value = value;
      }

      // questionnaireResponse.response.push(answeredTemplate);
    });

    const payload = {
      coiId,
      orderQuantity,
      slotNumber,
      poNumber,
      dateOfAdministration,
      variantDetails: _var,
      patientConsentTaken: true,
      configuredQuestionnaires: questionnaireResponse.response
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
      editByStage(ORDER_STAGES.PATIENT_DETAILS);
      navigate(`../${orderId}/patient`, { state: { isEdit: false, isApprover: isApprover } });
    } else if (modalSuccessCallback === 'account') {
      editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
      navigate(`../${orderId}/accounts`, { state: { isEdit: false, isApprover: isApprover } });
    }
  };

  const handleOnVariantChange = (variant) => {
    setVariant(variant);
  };

  React.useEffect(() => {
    if (formState.activeRecord && !isEdit) fetchConfiguredQuestions();
  }, [variant, formState.activeRecord]);

  const handleOnAcknowledgmentChange = () => {
    const updatedOptions = { ...variantAcknowledgement, isChecked: !variantAcknowledgement.isChecked };

    setVariantAcknowledgement(updatedOptions);
  };

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
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}>
        {({ values, isValid, dirty }) => {
          React.useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);

          return (
            <Form>
              <div className="MCP-module-body">
                <OrderStepper />

                <OrderHeaderDetails
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
                      <Required id="Required" /> {t('labels.required')}
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
                              size="md"
                            />
                          )}
                        </Field>
                      </div>
                    </>
                  )}

                  {configuredQuestions && Array.isArray(configuredQuestions) && configuredQuestions.length > 0 && (
                    <div className="configured-questionnaire-form">
                      <div className="styled-heading">
                        <h3>Additional Questions</h3>
                      </div>
                      <QuestionnaireTemplate onFileUpload={handleOnFileChange} config={configuredQuestions} isPreview={false} />
                    </div>
                  )}
                </div>

                <div className="controls">
                  <Button size="md" variant="secondary" onClick={handleOnBack}>
                    {isEdit
                      ? t('captions.btnBack')
                      : patientDetailsRequired
                      ? t('captions.btnBacktoPatientDetails')
                      : t('captions.btnBacktoAccountSelection')}
                  </Button>
                  <Button
                    size="md"
                    variant="primary"
                    type="submit"
                    disabled={
                      isSaving || (CommonUtils.isNonEmptyObject(variantsData?.content) && (!variant || !variantAcknowledgement?.isChecked))
                    }>
                    {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                  </Button>
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
        <span aria-label={t('labels.variant')}>
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
