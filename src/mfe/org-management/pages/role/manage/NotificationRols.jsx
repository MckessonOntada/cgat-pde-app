import React, { useEffect, useState } from 'react';
import { Button, Loader, Switch, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import PageHeader from '@src/components/pageHeader';
import { useTranslate } from '@src/translations/useTranslation';
import Alert from '@src/components/cgat-alert/Alert';
import style from './Roles.module.scss';
import { INITIAL_PREFERENCES, COMMUNICATION_PREFERENCES } from '../constants';

const NotificationRoles = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const location = useLocation();
  const [alert, setAlert] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { isEdit } = location.state || {};
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);

  const forms = React.useMemo(
    () => [
      {
        name: 'roleDetails',
        label: t('orgManagement.role.labelRolesDetails')
      },
      {
        name: 'addPermissions',
        label: t('orgManagement.role.labelAddPermissions')
      },
      {
        name: 'addNotificationPermissions',
        label: t('orgManagement.role.labelAddNotificationPermissions')
      }
    ],
    [t]
  );

  const handleToggleSetPreference = (sectionKey, itemKey) => {
    const current = preferences[sectionKey][itemKey];
    const updated = {
      ...preferences,
      [sectionKey]: {
        ...preferences[sectionKey],
        [itemKey]: {
          ...current,
          setPreference: !current.setPreference,
          email: false,
          inApp: false,
          sms: false
        }
      }
    };
    setPreferences(updated);
  };

  const handleToggleChannel = (sectionKey, itemKey, channel) => {
    const current = preferences[sectionKey][itemKey];
    const updated = {
      ...preferences,
      [sectionKey]: {
        ...preferences[sectionKey],
        [itemKey]: {
          ...current,
          [channel]: !current[channel]
        }
      }
    };
    setPreferences(updated);
  };

  const handleGoBack = () => {
    navigate(isEdit ? `/admin/organization/roles/${roleId}` : `/admin/organization/roles/${roleId}/permissions`, {
      state: { ...location.state, backFromPreferences: true }
    });
  };
  const handleSubmit = () => {
    console.log('Submitting preferences:', preferences);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('orgManagement.role.captionsBtnBackToManageRoles')}
        </Button>
      </div>

      <ModuleHeader heading={<PageHeader heading={t('orgManagement.role.labelAddRole')} />} />
      {isAlertVisible && <Alert type={alert.type} title={alert.title} description={alert.description} />}

      <div className="MCP-module-body">
        <div>
          <div className="MCP-panel-container">
            <div className="MCP-panel-header grid grid-gap-16 grid-cols-2">
              <div className="styled-heading">
                <Heading as="h2">{t('Communication Preference')}</Heading>
              </div>
              <div className="row">
                <div className={style.switchesHeading + ' grid grid-gap-16 grid-cols-4'}>
                  <p>{t('Set Preference?')}</p>
                  <p>{t('Email')}</p>
                  <p>{t('In-App')}</p>
                  <p>{t('SMS')}</p>
                </div>
              </div>
            </div>

            {COMMUNICATION_PREFERENCES.map((section) => (
              <div
                key={section.sectionKey}
                className={`${style.permissionPanel} ${section.sectionKey === 'onBehalfOf' ? 'grid grid-gap-16 grid-cols-2 ' + style.onBehalfOf : ''}`}>
                <div className={style.sectionHeader}>
                  <Heading as="h3">{section.sectionTitle}</Heading>
                  {section.sectionDescription && <p className={style.sectionDescription}>{section.sectionDescription}</p>}
                </div>
                {section.sectionKey !== 'onBehalfOf' ? (
                  section.items.map((item) => {
                    const itemData = preferences[section.sectionKey][item.itemKey];
                    return (
                      <div key={item.itemKey} className={`grid grid-gap-16 grid-cols-2`}>
                        <div className={style.itemContent}>
                          <Heading as="h4">{item.itemTitle}</Heading>
                          <p className={style.itemDescription}>{item.itemDescription}</p>
                        </div>
                        <div className={`${style.switches} grid grid-gap-16 grid-cols-4`}>
                          {item.switches.map((sw) => {
                            const isDisabled = sw.disabledIf ? !itemData[sw.disabledIf] : false;
                            const handleToggle =
                              sw.field === 'setPreference'
                                ? () => handleToggleSetPreference(section.sectionKey, item.itemKey)
                                : () => handleToggleChannel(section.sectionKey, item.itemKey, sw.field);

                            return (
                              <Switch
                                key={sw.field}
                                handleToggle={handleToggle}
                                id={`${section.sectionKey}-${item.itemKey}-${sw.field}`}
                                disabled={isDisabled}
                                label={''}
                                labelPosition="right"
                                name={`${section.sectionKey}-${item.itemKey}-${sw.field}`}
                                size="lg"
                                value={itemData[sw.field]}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={`${style.switches} grid grid-gap-16 grid-cols-4`}>
                    {section.items[0].switches.map((sw) => {
                      const itemData = preferences[section.sectionKey][section.items[0].itemKey];
                      const isDisabled = sw.disabledIf ? !itemData[sw.disabledIf] : false;
                      const handleToggle =
                        sw.field === 'setPreference'
                          ? () => handleToggleSetPreference(section.sectionKey, section.items[0].itemKey)
                          : () => handleToggleChannel(section.sectionKey, section.items[0].itemKey, sw.field);

                      return (
                        <Switch
                          key={sw.field}
                          handleToggle={handleToggle}
                          id={`${section.sectionKey}-${section.items[0].itemKey}-${sw.field}`}
                          disabled={isDisabled}
                          label={''}
                          labelPosition="right"
                          name={`${section.sectionKey}-${section.items[0].itemKey}-${sw.field}`}
                          size="lg"
                          value={itemData[sw.field]}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={'buttonGroup'}>
          <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
            {t('back')}
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit} size={'md'}>
            {t('Create Role')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationRoles;
