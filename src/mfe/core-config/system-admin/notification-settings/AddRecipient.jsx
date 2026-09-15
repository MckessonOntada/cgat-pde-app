import React, { useRef, useState } from 'react';
import { Field, FieldArray, Formik, Form, useFormikContext } from 'formik';
import { Button, Heading, Divider, Alert } from '@mckesson/mcp-component-library';
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
import { buildNotificationConfigPayload, getNotificationType, mapRecipients } from './NotificationConfigUtils';

const emptyRecipient = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: ''
};

export const recipientValidationSchema = (t, existingEmailSet = new Set(), currentEmail = '') =>
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
      .test('exists-in-list', function (recipients) {
        if (!recipients || !existingEmailSet.size) {
          return true;
        }

        const normalizedCurrentEmail = currentEmail?.trim().toLowerCase() || '';

        for (let index = 0; index < recipients.length; index++) {
          const email = recipients[index]?.email?.trim().toLowerCase();

          if (!email) {
            continue;
          }

          if (normalizedCurrentEmail && email === normalizedCurrentEmail) {
            continue;
          }

          if (existingEmailSet.has(email)) {
            return this.createError({
              path: `recipients.${index}.email`,
              message: t('manageMaterial.addRecipients.validation.emailExistsInList')
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

                    {!isEdit && <Divider />}
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
    notificationConfigId,
    existingRecipients = [],
    originalNotifications = notifications
  } = location.state || {};

  const existingEmailSet = new Set(existingRecipients.map((r) => r.email?.trim().toLowerCase()).filter(Boolean));

  const therapyList = Array.isArray(therapy) ? therapy : [];

  const isSingleTherapy = therapyList.length === 1;

  const isMultipleTherapy = therapyList.length > 1;

  const getAddSuccessMessage = (count) =>
    count === 1
      ? `1 ${t('manageMaterial.notificationSettings.messages.recipientAdded')}`
      : `${count} ${t('manageMaterial.notificationSettings.messages.recipientsAdded')}`;

  const effectiveNotificationConfigId = isSingleTherapy ? notificationConfigId : undefined;

  const [alert, setAlert] = useState(null);

  const isSPMaterial = location.pathname.includes('/manage-sp-material');

  const settingsRoute = isSPMaterial
    ? '/system-admin/config/manage-sp-material/notification-settings'
    : '/system-admin/config/manage-material/notification-settings';

  const materialRoute = isSPMaterial ? '/system-admin/config/manage-sp-material' : '/system-admin/config/manage-material';

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

  const navigateToSettingsOnSuccess = ({ type, description }) => {
    navigate(settingsRoute, {
      state: {
        therapy,
        selectedTab,
        notifications,
        addRecipients,
        notificationConfigId: effectiveNotificationConfigId,
        alert: {
          type,
          description
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
      navigateToSettingsOnSuccess({
        type: 'success',
        description: getAddSuccessMessage(variables.recipients?.length || 0)
      });
    },
    onError: (error) => {
      console.error('Failed to create notification config:', error);
      setAlert({ type: 'error', description: t('errors.default') });
    }
  });

  const { mutate: updateNotificationConfigsBulk, isLoading: isBulkUpdating } = useMutation(
    (payload) => MaterialService.updateMaterialNotificationConfigsBulk(payload),
    {
      onSuccess: (_, variables) => {
        // navigate(materialRoute, { state: { alert: { type: 'success', description: count === 1 ? t('manageMaterial.notificationSettings.messages.configSavedMaterial', { count }) : t('manageMaterial.notificationSettings.messages.configSavedMaterials', { count }) } } });
        navigateToSettingsOnSuccess({
          type: 'success',
          description: getAddSuccessMessage(variables.recipients?.length || 0)
        });
      },
      onError: (error) => {
        console.error('Failed to bulk update notification configs:', error);
        setAlert({ type: 'error', description: t('errors.default') });
      }
    }
  );

  const { mutate: updateNotificationRecipient, isLoading: isUpdatingRecipient } = useMutation(
    (payload) => MaterialService.updateMaterialNotificationRecipient(payload),
    {
      onSuccess: () => {
        navigateToSettingsOnSuccess({
          type: 'success',
          description: t('manageMaterial.notificationSettings.messages.recipientUpdated')
        });
      },
      onError: (error) => {
        console.error('Failed to update notification recipient:', error);
        setAlert({ type: 'error', description: t('errors.default') });
      }
    }
  );

  const pendingAddRecipientsPayload = useRef(null);

  const { mutate: addNotificationRecipients, isLoading: isAddingRecipient } = useMutation(
    (payload) => MaterialService.addMaterialNotificationRecipients(payload),
    {
      onSuccess: (_, variables) => {
        navigateToSettingsOnSuccess({
          type: 'success',
          description: getAddSuccessMessage(variables.recipients?.length || 0)
        });
      },
      onError: (error) => {
        console.error('Failed to add notification recipients:', error);
        setAlert({ type: 'error', description: t('errors.default') });
      }
    }
  );

  const { mutate: updateNotificationConfig, isLoading: isUpdatingConfig } = useMutation(
    ({ configId, payload }) => MaterialService.updateMaterialNotificationConfig(configId, payload),
    {
      onSuccess: () => {
        if (pendingAddRecipientsPayload.current) {
          addNotificationRecipients(pendingAddRecipientsPayload.current);
          pendingAddRecipientsPayload.current = null;
        }
      },
      onError: (error) => {
        console.error('Failed to update notification config:', error);
        pendingAddRecipientsPayload.current = null;
        setAlert({ type: 'error', description: t('errors.default') });
      }
    }
  );

  const isSaving = isCreating || isBulkUpdating || isAddingRecipient || isUpdatingRecipient || isUpdatingConfig;

  const handleSubmit = (values) => {
    const selectedTherapy = therapyList[0];

    const ndcNumber = selectedTherapy?.ndc || selectedTherapy?.ndcNumber;

    const notificationType = getNotificationType(selectedTab);

    const recipientsPayload = mapRecipients(values.recipients);

    if (isEdit) {
      const recipientValue = values.recipients[0];

      updateNotificationRecipient({
        ndcNumbers: therapyList.map((item) => item?.ndc || item?.ndcNumber).filter(Boolean),
        channelType: selectedTherapy?.channelType,
        notificationType,
        currentEmail: currentEmail || recipient?.email,
        recipient: {
          firstName: recipientValue.firstName,
          middleName: recipientValue.middleName,
          lastName: recipientValue.lastName,
          email: recipientValue.email,
          lastUpdatedDate: recipient?.lastUpdatedDate
        }
      });

      return;
    }

    if (isMultipleTherapy) {
      updateNotificationConfigsBulk(
        buildNotificationConfigPayload({
          therapy,
          selectedTab,
          notifications,
          recipients: values.recipients,
          isBulk: true
        })
      );

      return;
    }

    if (effectiveNotificationConfigId && notifications && !originalNotifications) {
      pendingAddRecipientsPayload.current = {
        ndcNumbers: [ndcNumber],
        channelType: selectedTherapy?.channelType,
        notificationType,
        recipients: recipientsPayload
      };
      updateNotificationConfig({
        configId: effectiveNotificationConfigId,
        payload: buildNotificationConfigPayload({ therapy, selectedTab, notifications, recipients: existingRecipients, isBulk: false })
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
        recipients: values.recipients,
        isBulk: false
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

        {alert && <Alert description={alert.description} onClose={() => setAlert(null)} type={alert.type} />}

        <Formik
          initialValues={{
            therapy,
            recipients: [initialRecipient]
          }}
          validationSchema={recipientValidationSchema(t, existingEmailSet, currentEmail)}
          onSubmit={handleSubmit}
          enableReinitialize>
          <AddRecipientForm onCancel={handleBackToSettings} isEdit={isEdit} isSubmitting={isSaving} />
        </Formik>
      </div>
    </div>
  );
};

export default AddRecipient;
