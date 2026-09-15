import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading, TabList, Switch, RadioGroup, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { Field, Formik, Form } from 'formik';
import styles from './MaterialNotificationSettings.module.scss';
import RecipientList from './list/RecipientList';
import { RecipientListProvider } from './context/RecipientListContext';
import MaterialService from '@src/api/commonService/MaterialService';
import { useMutation, useQuery } from 'react-query';
import { buildNotificationConfigPayload, getNotificationType } from './NotificationConfigUtils';

const TAB_LIST = [
  {
    id: 1,
    configName: 'manageMaterial.notificationSettings.Tab1',
    sequence: 1,
    labelForMobile: 'manageMaterial.notificationSettings.Tab1'
  },
  {
    id: 2,
    configName: 'manageMaterial.notificationSettings.Tab2',
    sequence: 2,
    labelForMobile: 'manageMaterial.notificationSettings.Tab2'
  }
];

const MaterialNotificationSettings = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const { therapy, alert: navigationAlert, notificationConfigId: navigationConfigId } = location.state || {};

  const isSPMaterial = location.pathname.includes('/manage-sp-material');

  const materialRoute = isSPMaterial ? '/system-admin/config/manage-sp-material' : '/system-admin/config/manage-material';

  const addRecipientsRoute = isSPMaterial
    ? '/system-admin/config/manage-sp-material/notification-settings/add-recipients'
    : '/system-admin/config/manage-material/notification-settings/add-recipients';

  const therapyList = Array.isArray(therapy) ? therapy : [];
  const isSingleTherapy = therapyList.length === 1;
  const isMultipleTherapy = therapyList.length > 1;

  const [selectedTab, setSelectedTab] = useState(location.state?.selectedTab || 1);
  const [alert, setAlert] = useState(null);

  const selectedTherapy = therapyList[0];

  const requestParams = useMemo(
    () => ({
      ndcNumber: selectedTherapy?.ndc || selectedTherapy?.ndcNumber,
      channelType: selectedTherapy?.channelType,
      notificationType: getNotificationType(selectedTab)
    }),
    [selectedTherapy, selectedTab]
  );

  const {
    data: notificationConfig,
    isLoading: isNotificationConfigLoading,
    isFetching: isNotificationConfigFetching,
    refetch: refetchNotificationConfig
  } = useQuery(
    ['MaterialNotificationConfig', requestParams.ndcNumber, requestParams.channelType, requestParams.notificationType],
    () => MaterialService.getMaterialNotificationConfig(requestParams),
    {
      enabled: isSingleTherapy && !!requestParams.ndcNumber && !!requestParams.channelType && !!requestParams.notificationType,
      refetchOnWindowFocus: false
    }
  );

  const notificationConfigId = isSingleTherapy ? notificationConfig?.id || navigationConfigId : undefined;

  const fetchedRecipients = isSingleTherapy ? notificationConfig?.recipients || [] : [];

  const fetchedNotifications = isSingleTherapy ? notificationConfig?.isCustomerServiceEnabled ?? true : true;

  const { mutate: createNotificationConfig, isLoading: isCreating } = useMutation((payload) => MaterialService.createMaterialNotificationConfig(payload), {
    onSuccess: () => {
      navigateBackToMaterial(getConfigSavedMessage());
    },
    onError: (error) => {
      console.error('Failed to create notification config:', error);
      setAlert({ type: 'error', message: t('errors.default') });
    }
  });

  const { mutate: updateNotificationConfigsBulk, isLoading: isBulkUpdating } = useMutation(
    (payload) => MaterialService.updateMaterialNotificationConfigsBulk(payload),
    {
      onSuccess: () => {
        navigateBackToMaterial(getConfigSavedMessage());
      },
      onError: (error) => {
        console.error('Failed to bulk update notification configs:', error);
        setAlert({ type: 'error', message: t('errors.default') });
      }
    }
  );

  const { mutate: updateNotificationConfig, isLoading: isUpdating } = useMutation(
    ({ configId, payload }) => MaterialService.updateMaterialNotificationConfig(configId, payload),
    {
      onSuccess: () => {
        navigateBackToMaterial(getConfigSavedMessage());
      },
      onError: (error) => {
        console.error('Failed to update notification config:', error);
        setAlert({ type: 'error', message: t('errors.default') });
      }
    }
  );

  const { mutate: deleteNotificationRecipient, isLoading: isDeleting } = useMutation(
    (payload) => MaterialService.deleteMaterialNotificationRecipient(payload),
    {
      onSuccess: () => {
        refetchNotificationConfig();

        setAlert({
          type: 'success',
          message: t('manageMaterial.notificationSettings.messages.recipientDeleted')
        });
      },
      onError: (error) => {
        console.error('Failed to delete notification recipient:', error);
        setAlert({ type: 'error', message: t('errors.default') });
      }
    }
  );

  const isSaving = isCreating || isUpdating || isBulkUpdating || isDeleting;

  const handleOnBackToMaterial = () => {
    navigate(materialRoute);
  };

  const getConfigSavedMessage = () => {
    const count = therapyList.length;
    return count === 1
      ? t('manageMaterial.notificationSettings.messages.configSavedMaterial', { count })
      : t('manageMaterial.notificationSettings.messages.configSavedMaterials', { count });
  };

  const navigateBackToMaterial = (description) => {
    navigate(materialRoute, { state: { alert: { type: 'success', description } } });
  };

  const handleOnOptionSelection = (value, row, currentValues) => {
    const currentTherapy = therapyList[0];

    if (value === 'edit') {
      navigate(addRecipientsRoute, {
        state: {
          therapy,
          isEdit: true,
          recipient: row,
          currentEmail: row?.email,
          selectedTab: currentValues.selectedTab,
          notifications: currentValues.notifications,
          addRecipients: currentValues.addRecipients,
          notificationConfigId: isSingleTherapy ? notificationConfigId : undefined
        }
      });

      return;
    }

    if (value === 'delete') {
      const ndcNumber = currentTherapy?.ndc || currentTherapy?.ndcNumber;

      deleteNotificationRecipient({
        ndcNumbers: [ndcNumber],
        channelType: currentTherapy?.channelType,
        notificationType: currentValues.selectedTab === 1 ? 'ORDER_SUBMIT' : 'PATIENT_INGESTION',
        email: row?.email
      });
    }
  };

  const handleSubmit = (values) => {
    if (isNotificationConfigLoading || isNotificationConfigFetching || isSaving) {
      return;
    }

    if (isMultipleTherapy) {
      const payload = buildNotificationConfigPayload({
        therapy,
        selectedTab: values.selectedTab,
        notifications: values.notifications,
        recipients: values.recipients,
        isBulk: true
      });

      updateNotificationConfigsBulk(payload);

      return;
    }

    const payload = buildNotificationConfigPayload({
      therapy,
      selectedTab: values.selectedTab,
      notifications: values.notifications,
      recipients: values.recipients,
      isBulk: false
    });

    if (notificationConfigId) {
      updateNotificationConfig({
        configId: notificationConfigId,
        payload
      });

      return;
    }

    createNotificationConfig(payload);
  };

  useEffect(() => {
    if (!navigationAlert) {
      return;
    }

    setAlert(navigationAlert);

    navigate(location.pathname, {
      replace: true,
      state: {
        therapy,
        selectedTab,
        notificationConfigId: isSingleTherapy ? notificationConfigId : undefined
      }
    });
  }, [navigationAlert, location.pathname, therapy, selectedTab, isSingleTherapy, notificationConfigId]);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackToMaterial}
          size="md"
          disabled={isSaving}>
          {t('manageMaterial.notificationSettings.backToManageMatierial')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageMaterial.notificationSettings.heading')}</Heading>} />

        {alert && <Alert description={alert.description || alert.message} onClose={() => setAlert(null)} type={alert.type} />}

        <Formik
          initialValues={{
            selectedTab,
            notifications: fetchedNotifications,
            addRecipients: 'yes',
            therapy,
            recipients: fetchedRecipients
          }}
          onSubmit={handleSubmit}
          enableReinitialize>
          {({ values, setFieldValue, setFieldTouched }) => {
            const handleAddRecipient = () => {
              navigate(addRecipientsRoute, {
                state: {
                  therapy,
                  isEdit: false,
                  selectedTab: values.selectedTab,
                  notifications: values.notifications,
                  addRecipients: values.addRecipients,
                  notificationConfigId: isSingleTherapy ? notificationConfigId : undefined,
                  originalNotifications: fetchedNotifications,
                  existingRecipients: values.recipients
                }
              });
            };

            return (
              <>
                <div className="MCP-panel-container">
                  <div style={{ padding: '0px 16px' }}>
                    <div className="customTab">
                      <TabList
                        options={TAB_LIST.map((tab) => ({
                          ...tab,
                          configName: t(tab.configName),
                          labelForMobile: t(tab.labelForMobile),
                          isActiveTab: tab.id === values.selectedTab
                        }))}
                        alignment="left"
                        onTabClick={(newTab) => {
                          setSelectedTab(newTab.id);
                          setFieldValue('selectedTab', newTab.id);
                        }}
                        showShadow={false}
                        variant="text"
                        useAsButton
                        aria-label={t('controls.ariaLabels.orderTabList')}
                      />
                    </div>
                  </div>

                  <div className={styles.notificationSetting}>
                    <div className={styles.notificationInfo}>
                      <Heading as="h3">{t('manageMaterial.notificationSettings.heading.notifications')}</Heading>

                      <span>{t('manageMaterial.notificationSettings.subHeading.notifications')}</span>
                    </div>

                    <div className={styles.notificationControl}>
                      <Field name="notifications">
                        {({ field }) => (
                          <Switch
                            id="order-submission-notification"
                            labelPosition="right"
                            size="lg"
                            checked={field.value}
                            onChange={() => {
                              setFieldValue('notifications', !field.value);

                              setFieldTouched('notifications', true, false);
                            }}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  <div className={styles.recipientQuestion}>
                    <Heading as="h4">{t('manageMaterial.notificationSettings.label.addRecipients')}</Heading>

                    <Field name="addRecipients">
                      {({ field }) => (
                        <RadioGroup
                          direction="row"
                          radioBtnWidth="auto"
                          size="lg"
                          value={field.value}
                          items={[
                            {
                              label: 'Yes',
                              value: 'yes',
                              isDisabled: !values.notifications
                            },
                            {
                              label: 'No',
                              value: 'no',
                              isDisabled: !values.notifications
                            }
                          ]}
                          onChangeValue={(value) => {
                            setFieldValue('addRecipients', value);

                            setFieldTouched('addRecipients', true, false);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <div className={styles.recipientSection}>
                    <div className={styles.recipientSectionHeader}>
                      <Heading as="h3">{t('manageMaterial.notificationSettings.recipientsTable.heading')}</Heading>

                      <Button
                        type="button"
                        Icon={AddCircleFilled}
                        className="button-icon"
                        size="md"
                        disabled={
                          !values.notifications || values.addRecipients !== 'yes' || isSaving || isNotificationConfigLoading || isNotificationConfigFetching
                        }
                        onClick={handleAddRecipient}>
                        {t('manageMaterial.notificationSettings.button.addRecipient')}
                      </Button>
                    </div>

                    <div className={styles.dataTable}>
                      <RecipientListProvider key={values.selectedTab} recipients={values.recipients}>
                        <RecipientList
                          handleOnOptionSelection={(value, row) => handleOnOptionSelection(value, row, values)}
                          isActionsDisabled={
                            !values.notifications || values.addRecipients !== 'yes' || isSaving || isNotificationConfigLoading || isNotificationConfigFetching
                          }
                        />
                      </RecipientListProvider>
                    </div>
                  </div>
                </div>
                <Form>
                  <div className={styles.footer}>
                    <div className={styles.footerContent}>
                      <Button type="button" size="md" variant="secondary" onClick={handleOnBackToMaterial} disabled={isSaving}>
                        {t('manageMaterial.notificationSettings.button.cancel')}
                      </Button>

                      <Button type="submit" size="md" disabled={isSaving || isNotificationConfigLoading || isNotificationConfigFetching}>
                        {t('manageMaterial.notificationSettings.button.save')}
                      </Button>
                    </div>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default MaterialNotificationSettings;
