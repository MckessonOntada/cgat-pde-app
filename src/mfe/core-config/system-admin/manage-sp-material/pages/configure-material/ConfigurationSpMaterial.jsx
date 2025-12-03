import React from 'react';
import { Button, Heading, RadioGroup, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import Accordion, { AccordionHeader, AccordionItem, AccordionPanel } from '@src/components/Accordion/Accordion';
import ConfigurationHeader from './ConfigurationHeader';
import ConfigurationForm from './ConfigurationForm';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { configObj } from './config';
import { getConfigurationSchema } from './ConfigurationSchema';
import MaterialService from '@src/api/commonService/MaterialService';
import { useMutation, useQuery } from 'react-query';
import { ChannelType } from '../../../manage-sp-account/util';
import Components from '@src/components/form/Components';

export default function ConfigurationSpMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const { therapy, materialType } = location.state || {};
  const isBnbMaterial = materialType === 'bnb';
  const [manufacturer, setManufacturer] = React.useState([]);

  React.useEffect(() => {
    MaterialService.getManufacturers(materialType === 'bnb' ? ChannelType.BUY_AND_BILL : ChannelType.SPECIALITY_PHARMA).then((manufacturer) => {
      setManufacturer(
        manufacturer.map((item) => ({
          label: item,
          value: item
        }))
      );
    });
  }, []);

  const fieldNameForChannel = isBnbMaterial ? 'patientInformationRequired' : 'triageChannel';

  const channelOptions = isBnbMaterial
    ? [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.yes'), value: true },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.no'), value: false }
      ]
    : [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.sp'), value: 'SP' },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.hub'), value: 'HUB' }
      ];
  const { data: materialDetails, isLoading } = useQuery({
    queryKey: ['MaterialDetails'],
    queryFn: async () => {
      const result = await (isBnbMaterial
        ? MaterialService.getMaterialConfigByNdc(ChannelType.BUY_AND_BILL, therapy?.[0]?.ndc)
        : MaterialService.getSpMaterialConfigByMaterialNumber(ChannelType.SPECIALITY_PHARMA, therapy?.[0]?.materialNumber));
      return isBnbMaterial ? result?.materialConfig?.config : result?.spTherapyConfig?.config;
    },

    enabled: Array.isArray(therapy) && therapy.length === 1,
    refetchOnWindowFocus: false
  });
  const ndcDetails = materialDetails || configObj(materialType);

  const initialValues = {
    manufacturerName: ndcDetails?.manufacturerName || null,
    [fieldNameForChannel]: isBnbMaterial ? ndcDetails?.patientInformationRequired : ndcDetails?.triageChannel,
    fields: ndcDetails?.fields?.map((field) => ({
      fieldName: field?.fieldName,
      properties: {
        displayOnForm: !!field?.properties?.displayOnForm,
        mandatoryField: !!field?.properties?.mandatoryField,
        showHelpIcon: !!field?.properties?.showHelpIcon,
        displayName: field?.properties?.displayName || '',
        errorMessage: field?.properties?.errorMessage || '',
        helpInfoMessage: field?.properties?.helpInfoMessage || '',
        fieldFormat: {
          formatType: field?.properties?.fieldFormat?.formatType || '',
          validationRegex: field?.properties?.fieldFormat?.validationRegex || '',
          validationFormat: field?.properties?.fieldFormat?.validationFormat || ''
        }
      }
    }))
  };

  const validationSchema = getConfigurationSchema(t, channelOptions, fieldNameForChannel, isBnbMaterial);

  const { updateMaterial } = useMutation({
    mutationFn: (payload) => {
      return isBnbMaterial ? MaterialService.updateMaterialConfigBnb(payload) : MaterialService.updateSPMaterialConfig(payload);
    },
    onSuccess: () => {
      navigate('../', {
        state: {
          alert: {
            type: 'success',
            description: t('manageMaterial.drawer.controls.apply.success')
          }
        }
      });
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');

      if (!(statusCode >= 400 && statusCode < 600)) {
        description = CommonUtils.getAxiosErrorMessage(error);
      }

      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const handleSubmit = (values) => {
    const therapyList = Array.isArray(therapy) ? therapy : [therapy];

    const payload = {
      [isBnbMaterial ? 'ndcNumbers' : 'spProductIds']: therapyList.map((item) => (isBnbMaterial ? item.ndc : item.materialNumber)),
      ...(isBnbMaterial && { channelType: ChannelType.BUY_AND_BILL }),
      config: values
    };
    updateMaterial(payload);
  };

  if (isLoading) {
    return <Loader type={'screen'} />;
  }

  const labelTranslation = React.useMemo(() => {
    const _translations = {};
    if (isBnbMaterial) {
      _translations.backButton = 'button.caption.backToMaterialMaster';
      _translations.channelOptionsLabel = 'manageSPMaterial.configuration.label.patientInformationRequired';
    } else {
      _translations.backButton = 'button.caption.backToSpMaterial';
      _translations.channelOptionsLabel = 'manageSPMaterial.configuration.label.triageChannel';
    }
  }, [isBnbMaterial]);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../')} size="md">
          {t(labelTranslation.backButton)}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.configuration.heading.materialConfiguration')}</Heading>} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className="MCP-panel-container">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={false} validateOnBlur={false}>
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="MCP-module-body">
                  <React.Fragment>
                    <ModuleHeader heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.manufacturerConfiguration')}</Heading>} />
                    <div>
                      <Field
                        component={Components['dropdown']}
                        name={'manufacturerName'}
                        fieldlabel={t('label.selectManufacturer')}
                        placeholder="Select Manufacturer"
                        size="lg"
                        options={manufacturer}
                      />
                    </div>
                  </React.Fragment>
                  <React.Fragment>
                    <ModuleHeader
                      heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.channelConfiguration')}</Heading>}
                      controls={
                        <p className="form-instruction">
                          <span className="required">* </span> {t('userManagement.create_user.required')}
                        </p>
                      }
                    />
                    <div className="radio-group-selection">
                      <RadioGroup
                        caption={t(translation.channelOptionsLabel)}
                        direction="row"
                        id={fieldNameForChannel}
                        items={channelOptions}
                        onChangeValue={(value) => {
                          const finalValue = value === 'true' ? true : value === 'false' ? false : value;

                          setFieldValue(fieldNameForChannel, finalValue);

                          if (isBnbMaterial && finalValue === false) {
                            const updatedFields = values.fields.map((field) => {
                              if (field.fieldName === 'patientIdentifier' || field.fieldName === 'coiId') {
                                return {
                                  ...field,
                                  properties: {
                                    displayOnForm: false,
                                    mandatoryField: false,
                                    showHelpIcon: false,
                                    displayName: '',
                                    errorMessage: '',
                                    helpInfoMessage: '',
                                    fieldFormat: {
                                      formatType: '',
                                      validationRegex: '',
                                      validationFormat: ''
                                    }
                                  }
                                };
                              }
                              return field;
                            });

                            setFieldValue('fields', updatedFields);
                          }
                        }}
                        radioBtnWidth="auto"
                        value={values[fieldNameForChannel]}
                        isRequired
                        error={touched[fieldNameForChannel] && Boolean(errors[fieldNameForChannel])}
                        errorMessage={touched[fieldNameForChannel] && errors[fieldNameForChannel]}
                      />
                    </div>
                  </React.Fragment>
                  <ModuleHeader
                    heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.fieldConfiguration')}</Heading>}
                    controls={
                      <p className="form-instruction">
                        <span className="required">* </span> {t('userManagement.create_user.required')}
                      </p>
                    }
                  />
                  <Accordion>
                    {values?.fields?.map((field, idx) => {
                      if (values[fieldNameForChannel] === false && (field.fieldName === 'Manufacturer Patient Identifier' || field.fieldName === 'COI ID')) {
                        return null;
                      }
                      return (
                        <AccordionItem key={field.fieldName || idx} itemKey={`field-${idx}`}>
                          <AccordionHeader>
                            <ConfigurationHeader fieldName={field.fieldName} format={field.properties.fieldFormat.formatType} properties={field.properties} />
                          </AccordionHeader>
                          <AccordionPanel>
                            <ConfigurationForm index={idx} />
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>

                  <div className="controls">
                    <Button variant="secondary" size="md" onClick={() => navigate('../')}>
                      {t('manageSPMaterial.configuration.button.cancel')}
                    </Button>

                    <Button variant="primary" size="md" type="submit">
                      {t('manageSPMaterial.configuration.button.save')}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
