import React, { useMemo } from 'react';
import { Button, Heading, TabList, Switch, RadioGroup, CustomDataTable } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { Field, Formik, Form } from 'formik';

import styles from './MaterialNotificationSettings.module.scss';
import { routeConstants } from '../routes/constants';

const recipientData = [
  {
    name: 'John Doe',
    email: 'john.doe@mckesson.com',
    updatedDate: '07/01/2026'
  },
  {
    name: 'Roger Stuart',
    email: 'rogerstuart@mckesson.com',
    updatedDate: '06/29/2026'
  },
  {
    name: 'Andrew James',
    email: 'andrewjames@mckesson.com',
    updatedDate: '06/29/2026'
  },
  {
    name: 'Joe Billings',
    email: 'joebillings@mckesson.com',
    updatedDate: '07/01/2026'
  }
];

const MaterialNotificationSettings = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const therapy = location.state?.therapy;

  const tabList = [
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

  const columns = useMemo(
    () => [
      {
        id: 'name',
        name: 'Name',
        selector: (row) => row.name || '-',
        width: '30%',
        sortable: true,
        sortKey: 'name'
      },
      {
        id: 'email',
        name: 'Email',
        selector: (row) => row.email || '-',
        width: '37%',
        sortable: false
      },
      {
        id: 'updatedDate',
        name: 'Updated Date',
        selector: (row) => row.updatedDate || '-',
        width: '20%',
        sortable: true,
        sortKey: 'updatedDate'
      },
      {
        id: 'action',
        name: 'Action(s)',
        isAction: true,
        width: '13%'
      }
    ],
    []
  );

  const handleOnBackToMaterial = () => {
    navigate(-1);
  };

  const handleAddRecipient = () => {
    navigate(routeConstants.ADD_RECIPIENTS, {
      state: {
        therapy
      }
    });
  };

  const handleSubmit = async (values) => {
    const payload = {
      selectedTab: values.selectedTab,
      notifications: values.notifications,
      addRecipients: values.addRecipients,
      therapy: values.therapy
    };

    console.log('Notification Settings API Payload:', payload);
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

        <Formik
          initialValues={{
            selectedTab: 1,
            notifications: true,
            addRecipients: 'yes',
            therapy
          }}
          onSubmit={handleSubmit}>
          {({ values, setFieldValue, setFieldTouched }) => (
            <Form>
              <div className="MCP-panel-container">
                <div style={{ padding: '0px 16px' }}>
                  <div className="customTab">
                    <TabList
                      options={tabList.map((tab) => ({
                        ...tab,
                        configName: t(tab.configName),
                        labelForMobile: t(tab.labelForMobile),
                        isActiveTab: tab.id === values.selectedTab
                      }))}
                      alignment="left"
                      onTabClick={(newTab) => {
                        setFieldValue('selectedTab', newTab.id);

                        setFieldTouched('selectedTab', true, false);
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
                            value: 'yes'
                          },
                          {
                            label: 'No',
                            value: 'no'
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
                      disabled={values.addRecipients !== 'yes'}
                      onClick={handleAddRecipient}>
                      {t('manageMaterial.notificationSettings.button.addRecipient')}
                    </Button>
                  </div>

                  <div className={styles.dataTable}>
                    <CustomDataTable id="recipient-data-table" type="normal" columns={columns} data={recipientData} pagination={false} />
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <div className={styles.footerContent}>
                  <Button type="button" size="md" variant="secondary" onClick={handleOnBackToMaterial}>
                    {t('manageMaterial.notificationSettings.button.cancel')}
                  </Button>

                  <Button type="submit" size="md">
                    {t('manageMaterial.notificationSettings.button.save')}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MaterialNotificationSettings;
