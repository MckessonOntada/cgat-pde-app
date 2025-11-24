import React from 'react';
import { Button, Heading, RadioGroup } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import Accordion, { AccordionHeader, AccordionItem, AccordionPanel } from '@src/components/Accordion/Accordion';
import ConfigurationHeader from './ConfigurationHeader';
import ConfigurationForm from './ConfigurationForm';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { config } from './config';

export default function ConfigurationSpMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);

  React.useEffect(() => {
    const { therapy } = location.state || {};
    if (therapy) {
      setSelectedTherapy({
        id: therapy.materialNumber,
        name: therapy.tradeName,
        description: therapy.materialDescription
      });
    }
  }, [location.state]);

  const initialValues = {
    triageChannel: config.triageChannel || '',
    fields: config.fields.map((field) => ({
      fieldName: field.fieldName,
      format: field.format,
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

  const validationSchema = Yup.object({
    triageChannel: Yup.string().oneOf(['sp', 'hub']).required(t('manageSPMaterial.configuration.validation.triageChannelRequired')),
    fields: Yup.array().of(
      Yup.object({
        fieldName: Yup.string().required(),
        format: Yup.string().required(),
        displayOnForm: Yup.boolean(),
        mandatoryField: Yup.boolean(),
        showHelpIcon: Yup.boolean(),
        displayName: Yup.string().when('displayOnForm', {
          is: true,
          then: (schema) =>
            schema.when('mandatoryField', {
              is: true,
              then: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequiredMandatory')),
              otherwise: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequired'))
            }),
          otherwise: (schema) => schema.notRequired().nullable()
        }),
        errorMessage: Yup.string().when('displayOnForm', {
          is: true,
          then: (s) => s.required(t('manageSPMaterial.configuration.validation.errorMessageRequired')),
          otherwise: (s) => s.notRequired().nullable()
        }),
        helpInfoMessage: Yup.string().when(['displayOnForm', 'showHelpIcon'], {
          is: (displayOnForm, showHelpIcon) => displayOnForm === true && showHelpIcon === true,
          then: (s) => s.required(t('manageSPMaterial.configuration.validation.helpInfoRequired')),
          otherwise: (s) => s.notRequired().nullable()
        }),
        fieldFormat: Yup.object({
          formatType: Yup.string().when('displayOnForm', {
            is: true,
            then: (s) => s.required(t('manageSPMaterial.configuration.validation.formatTypeRequired')),
            otherwise: (s) => s.notRequired().nullable()
          }),
          validationRegex: Yup.string().when('displayOnForm', {
            is: true,
            then: (s) => s.required(t('manageSPMaterial.configuration.validation.regexRequired')),
            otherwise: (s) => s.notRequired().nullable()
          })
        })
      })
    )
  });

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

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="MCP-module-body">
                  <div className="radio-group-selection">
                    <RadioGroup
                      caption={t('manageSPMaterial.configuration.label.triageChannel')}
                      direction="row"
                      id="triageChannel"
                      items={[
                        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.sp'), value: 'sp' },
                        { isDisabled: false, label: t('manageSPMaterial.configuration.radio.hub'), value: 'hub' }
                      ]}
                      onChangeValue={(value) => {
                        setFieldValue('triageChannel', value);
                      }}
                      radioBtnWidth="auto"
                      value={values.triageChannel}
                      isRequired
                      error={touched.triageChannel && Boolean(errors.triageChannel)}
                      errorMessage={touched.triageChannel && errors.triageChannel}
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
                    {values.fields.map((field, idx) => (
                      <>
                        {console.log(field)}
                        <AccordionItem key={field.fieldName || idx} itemKey={`field-${idx}`}>
                          <AccordionHeader>
                            <ConfigurationHeader fieldName={field.fieldName} format={field.fieldFormat.formatType} properties={field} />
                          </AccordionHeader>
                          <AccordionPanel>
                            <ConfigurationForm index={idx} />
                          </AccordionPanel>
                        </AccordionItem>
                      </>
                    ))}
                  </Accordion>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                    <Button variant="secondary" size="md" onClick={() => navigate('../')}>
                      {t('manageSPMaterial.configuration.button.cancel')}
                    </Button>
                    <div style={{ width: 12 }} />
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
