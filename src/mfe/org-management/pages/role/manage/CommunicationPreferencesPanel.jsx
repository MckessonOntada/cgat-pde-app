import React from 'react';
import { Heading, Switch, Pills } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { COMMUNICATION_PREFERENCES, INITIAL_PREFERENCES } from '../constants';
import style from './Roles.module.scss';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const CommunicationPreferencesPanel = ({ preferences = INITIAL_PREFERENCES, handleToggleChannel, readOnly, permissions }) => {
  const { t } = useTranslate();
  function groupedPreferences() {
    const groupedAccordingToPermission = COMMUNICATION_PREFERENCES.map((section) => ({
      ...section,
      isHideSection: true
    }));
    permissions.forEach((permission) => {
      if (permission === PERMISSIONS_ENUM.USER_MANAGEMENT.CREATE_USER_FOR_PENDING_USER_REQUEST) {
        groupedAccordingToPermission[0].isHideSection = false;
      } else if (
        [
          PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION,
          PERMISSIONS_ENUM.CREATE_NEW_ORDER.ACCOUNT_SELECTION,
          PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_PATIENTS_DETAILS,
          PERMISSIONS_ENUM.CREATE_NEW_ORDER.UPDATE_ADDITIONAL_DETAILS,
          PERMISSIONS_ENUM.CREATE_NEW_ORDER.SUBMIT_ORDER,
          'REVIEW_ORDER'
        ].includes(permission)
      ) {
        groupedAccordingToPermission[1].isHideSection = false;
      } else if ([PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS, PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER].includes(permission)) {
        groupedAccordingToPermission[2].isHideSection = false;
      } else if (permission === PERMISSIONS_ENUM.USER_MANAGEMENT.ON_BEHALF_OF_USER) {
        groupedAccordingToPermission[3].isHideSection = false;
      }
    });
    return groupedAccordingToPermission;
  }

  const renderSwitchOrPill = (sectionKey, itemKey, sw, itemData) => {
    const handleToggle = () => handleToggleChannel(sectionKey, itemKey, sw.field);

    if (readOnly) {
      return (
        <Pills
          key={sw.field}
          id={sw.field}
          labels={[
            {
              id: 1,
              labelText: itemData[sw.field] ? t('label.Enabled') : t('label.No_Preference')
            }
          ]}
          name="Pill"
          size="md"
          variant={itemData[sw.field] ? 'secondary' : 'primary'}
        />
      );
    }

    return (
      <Switch
        key={sw.field}
        handleToggle={handleToggle}
        id={`${sectionKey}-${itemKey}-${sw.field}`}
        label={itemData[sw.field] ? t('label.Enabled') : t('label.No_Preference')}
        labelPosition="right"
        name={`${sectionKey}-${itemKey}-${sw.field}`}
        size="lg"
        value={itemData[sw.field]}
      />
    );
  };
  return (
    <div className="MCP-panel-container">
      <div className="MCP-panel-header grid grid-gap-16 grid-cols-2">
        <div className="styled-heading">{!readOnly && <Heading as="h2">{t('label.Communication_Preference')}</Heading>}</div>
        <div className="row">
          <div className={`${style.switchesHeading} ${readOnly ? style.headingReadOnly : ''} grid grid-gap-16 grid-cols-3`}>
            <p>{t('label.Email')}</p>
            <p>{t('label.In-App')}</p>
            <p>{t('label.SMS')}</p>
          </div>
        </div>
      </div>
      {groupedPreferences().map((section) => {
        if (section.isHideSection) return null;
        return (
          <div
            key={section.sectionKey}
            className={`${style.permissionPanel} ${section.sectionKey === 'ON_BEHALF_OF' ? `grid grid-gap-16 grid-cols-2 ${style.onBehalfOf}` : ''}`}>
            <div className={style.sectionHeader}>
              <Heading as="h3">{t(section.sectionTitle)}</Heading>
              {section.sectionDescription && <p className={style.sectionDescription}>{t(section.sectionDescription)}</p>}
            </div>
            {section.sectionKey !== 'ON_BEHALF_OF' ? (
              section.items.map((item) => {
                const itemData = preferences?.[section.sectionKey]?.[item.itemKey];
                if (!itemData) return null;
                return (
                  <div key={item.itemKey} className="grid grid-gap-16 grid-cols-2">
                    <div className={style.itemContent}>
                      <Heading as="h4">{t(item.itemTitle)}</Heading>
                      <p className={style.itemDescription}>{t(item.itemDescription)}</p>
                    </div>
                    <div className={`${style.switches} grid grid-gap-16 grid-cols-3`}>
                      {item.switches.map((sw) => renderSwitchOrPill(section.sectionKey, item.itemKey, sw, itemData))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`${style.switches} grid grid-gap-16 grid-cols-3`}>
                {section.items[0].switches.map((sw) => {
                  const itemData = preferences?.[section.sectionKey]?.[section.items[0].itemKey];
                  return renderSwitchOrPill(section.sectionKey, section.items[0].itemKey, sw, itemData);
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommunicationPreferencesPanel;
