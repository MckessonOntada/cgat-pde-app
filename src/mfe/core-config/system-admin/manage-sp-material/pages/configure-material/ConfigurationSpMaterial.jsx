import React from 'react';
import { Button, Heading, RadioGroup, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import Accordion, { AccordionHeader, AccordionItem, AccordionPanel } from '@src/components/Accordion/Accordion';
import ConfigurationHeader from './ConfigurationHeader';
import ConfigurationForm from './ConfigurationForm';
import { Formik, Form } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { configObj } from './config';
import { getConfigurationSchema } from './ConfigurationSchema';
import MaterialService from '@src/api/commonService/MaterialService';
import { useMutation, useQuery } from 'react-query';

export default function ConfigurationSpMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const { therapy, materialType } = location.state || {};
  const isBnbMaterial = materialType === 'bnb';

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
      const result = await MaterialService.getMaterialConfigByNdc(
        isBnbMaterial ? 'BUY_AND_BILL' : 'SPECIALITY_PHARMA',
        isBnbMaterial ? therapy?.[0]?.ndc : therapy?.[0]?.ndcNumber
      );
      return isBnbMaterial ? result?.materialConfig.config : result?.spTherapyConfig.config;
    },
    enabled: Array.isArray(therapy) && therapy.length === 1,
    refetchOnWindowFocus: false
  });
  const ndcDetails = materialDetails || configObj(materialType);

  const initialValues = {
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
          validationRegex: field?.properties?.fieldFormat?.validationRegex || ''
        }
      }
    }))
  };

  const validationSchema = getConfigurationSchema(t, channelOptions, fieldNameForChannel, isBnbMaterial);

  const handleSubmit = (values) => {
    const therapyList = Array.isArray(therapy) ? therapy : [therapy];

    const payload = {
      [isBnbMaterial ? 'ndcNumbers' : 'spProductIds']: therapyList.map((item) => (isBnbMaterial ? item.ndc : item.ndcNumber)),
      ...(isBnbMaterial && { channelType: 'BUY_AND_BILL' }),
      config: values
    };
    updateMaterial.mutate(payload);
  };

  const updateMaterial = useMutation({
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

  if (isLoading) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../')} size="md">
          {t(isBnbMaterial ? 'button.caption.backToMaterialMaster' : 'button.caption.backToSpMaterial')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.configuration.heading.materialConfiguration')}</Heading>} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className="MCP-panel-container">
          <ModuleHeader
            heading={<Heading as="h2">{t('manageSPMaterial.configuration.heading.channelConfiguration')}</Heading>}
            controls={
              <p className="form-instruction">
                <span className="required">* </span> {t('userManagement.create_user.required')}
              </p>
            }
          />
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} validateOnChange={false} validateOnBlur={false}>
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="MCP-module-body">
                  <div className="radio-group-selection">
                    <RadioGroup
                      caption={t(
                        isBnbMaterial ? 'manageSPMaterial.configuration.label.patientInformationRequired' : 'manageSPMaterial.configuration.label.triageChannel'
                      )}
                      direction="row"
                      id={fieldNameForChannel}
                      items={channelOptions}
                      onChangeValue={(value) => {
                        const finalValue = value === 'true' ? true : value === 'false' ? false : value;

                        setFieldValue(fieldNameForChannel, finalValue);

                        if (isBnbMaterial && finalValue === false) {
                          const updatedFields = values.fields.map((field) => {
                            if (field.fieldName === 'Manufacturer Patient Identifier' || field.fieldName === 'COI ID') {
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
                                    customValidationRegex: ''
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
