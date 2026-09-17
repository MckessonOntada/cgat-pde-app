import React from 'react';
import { Field, FieldArray, Formik, Form, useFormikContext } from 'formik';
import { Button, Heading, Divider } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import CommonUtils from '@src/util/CommonUtils';
import Components from '@src/components/form/Components';
import styles from './AddRecipient.module.scss';
import { EMPTY_RECIPIENT, DEFAULT_TAB_STATE, ROUTES } from './constants';

export const recipientValidationSchema = (t, existingEmailSet = new Set(), currentEmail = '') =>
  Yup.object({
    recipients: Yup.array()
      .of(
        Yup.object({
          firstName: CommonUtils.getNameValidation(t, { field: 'first_name', required: true }),
          middleName: CommonUtils.getNameValidation(t, { field: 'middle_name', min: 0 }),
          lastName: CommonUtils.getNameValidation(t, { field: 'last_name', required: true }),
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
            return this.createError({ path: `recipients.${index}.email`, message: t('manageMaterial.addRecipients.validation.uniqueEmail') });
          }
        }
        return true;
      })
      .test('exists-in-list', function (recipients) {
        if (!recipients || !existingEmailSet.size) return true;
        const normalizedCurrentEmail = currentEmail?.trim().toLowerCase() || '';
        for (let index = 0; index < recipients.length; index++) {
          const email = recipients[index]?.email?.trim().toLowerCase();
          if (!email) continue;
          if (normalizedCurrentEmail && email === normalizedCurrentEmail) continue;
          if (existingEmailSet.has(email)) {
            return this.createError({ path: `recipients.${index}.email`, message: t('manageMaterial.addRecipients.validation.emailExistsInList') });
          }
        }
        return true;
      })
  });

const AddRecipientForm = ({ onCancel, isEdit }) => {
  const { t } = useTranslate();
  const { values, isSubmitting } = useFormikContext();
  const recipients = values.recipients || [];

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
                            maxLength={50}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.middleName`}
                            label={t('manageMaterial.addRecipients.label.middleName')}
                            placeholder=" "
                            component={Components.input}
                            maxLength={50}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.lastName`}
                            label={t('manageMaterial.addRecipients.label.lastName')}
                            placeholder=" "
                            isRequired
                            component={Components.input}
                            maxLength={50}
                          />
                        </div>

                        <div className={styles.field}>
                          <Field
                            name={`recipients.${index}.email`}
                            label={t('manageMaterial.addRecipients.label.email')}
                            placeholder=" "
                            isRequired
                            component={Components.input}
                            maxLength={100}
                          />
                        </div>
                      </div>

                      {!isEdit && recipients.length > 1 && (
                        <div className={styles.removeContainer}>
                          <Button className={styles.removeButton} type="button" variant="tertiary" size="md" onClick={() => remove(index)}>
                            {t('manageMaterial.addRecipients.button.remove')}
                          </Button>
                        </div>
                      )}
                    </div>

                    {!isEdit && <Divider />}
                  </React.Fragment>
                ))}

                {!isEdit && (
                  <Button type="button" className={styles.addMoreButton} variant="tertiary" size="md" onClick={() => push({ ...EMPTY_RECIPIENT })}>
                    + {t('manageMaterial.addRecipients.button.addMore')}
                  </Button>
                )}
              </div>
            )}
          </FieldArray>
        </div>
      </div>

      <div className={styles.footer}>
        <Button type="button" size="md" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('manageMaterial.addRecipients.button.cancel')}
        </Button>

        <Button type="submit" size="md" disabled={isSubmitting}>
          {isEdit ? t('manageMaterial.addRecipients.button.update') : t('manageMaterial.addRecipients.button.addRecipient')}
        </Button>
      </div>
    </Form>
  );
};

const AddRecipient = () => {
  const { t } = useTranslate();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    therapy,
    isEdit = false,
    recipient,
    selectedTab = 1,
    tabState = DEFAULT_TAB_STATE,
    addRecipients = 'yes',
    currentEmail,
    notificationConfigId,
    existingRecipients = []
  } = location.state || {};

  const existingEmailSet = new Set(existingRecipients.map((r) => r.email?.trim().toLowerCase()).filter(Boolean));

  const isSPMaterial = location.pathname.includes('/manage-sp-material');
  const settingsRoute = isSPMaterial ? ROUTES.SP_MATERIAL_NOTIFICATION_SETTINGS : ROUTES.MATERIAL_NOTIFICATION_SETTINGS;

  const baseNavState = { therapy, selectedTab, tabState, addRecipients, notificationConfigId };

  const handleBackToSettings = () => navigate(settingsRoute, { state: baseNavState });

  const initialRecipient =
    !isEdit || !recipient
      ? { ...EMPTY_RECIPIENT }
      : { firstName: recipient.firstName || '', middleName: recipient.middleName || '', lastName: recipient.lastName || '', email: recipient.email || '' };

  const handleSubmit = (values) => {
    const recipientValue = values.recipients[0];

    if (isEdit) {
      navigate(settingsRoute, {
        state: {
          ...baseNavState,
          editedRecipient: {
            firstName: recipientValue.firstName,
            middleName: recipientValue.middleName,
            lastName: recipientValue.lastName,
            email: recipientValue.email
          },
          originalEmail: currentEmail || recipient?.email,
          forTab: selectedTab
        }
      });
      return;
    }

    navigate(settingsRoute, { state: { ...baseNavState, newRecipients: values.recipients, forTab: selectedTab } });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleBackToSettings} size="md">
          {t('manageMaterial.addRecipients.backToSettings')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{isEdit ? t('manageMaterial.addRecipients.editHeading') : t('manageMaterial.addRecipients.heading')}</Heading>}
        />
        <Formik
          initialValues={{ therapy, recipients: [initialRecipient] }}
          validationSchema={recipientValidationSchema(t, existingEmailSet, currentEmail)}
          onSubmit={handleSubmit}
          enableReinitialize>
          <AddRecipientForm onCancel={handleBackToSettings} isEdit={isEdit} />
        </Formik>
      </div>
    </div>
  );
};

export default AddRecipient;
