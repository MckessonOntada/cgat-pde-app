import React from 'react';
import { Button, Heading, RadioGroup } from '@mckesson/mcp-component-library';
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

export default function ConfigurationSpMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);
  const { therapy, materialType } = location.state || {};
  const isBnbMaterial = materialType === 'bnb';

  React.useEffect(() => {
    if (therapy) {
      setSelectedTherapy({
        id: therapy.materialNumber,
        name: therapy.tradeName,
        description: therapy.materialDescription
      });
    }
  }, [therapy]);

  const config = configObj(materialType);
  const fieldNameForChannel = isBnbMaterial ? 'patientInformationRequired' : 'triageChannel';

  const channelOptions = isBnbMaterial
    ? [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.yes'), value: 'yes' },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.no'), value: 'no' }
      ]
    : [
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.sp'), value: 'sp' },
        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.hub'), value: 'hub' }
      ];

  const initialValues = {
    [fieldNameForChannel]: config.triageChannel || '',
    fields: config.fields.map((field) => ({
      fieldName: field.fieldName,
      displayOnForm: !!field.properties.displayOnForm,
      mandatoryField: !!field.properties.mandatoryField,
      showHelpIcon: !!field.properties.showHelpIcon,
      displayName: field.properties.displayName || '',
      errorMessage: field.properties.errorMessage || '',
      helpInfoMessage: field.properties.helpInfoMessage || '',
      fieldFormat: {
        formatType: field.properties.fieldFormat?.formatType || '',
        validationRegex: field.properties.fieldFormat?.validationRegex || ''
      }
    }))
  };

  const validationSchema = getConfigurationSchema(t, channelOptions, fieldNameForChannel, isBnbMaterial);
  const handleSubmit = (values) => {
    console.log('Submit payload', values);
    setAlert({ type: 'success', description: t('manageSPMaterial.configuration.alert.saveSuccess') });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('../', { state: { selectedTherapies: selectedTherapy } })}
          size="md">
          {t('button.caption.backToSpMaterial')}
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
                {console.log('value', values)}
                {console.log('err', errors)}
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
                        setFieldValue(fieldNameForChannel, value);

                        if (isBnbMaterial && value === 'no') {
                          const updatedFields = values.fields.map((field) => {
                            if (field.fieldName === 'Manufacturer Patient Identifier' || field.fieldName === 'COI ID') {
                              console.log('test');
                              return {
                                ...field,
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
                    {values.fields.map((field, idx) => {
                      if (values[fieldNameForChannel] === 'no' && (field.fieldName === 'Manufacturer Patient Identifier' || field.fieldName === 'COI ID')) {
                        return null;
                      }
                      return (
                        <AccordionItem key={field.fieldName || idx} itemKey={`field-${idx}`}>
                          <AccordionHeader>
                            <ConfigurationHeader fieldName={field.fieldName} format={field.fieldFormat.formatType} properties={field} />
                          </AccordionHeader>
                          <AccordionPanel>
                            <ConfigurationForm index={idx} />
                          </AccordionPanel>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
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
