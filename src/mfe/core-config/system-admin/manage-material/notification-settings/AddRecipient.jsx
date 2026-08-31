import React from 'react';
import { Field, FieldArray, Formik, Form, useFormikContext } from 'formik';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import styles from './AddRecipient.module.scss';
import Components from '@src/components/form/Components';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import * as Yup from 'yup';
import { Divider } from '@mckesson/mcp-component-library';

const emptyRecipient = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: ''
};

const recipientValidationSchema = (t) =>
  Yup.object({
    recipients: Yup.array()
      .of(
        Yup.object({
          firstName: Yup.string().trim().required(t('manageMaterial.addRecipients.required.firstName')),

          middleName: Yup.string().trim(),

          lastName: Yup.string().trim().required(t('manageMaterial.addRecipients.required.lastName')),

          email: Yup.string().trim().email(t('manageMaterial.addRecipients.validation.email')).required(t('manageMaterial.addRecipients.required.email'))
        })
      )
      .test('unique-emails', function (recipients) {
        if (!recipients) return true;

        for (let index = 0; index < recipients.length; index++) {
          const email = recipients[index]?.email?.trim().toLowerCase();

          if (!email) continue;

          const firstIndex = recipients.findIndex((recipient) => recipient.email?.trim().toLowerCase() === email);

          if (firstIndex !== index) {
            return this.createError({
              path: `recipients.${index}.email`,
              message: t('manageMaterial.addRecipients.validation.uniqueEmail')
            });
          }
        }
        return true;
      })
  });

const AddRecipientForm = ({ onCancel }) => {
  const { t } = useTranslate();

  const { values, validateForm, setFieldTouched } = useFormikContext();

  const recipients = values.recipients || [];

  const handleAddMore = async (index, push) => {
    const validationErrors = await validateForm();

    const recipientErrors = validationErrors?.recipients?.[index];

    if (recipientErrors) {
      await setFieldTouched(`recipients.${index}.firstName`, true, false);

      await setFieldTouched(`recipients.${index}.lastName`, true, false);

      await setFieldTouched(`recipients.${index}.email`, true, false);

      return;
    }

    push({
      ...emptyRecipient
    });
  };

  return (
    <Form>
      <div className="MCP-panel-container">
        <div className={styles.recipientContainer}>
          <FieldArray name="recipients">
            {({ push, remove }) => (
              <div className={styles.recipientContainer}>
                {recipients.map((recipient, index) => (
                  <React.Fragment key={index}>
                    <div>
                      <ModuleHeader
                        heading={<Heading as="h3">{t('manageMaterial.addRecipients.form.heading')}</Heading>}
                        controls={
                          <p className="form-instruction">
                            <span className="required">*</span> {t('labels.required')}
                          </p>
                        }
                      />
                    </div>

                    <div className={styles.fieldsWrapper}>
                      <div className={styles.fields}>
                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.firstName`}
                            label={t('manageMaterial.addRecipients.label.firstName')}
                            placeholder=" "
                            isRequired
                            component={Components.input}
                            maxLength={100}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.middleName`}
                            label={t('manageMaterial.addRecipients.label.middleName')}
                            placeholder=" "
                            component={Components.input}
                            maxLength={100}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.lastName`}
                            label={t('manageMaterial.addRecipients.label.lastName')}
                            placeholder=" "
                            isRequired
                            component={Components.input}
                            maxLength={100}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.email`}
                            label={t('manageMaterial.addRecipients.label.email')}
                            placeholder=" "
                            isRequired
                            component={Components.input}
                            maxLength={254}
                          />
                        </div>
                      </div>

                      {recipients.length > 1 && (
                        <div className={styles.removeContainer}>
                          <Button className={styles.removeButton} type="button" variant="tertiary" size="md" onClick={() => remove(index)}>
                            {t('manageMaterial.addRecipients.button.remove')}
                          </Button>
                        </div>
                      )}
                    </div>

                    <Divider />
                  </React.Fragment>
                ))}

                <Button type="button" className={styles.addMoreButton} variant="tertiary" size="md" onClick={() => handleAddMore(recipients.length - 1, push)}>
                  + {t('manageMaterial.addRecipients.button.addMore')}
                </Button>
              </div>
            )}
          </FieldArray>
        </div>

        <div className={styles.footer}>
          <Button type="button" size="md" variant="secondary" onClick={onCancel}>
            {t('manageMaterial.addRecipients.button.cancel')}
          </Button>

          <Button type="submit" size="md">
            {t('manageMaterial.addRecipients.button.addRecipient')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

const AddRecipient = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const therapy = location.state?.therapy;

  const handleBackToSettings = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    const payload = {
      recipients: values.recipients
    };
    console.log('Add Recipient API Payload:', payload);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleBackToSettings} size="md">
          {t('manageMaterial.addRecipients.backToSettings')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageMaterial.addRecipients.heading')}</Heading>} />

        <Formik
          initialValues={{
            therapy,
            recipients: [
              {
                ...emptyRecipient
              }
            ]
          }}
          validationSchema={recipientValidationSchema(t)}
          onSubmit={handleSubmit}>
          <AddRecipientForm onCancel={handleBackToSettings} />
        </Formik>
      </div>
    </div>
  );
};

export default AddRecipient;
