import React from 'react';
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

const getValidationSchema = (t) =>
  Yup.object({
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

const INITIAL_VALUES = {
  coiId: '',
  orderQuantity: '',
  slotNumber: '',
  poNumber: '',
  dateOfAdministration: ''
};

function AdditionalDetails() {
  const { t } = useTranslate();
  const formFields = getFormFields(t);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const [initialFormValues, setInitialFormValues] = React.useState(INITIAL_VALUES);
  const { formState, setActiveRecord, setCurrentOrder, editByStage } = useManageOrder();
  const therapyId = formState.activeRecord?.therapy.id;
  const soldToAccountId = formState.activeRecord?.accountDetails.soldToAccount.id;
  const shipToAccountId = formState.activeRecord?.accountDetails.shipToAccount.id;
  const variantsApiRequestParam = { pageNo: 0, pageSize: 10 };

  const [checkboxOptions, setCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.variantAcknowledgement'),
    value: false
  });
  const [consentStatus, setConsentStatus] = React.useState('');
  const [variant, setVariant] = React.useState();

  const { isEdit = false } = location.state || {};
  const { isLoading: isSaving, mutate: saveAdditionalDetails } = useMutation(
    async (data) => OrderService.saveAdditionalDetails(orderId, data),
    {
      onSuccess: (result) => {
        const { id } = result;
        setActiveRecord(result);
        navigate(`../${id}/summary`);
      },
      onError: console.log
    }
  );

  const { isLoading, data: variantsData = {} } = useQuery({
    queryKey: ['order', 'variants', orderId],
    queryFn: async () => OrderService.getVariants(therapyId, soldToAccountId, shipToAccountId, variantsApiRequestParam),
    enabled: !!therapyId && !!soldToAccountId && !!shipToAccountId,
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    orderId && setCurrentOrder(orderId, ORDER_STAGES.ADDITIONAL_DETAILS);
  }, []);

  React.useEffect(() => {
    const { additionalDetails } = formState.activeRecord || {};
    if (additionalDetails) {
      const { dateOfAdministration, id, orderQuantity, patientConsentTaken, poNumber, slotNumber } = additionalDetails;

      setInitialFormValues({
        coiId: id,
        orderQuantity: orderQuantity,
        slotNumber: slotNumber,
        poNumber: poNumber,
        dateOfAdministration: dateOfAdministration
      });
    }
  }, [formState.activeRecord]);

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    if (isEdit) {
      navigate(`../${orderId}/summary`, { state: { isEdit: true } });
    } else {
      if (formState.activeRecord?.patientDetailsRequired) {
        editByStage(ORDER_STAGES.PATIENT_DETAILS);
        navigate(`../${orderId}/patient`);
      } else {
        editByStage(ORDER_STAGES.ACCOUNT_DETAILS);
        navigate(`../${orderId}/accounts`);
      }
    }
  };

  const handleOnSubmit = (values) => {
    const payload = {
      id: values.coiId,
      orderQuantity: values.orderQuantity,
      slotNumber: values.slotNumber,
      poNumber: values.poNumber,
      dateOfAdministration: values.dateOfAdministration,
      patientConsentTaken: true
    };

    saveAdditionalDetails(payload);
  };

  const handleOnBackToOrders = () => {
    //compare data change, display modal for confirmation
    navigate(-1);
  };

  const handleOnVariantChange = (variant) => {
    setVariant(variant);
  };

  const handleOnAcknowledgmentChange = () => {
    const updatedOptions = { ...checkboxOptions, isChecked: !checkboxOptions.isChecked };

    setCheckboxOptions(updatedOptions);
  };

  const data = [
    {
      variantId: 68,
      variant: 'Type A',
      variantDescription: 'One to One'
    },
    {
      variantId: 2,
      variant: 'Type B',
      variantDescription: 'One to Many'
    }
  ];

  const validationSchema = getValidationSchema(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={<Heading as="h1">{isEdit ? t('headings.editOrder') : t('headings.createNewOrder')}</Heading>} />

      <Formik
        initialValues={initialFormValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}>
        {() => {
          return (
            <Form>
              <div className="MCP-module-body">
                <OrderStepper />

                <OrderHeaderDetails />
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
                </div>
                {/* <div className="MCP-sect">
                  <Heading as="h3">{t('labels.selectVariant')}</Heading>
                  <VariantTable variant={variant} onChange={handleOnVariantChange} data={data} />
                </div>
                <div className="agreement-checkbox-control">
                  <Field name="variant-acknowledgement">
                    {({ field, form }) => (
                      <CheckboxGroup
                        id={'default'}
                        name="variant-acknowledgement"
                        items={[{ ...checkboxOptions, onChange: () => handleOnAcknowledgmentChange() }]}
                        size="md"
                      />
                    )}
                  </Field>
                </div> */}

                <div className="controls">
                  <Button size="md" variant="secondary" onClick={handleOnBack}>
                    {t('captions.btnBack')}
                  </Button>
                  <Button size="md" variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving' : t('captions.btnSaveAndContinue')}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

const VariantTable = ({ variant, onChange, data }) => {
  const { t } = useTranslate();
  const columns = [
    {
      id: 'id',
      selector: () => {},
      width: '40px',
      sortable: false,
      cell: (props) => (
        <span className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-variant-${props.variantId}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.variantId
              }
            ]}
            onChangeValue={() => {
              onChange(props);
            }}
            radioBtnWidth="auto"
            value={variant?.variantId === props.variantId ? props.variantId : ''}
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
