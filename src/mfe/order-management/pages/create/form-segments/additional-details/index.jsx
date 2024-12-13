import React from 'react';
import { CustomDataTable, RadioGroup, Button, Stepper, Heading, Required, CheckboxGroup } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { FormList } from '../Constants';
import { ReactComponent as InfoIcon } from '@src/assets/svg/info_icon_circle_filled.svg';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import DetailSegment from '@src/components/DetailSegment';
import { Field, Form, Formik } from 'formik';
import FileInput from '@src/components/FileInput';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { getFormFields } from './fields';
import * as Yup from 'yup';

const getValidationSchema = (t) =>
  Yup.object({
    coiId: Yup.number().required(t('COI Id is required')).min(1, ''),
    orderQuantity: Yup.number().required('Order Quantity is required').min(1, ''),
    slotNumber: Yup.string().required('Slot number is required').min(1, '').max(20, 'Slot Number can not be greater than 20'),
    poNumber: Yup.number().required('PO number is required').min(1, '').max(35, 'PO Number can not be greater than 20')
  });

function AdditionalDetails() {
  const initialValues = {
    coiId: '',
    orderQuantity: '',
    slotNumber: '',
    poNumber: '',
    dateOfAdministration: ''
  };
  const { t } = useTranslate();
  const formFields = getFormFields(t);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [checkboxOptions, setCheckboxOptions] = React.useState([
    {
      isDisabled: false,
      isChecked: false,
      label: t('messages.variantAcknowledgement'),
      value: false
    }
  ]);
  const [consentStatus, setConsentStatus] = React.useState('');
  const [variant, setVariant] = React.useState();
  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/patient`);
  };

  const handleOnSubmit = (values) => {
    let isValid = true;
    if (values) {
      if (!variant) {
        console.log('select variant');
      }
      if (consentStatus === 'yes' && !values['patient-concent-document']) {
        console.log('missing consent document');
      }
      if (checkboxOptions[0].isChecked === true && !values['variantAcknowledgementDocument']) {
        console.log('missing acknowledge');
      }
    }
  };

  const handleOnAcknowledgmentChange = (value) => {
    const updatedOptions = checkboxOptions.map((item) =>
      item.value === value
        ? {
            ...item,
            isChecked: !item.isChecked
          }
        : item
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };
  const handleOnVariantChange = (variant) => {
    setVariant(variant);
  };

  const forms = FormList(t);
  const validationSchema = getValidationSchema(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackButtonClick}
          size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}>
        {() => {
          return (
            <Form>
              <div className="MCP-module-body">
                <Stepper
                  activeIndex={4}
                  dividerText="of"
                  mobileLabel={t('labels.steps')}
                  stepHeaders={forms.map((f) => ({ label: f.label }))}
                />
                <div className="MCP-panel-container">
                  <div className={`grid grid-gap-24 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5`}>
                    <DetailSegment label={t('labels.therapyDescription')} value={'Therapy Description'} />
                    <DetailSegment label={t('labels.orderByAccountNumber')} value={'Order by Account Number'} />
                    <DetailSegment label={t('labels.shipToAccountNumber')} value={'Ship to Account Number'} />
                    <DetailSegment label={t('labels.patientName')} value={'Patient Name'} />
                    <DetailSegment label={t('labels.price')} value={'Price'} />
                  </div>
                </div>
                <div className="MCP-panel-container">
                  <div className="row-space-between-center">
                    <Heading as="h3">{t('labels.additionalDetails')}</Heading>
                    <p className="form-instruction">
                      <Required id="Required" /> {t('labels.required')}
                    </p>
                  </div>
                  <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                    {formFields.map((field, index) => (
                      <Field
                        key={index}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        isRequired={field.isRequired}
                        component={field.component}
                        maxLength={field.maxLength}
                      />
                    ))}
                  </div>
                  <div className="MCP-sect">
                    <Heading as="h3">{t('labels.selectVariant')}</Heading>
                    <VariantTable variant={variant} onChange={handleOnVariantChange} />
                  </div>

                  <div className="agreement-checkbox-control">
                    <Field name="variant-acknowledgement">
                      {({ field, form }) => (
                        <CheckboxGroup
                          id={'default'}
                          name="variant-acknowledgement"
                          items={checkboxOptions.map((item) => ({
                            ...item,
                            onChange: () => handleOnAcknowledgmentChange(item.value)
                          }))}
                          size="md"
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <Field name="file" isRequired={checkboxOptions[0].isChecked}>
                      {({ field, form }) => (
                        <FileInput
                          name="variantAcknowledgementDocument"
                          initialLogo={field.value}
                          onFileSelect={(file) => {
                            form.setFieldValue(field.name, file);
                          }}
                          label={t('labels.uploadDocument')}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="agreement-checkbox-control">
                    <p>{t('messages.patientConcent')}</p>
                    <RadioGroup
                      direction="row"
                      id="patientConcent"
                      items={['yes', 'no'].map((v) => ({ label: t(`label.${v}`), value: v.toLowerCase() }))}
                      onChangeValue={setConsentStatus}
                      value={consentStatus}
                      radioBtnWidth="auto"
                    />
                  </div>
                  <div>
                    <Field name="file">
                      {({ field, form }) => (
                        <FileInput
                          name="patient-concent-document"
                          initialLogo={field.value}
                          onFileSelect={(file) => {
                            form.setFieldValue(field.name, file);
                          }}
                          label=<p className="form-instruction">
                            {t('labels.uploadDocument')}
                            <Required id="Required" />
                          </p>
                        />
                      )}
                    </Field>
                  </div>
                </div>
                <div className="controls">
                  <Button size="md" variant="secondary" onClick={handleOnBack}>
                    {t('captions.btnBack')}
                  </Button>
                  <Button size="md" variant="primary" type="submit">
                    {t('captions.btnSaveAndContinue')}
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

const VariantTable = ({ variant, onChange }) => {
  const { t } = useTranslate();
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
              onChange(props.variantId);
            }}
            radioBtnWidth="auto"
            value={variant === props.variantId ? props.variantId : ''}
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
