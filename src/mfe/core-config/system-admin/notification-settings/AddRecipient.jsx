import React from 'react';
import { Field, FieldArray, Formik, Form, useFormikContext } from 'formik';
import { Button, Heading, Divider } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import styles from './AddRecipient.module.scss';
import Components from '@src/components/form/Components';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import * as Yup from 'yup';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import MaterialService from '@src/api/commonService/MaterialService';
import { buildNotificationConfigPayload } from './NotificationConfigUtils';

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
          firstName: CommonUtils.getNameValidation(t, {
            field: 'first_name',
            required: true
          }),
          middleName: CommonUtils.getNameValidation(t, {
            field: 'middle_name',
            min: 0
          }),
          lastName: CommonUtils.getNameValidation(t, {
            field: 'last_name',
            required: true
          }),
          email: Yup.string().trim().email(t('manageMaterial.addRecipients.validation.email')).required(t('manageMaterial.addRecipients.required.email'))
        })
      )
      .test('unique-emails', function (recipients) {
        if (!recipients) {
          return true;
        }

        for (let index = 0; index < recipients.length; index++) {
          const email = recipients[index]?.email?.trim().toLowerCase();

          if (!email) {
            continue;
          }

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

const AddRecipientForm = ({ onCancel, isEdit, isSubmitting }) => {
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

    push({ ...emptyRecipient });
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

                    <Divider />
                  </React.Fragment>
                ))}

                {!isEdit && (
                  <Button
                    type="button"
                    className={styles.addMoreButton}
                    variant="tertiary"
                    size="md"
                    onClick={() => handleAddMore(recipients.length - 1, push)}>
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
    notifications = true,
    addRecipients = 'yes',
    currentEmail,
    notificationConfigId
  } = location.state || {};

  const therapyList = Array.isArray(therapy) ? therapy : [];

  const isSingleTherapy = therapyList.length === 1;

  const isMultipleTherapy = therapyList.length > 1;

  const effectiveNotificationConfigId = isSingleTherapy ? notificationConfigId : undefined;

  const isSPMaterial = location.pathname.includes('/manage-sp-material');

  const settingsRoute = isSPMaterial
    ? '/system-admin/config/manage-sp-material/notification-settings'
    : '/system-admin/config/manage-material/notification-settings';

  const handleBackToSettings = () => {
    navigate(settingsRoute, {
      state: {
        therapy,
        selectedTab,
        notifications,
        addRecipients,
        notificationConfigId: effectiveNotificationConfigId
      }
    });
  };

  const navigateToSettingsOnSuccess = ({ type, message }) => {
    navigate(settingsRoute, {
      state: {
        therapy,
        selectedTab,
        notifications,
        addRecipients,
        notificationConfigId: effectiveNotificationConfigId,
        alert: {
          type,
          message
        }
      }
    });
  };

  const getInitialRecipient = () => {
    if (!isEdit || !recipient) {
      return { ...emptyRecipient };
    }

    return {
      firstName: recipient.firstName || '',
      middleName: recipient.middleName || '',
      lastName: recipient.lastName || '',
      email: recipient.email || ''
    };
  };

  const { mutate: createNotificationConfig, isLoading: isCreating } = useMutation((payload) => MaterialService.createMaterialNotificationConfig(payload), {
    onSuccess: (_, variables) => {
      const count = variables.recipients?.length || 0;

      navigateToSettingsOnSuccess({
        type: 'success',
        message:
          count === 1
            ? `1 ${t('manageMaterial.notificationSettings.messages.recipientAdded')}`
            : `${count} ${t('manageMaterial.notificationSettings.messages.recipientsAdded')}`
      });
    },
    onError: (error) => {
      console.error('Failed to create notification config:', error);
    }
  });

  const { mutate: updateNotificationRecipient, isLoading: isUpdatingRecipient } = useMutation(
    (payload) => MaterialService.updateMaterialNotificationRecipient(payload),
    {
      onSuccess: () => {
        navigateToSettingsOnSuccess({
          type: 'success',
          message: t('manageMaterial.notificationSettings.messages.recipientUpdated')
        });
      },
      onError: (error) => {
        console.error('Failed to update notification recipient:', error);
      }
    }
  );

  const { mutate: addNotificationRecipients, isLoading: isAddingRecipient } = useMutation(
    (payload) => MaterialService.addMaterialNotificationRecipients(payload),
    {
      onSuccess: (_, variables) => {
        const count = variables.recipients?.length || 0;

        navigateToSettingsOnSuccess({
          type: 'success',
          message:
            count === 1
              ? `1 ${t('manageMaterial.notificationSettings.messages.recipientAdded')}`
              : `${count} ${t('manageMaterial.notificationSettings.messages.recipientsAdded')}`
        });
      },
      onError: (error) => {
        console.error('Failed to add notification recipients:', error);
      }
    }
  );

  const isSaving = isCreating || isAddingRecipient || isUpdatingRecipient;

  const handleSubmit = (values) => {
    const selectedTherapy = therapyList[0];

    const ndcNumber = selectedTherapy?.ndc || selectedTherapy?.ndcNumber;

    const notificationType = selectedTab === 1 ? 'ORDER_SUBMIT' : 'PATIENT_INGESTION';

    const recipientsPayload = values.recipients.map(({ firstName, middleName, lastName, email }) => ({
      firstName,
      middleName,
      lastName,
      email
    }));

    if (isEdit) {
      const recipientValue = values.recipients[0];

      updateNotificationRecipient({
        ndcNumbers: [ndcNumber],
        channelType: selectedTherapy?.channelType,
        notificationType,
        currentEmail: currentEmail || recipient?.email,
        recipient: {
          firstName: recipientValue.firstName,
          middleName: recipientValue.middleName,
          lastName: recipientValue.lastName,
          email: recipientValue.email
        }
      });

      return;
    }

    if (effectiveNotificationConfigId) {
      addNotificationRecipients({
        ndcNumbers: [ndcNumber],
        channelType: selectedTherapy?.channelType,
        notificationType,
        recipients: recipientsPayload
      });

      return;
    }

    createNotificationConfig(
      buildNotificationConfigPayload({
        therapy,
        selectedTab,
        notifications,
        recipients: values.recipients
      })
    );
  };

  const initialRecipient = getInitialRecipient();

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleBackToSettings} size="md" disabled={isSaving}>
          {t('manageMaterial.addRecipients.backToSettings')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{isEdit ? t('manageMaterial.addRecipients.editHeading') : t('manageMaterial.addRecipients.heading')}</Heading>}
        />

        <Formik
          initialValues={{
            therapy,
            recipients: [initialRecipient]
          }}
          validationSchema={recipientValidationSchema(t)}
          onSubmit={handleSubmit}
          enableReinitialize>
          <AddRecipientForm onCancel={handleBackToSettings} isEdit={isEdit} isSubmitting={isSaving} />
        </Formik>
      </div>
    </div>
  );
};

export default AddRecipient;
