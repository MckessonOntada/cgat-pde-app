import React, { useEffect, useMemo, useState } from 'react';
import { Button, Heading, TabList, Switch, RadioGroup, Alert } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import MaterialService from '@src/api/commonService/MaterialService';
import RecipientList from './list/RecipientList';
import { RecipientListProvider } from './context/RecipientListContext';
import { buildCombinedNotificationPayload } from './NotificationConfigUtils';
import { TAB_LIST, DEFAULT_TAB_STATE, NOTIFICATION_TYPES, ROUTES } from './constants';
import styles from './MaterialNotificationSettings.module.scss';

const buildInitialTabState = (locationState) => {
  const base = locationState?.tabState || DEFAULT_TAB_STATE;
  const forTab = locationState?.forTab;

  if (forTab && locationState?.newRecipients?.length > 0) {
    const tabData = base[forTab] || { notifications: null, recipients: null };
    return {
      ...base,
      [forTab]: { ...tabData, recipients: [...locationState.newRecipients, ...(tabData.recipients || [])] }
    };
  }

  if (forTab && locationState?.editedRecipient && locationState?.originalEmail) {
    const tabData = base[forTab] || { notifications: null, recipients: null };
    const originalEmailLower = locationState.originalEmail.trim().toLowerCase();
    const updatedRecipients =
      tabData.recipients == null
        ? null
        : tabData.recipients.map((recipient) => (recipient.email?.trim().toLowerCase() === originalEmailLower ? locationState.editedRecipient : recipient));
    return {
      ...base,
      [forTab]: {
        ...tabData,
        recipients: updatedRecipients
      }
    };
  }

  return base;
};

const MaterialNotificationSettings = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { therapy, notificationConfigId: navigationConfigId } = location.state || {};

  const isSPMaterial = location.pathname.includes('/manage-sp-material');
  const materialRoute = isSPMaterial ? ROUTES.SP_MATERIAL : ROUTES.MATERIAL;
  const addRecipientsRoute = isSPMaterial
    ? `${ROUTES.SP_MATERIAL_NOTIFICATION_SETTINGS}/recipients`
    : `${ROUTES.MATERIAL_NOTIFICATION_SETTINGS}/recipients`;

  const therapyList = Array.isArray(therapy) ? therapy : [];
  const isSingleTherapy = therapyList.length === 1;
  const selectedTherapy = therapyList[0];

  const [selectedTab, setSelectedTab] = useState(location.state?.selectedTab || 1);
  const [tabState, setTabState] = useState(() => buildInitialTabState(location.state));

  const isReturningFromRecipientPage = !!location.state?.tabState;

  const [alert, setAlert] = useState(() => {
    if (location.state?.newRecipients?.length > 0) {
      const count = location.state.newRecipients.length;
      const key = count === 1 ? 'manageMaterial.notificationSettings.messages.recipientAdded' : 'manageMaterial.notificationSettings.messages.recipientsAdded';
      return { type: 'success', description: t(key, { count }) };
    }
    if (location.state?.editedRecipient) {
      return { type: 'success', description: t('manageMaterial.notificationSettings.messages.recipientUpdated') };
    }
    return location.state?.alert || null;
  });

  const requestParams = useMemo(
    () => ({ ndcNumber: selectedTherapy?.ndc || selectedTherapy?.ndcNumber, channelType: selectedTherapy?.channelType }),
    [selectedTherapy]
  );

  const {
    data: notificationConfig,
    isLoading: isNotificationConfigLoading,
    isFetching: isNotificationConfigFetching
  } = useQuery(
    ['MaterialNotificationConfig', requestParams.ndcNumber, requestParams.channelType],
    () => MaterialService.getMaterialNotificationConfig(requestParams),
    { enabled: isSingleTherapy && !!requestParams.ndcNumber && !!requestParams.channelType, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (!notificationConfig || !isSingleTherapy) return;

    const orderSubmitConfig = notificationConfig[NOTIFICATION_TYPES.ORDER_SUBMIT] || notificationConfig.order_submit;
    const patientIngestionConfig = notificationConfig[NOTIFICATION_TYPES.PATIENT_INGESTION] || notificationConfig.patient_ingestion;

    if (isReturningFromRecipientPage) {
      setTabState((prev) => ({
        1: {
          notifications: prev[1]?.notifications ?? orderSubmitConfig?.isCustomerServiceEnabled ?? true,
          addRecipients: prev[1]?.addRecipients ?? orderSubmitConfig?.isAdditionalRecipientEnabled ?? true,
          recipients: prev[1]?.recipients ?? orderSubmitConfig?.recipients ?? []
        },
        2: {
          notifications: prev[2]?.notifications ?? patientIngestionConfig?.isCustomerServiceEnabled ?? true,
          addRecipients: prev[2]?.addRecipients ?? patientIngestionConfig?.isAdditionalRecipientEnabled ?? true,
          recipients: prev[2]?.recipients ?? patientIngestionConfig?.recipients ?? []
        }
      }));
    } else {
      setTabState({
        1: {
          notifications: orderSubmitConfig?.isCustomerServiceEnabled ?? true,
          addRecipients: orderSubmitConfig?.isAdditionalRecipientEnabled ?? true,
          recipients: orderSubmitConfig?.recipients ?? []
        },
        2: {
          notifications: patientIngestionConfig?.isCustomerServiceEnabled ?? true,
          addRecipients: patientIngestionConfig?.isAdditionalRecipientEnabled ?? true,
          recipients: patientIngestionConfig?.recipients ?? []
        }
      });
    }
  }, [notificationConfig, isSingleTherapy]);

  const currentTabState = tabState[selectedTab] || {};
  const currentNotificationValue = currentTabState.notifications ?? true;
  const currentAddRecipients = currentTabState.addRecipients ?? true;
  const addRecipientsValue = currentAddRecipients ? 'yes' : 'no';
  const currentRecipients = currentTabState.recipients ?? [];

  const handleOnBackToMaterial = () => navigate(materialRoute);

  const getConfigSavedMessage = () => {
    const count = therapyList.length;
    return count === 1
      ? t('manageMaterial.notificationSettings.messages.configSavedMaterial', { count })
      : t('manageMaterial.notificationSettings.messages.configSavedMaterials', { count });
  };

  const navigateBackToMaterial = (description) => {
    navigate(materialRoute, { state: { alert: { type: 'success', description } } });
  };

  const { mutate: saveConfig, isLoading: isSaving } = useMutation((payload) => MaterialService.updateMaterialNotificationConfigsBulk(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['MaterialNotificationConfig']);
      navigateBackToMaterial(getConfigSavedMessage());
    },
    onError: (error) => {
      console.error('Failed to save notification config:', error);
      setAlert({ type: 'error', description: t('errors.default') });
    }
  });

  const isControlsDisabled = isNotificationConfigLoading || isNotificationConfigFetching || isSaving;

  const notificationHeadingKey = selectedTab === 2
    ? 'manageMaterial.notificationSettings.Tab2.heading.notifications'
    : 'manageMaterial.notificationSettings.heading.notifications';

  const notificationSubHeadingKey = selectedTab === 2
    ? 'manageMaterial.notificationSettings.Tab2.subHeading.notifications'
    : 'manageMaterial.notificationSettings.subHeading.notifications';

  const addRecipientsLabelKey = selectedTab === 2
    ? 'manageMaterial.notificationSettings.Tab2.label.addRecipients'
    : 'manageMaterial.notificationSettings.label.addRecipients';

  const handleSave = () => {
    saveConfig(buildCombinedNotificationPayload({ therapy, tabState }));
  };

  const notificationConfigId = isSingleTherapy
    ? notificationConfig?.[NOTIFICATION_TYPES.ORDER_SUBMIT]?.id || notificationConfig?.[NOTIFICATION_TYPES.PATIENT_INGESTION]?.id || navigationConfigId
    : undefined;

  const handleOnOptionSelection = (value, row) => {
    if (value === 'edit') {
      navigate(addRecipientsRoute, {
        state: {
          therapy,
          isEdit: true,
          recipient: row,
          currentEmail: row?.email,
          selectedTab,
          tabState,
          notificationConfigId,
          existingRecipients: currentRecipients
        }
      });
      return;
    }

    if (value === 'delete') {
      setTabState((prev) => ({
        ...prev,
        [selectedTab]: { ...prev[selectedTab], recipients: (prev[selectedTab]?.recipients || []).filter((r) => r.email !== row.email) }
      }));
      setAlert({ type: 'success', description: t('manageMaterial.notificationSettings.messages.recipientDeleted') });
    }
  };

  const handleAddRecipient = () => {
    navigate(addRecipientsRoute, {
      state: { therapy, isEdit: false, selectedTab, tabState, notificationConfigId, existingRecipients: currentRecipients }
    });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToMaterial} size="md">
          {t('manageMaterial.notificationSettings.backToManageMatierial')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageMaterial.notificationSettings.heading')}</Heading>} />

        {alert && <Alert description={alert.description || alert.message} onClose={() => setAlert(null)} type={alert.type} />}

        <div className="MCP-panel-container">
          <div style={{ padding: '0px 16px' }}>
            <div className="customTab">
              <TabList
                options={TAB_LIST.map((tab) => ({
                  ...tab,
                  configName: t(tab.configName),
                  labelForMobile: t(tab.labelForMobile),
                  isActiveTab: tab.id === selectedTab
                }))}
                alignment="left"
                onTabClick={(newTab) => setSelectedTab(newTab.id)}
                showShadow={false}
                variant="text"
                useAsButton
                aria-label={t('controls.ariaLabels.orderTabList')}
              />
            </div>
          </div>

          <div className={styles.notificationSetting}>
            <div className={styles.notificationInfo}>
              <Heading as="h3">{t(notificationHeadingKey)}</Heading>
              <span>{t(notificationSubHeadingKey)}</span>
            </div>
            <div className={styles.notificationControl}>
              <Switch
                id="notification-switch"
                labelPosition="right"
                size="lg"
                checked={currentNotificationValue}
                onChange={() => setTabState((prev) => ({ ...prev, [selectedTab]: { ...prev[selectedTab], notifications: !currentNotificationValue } }))}
              />
            </div>
          </div>

          <div className={styles.recipientQuestion}>
            <Heading as="h4">{t(addRecipientsLabelKey)}</Heading>
            <RadioGroup
              direction="row"
              radioBtnWidth="auto"
              size="lg"
              value={addRecipientsValue}
              items={[
                { label: 'Yes', value: 'yes', isDisabled: !currentNotificationValue },
                { label: 'No', value: 'no', isDisabled: !currentNotificationValue }
              ]}
              onChangeValue={(value) =>
                setTabState((prev) => ({
                  ...prev,
                  [selectedTab]: { ...prev[selectedTab], addRecipients: value === 'yes' }
                }))
              }
            />
          </div>

          <div className={styles.recipientSection}>
            <div className={styles.recipientSectionHeader}>
              <Heading as="h3">{t('manageMaterial.notificationSettings.recipientsTable.heading')}</Heading>
              <Button
                type="button"
                Icon={AddCircleFilled}
                className="button-icon"
                size="md"
                disabled={!currentNotificationValue || !currentAddRecipients || isControlsDisabled}
                onClick={handleAddRecipient}>
                {t('manageMaterial.notificationSettings.button.addRecipient')}
              </Button>
            </div>
            <div className={styles.dataTable}>
              <RecipientListProvider key={selectedTab} recipients={currentRecipients}>
                <RecipientList
                  handleOnOptionSelection={handleOnOptionSelection}
                  isActionsDisabled={!currentNotificationValue || !currentAddRecipients || isControlsDisabled}
                />
              </RecipientListProvider>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <Button type="button" size="md" variant="secondary" onClick={handleOnBackToMaterial}>
              {t('manageMaterial.notificationSettings.button.cancel')}
            </Button>
            <Button type="button" size="md" onClick={handleSave} disabled={isControlsDisabled}>
              {t('manageMaterial.notificationSettings.button.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialNotificationSettings;
