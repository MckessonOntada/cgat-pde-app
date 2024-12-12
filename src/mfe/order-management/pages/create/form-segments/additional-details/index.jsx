import React from 'react';
import { CustomDataTable, RadioGroup, Button, Stepper, Heading, Required, CheckboxGroup } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { FormList } from '../Constants';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import ModuleHeader from '../../../../../../components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import { Field, Formik } from 'formik';
import FileInput from '@src/components/FileInput';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import Components from '@src/components/form/Components';

function AdditionalDetails() {
  const { t } = useTranslate();
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
  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/patient`);
  };

  const handleOnSubmit = () => {
    navigate(`../${orderId}/summary`);
  };

  const handleOnBack = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackButtonClick} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={t('headings.createNewOrder')} />

      <Formik>
        {() => {
          return (
            <div className="MCP-module-body">
              <Stepper activeIndex={4} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />
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
                  <Field name="contactPerson.firstName" label={t('labels.coiId')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
                  <Field name="contactPerson.middleName" label={t('labels.orderQuantity')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
                  <Field name="contactPerson.lastName" label={t('labels.provideSlotNumber')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
                  <Field name="contact.email" label={t('labels.providePONumber')} placeholder=" " isRequired component={Components['input']} maxLength={40} />
                  <Field name="contact.phone" label={t('labels.provideDateOfAdministration')} component={Components['input']} placeholder=" " isRequired />
                </div>
                <div className="MCP-sect">
                  <Heading as="h3">{t('labels.selectVariant')}</Heading>
                  <VariantTable />
                </div>

                <div className="agreement-checkbox-control">
                  <CheckboxGroup
                    id={'default'}
                    name="variant-acknowledgement"
                    items={checkboxOptions.map((item) => ({
                      ...item,
                      onChange: () => {}
                    }))}
                    size="md"
                  />
                </div>
                <div>
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput
                        initialLogo={field.value}
                        onFileSelect={(file) => {
                          form.setFieldValue(field.name, file);
                        }}
                        label={t('labels.uploadDocument')}
                      />
                    )}
                  </Field>
                </div>
                <div>
                  <Heading as="h5">{t('labels.patientConsent')}</Heading>
                  <RadioGroup direction="row" id="patientConcent" items={['yes', 'no'].map((v) => ({ label: t(`label.${v}`), value: v.toLowerCase() }))} onChangeValue={() => {}} value={'yes'} radioBtnWidth="auto" />
                </div>
                <div>
                  <Field name="file">
                    {({ field, form }) => (
                      <FileInput
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
              <ModuleHeader
                controls={
                  <div className="controls">
                    <Button size="md" variant="secondary" onClick={handleOnBack}>
                      {t('captions.btnBack')}
                    </Button>
                    <Button size="md" variant="primary" onClick={handleOnSubmit} type="submit">
                      {t('captions.btnSaveAndContinue')}
                    </Button>
                  </div>
                }
              />
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

const VariantTable = () => {
  const { t } = useTranslate();
  const data = [
    {
      id: 1,
      variant: 'Type A',
      variantDescription: 'One to One'
    },
    {
      id: 1,
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
            id={`radio-button-variant-${props.therapyId}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.variantId
              }
            ]}
            onChangeValue={() => {}}
            onOtherTextChange={() => {}}
            onSubRadioFieldChange={() => {}}
            radioBtnWidth="auto"
            value={'1'}
          />
        </span>
      )
    },
    {
      id: 'variant',
      name: t('labels.variant'),
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
      name: t('labels.variantDescription'),
      minWidth: '300px',
      selector: () => {},
      sortable: false,
      cell: (props) => <span>{props.variantDescription}</span>
    }
  ];
  return <CustomDataTable id="order-management-therapy-listing" type={'normal'} columns={columns} data={data} />;
};

export default AdditionalDetails;
