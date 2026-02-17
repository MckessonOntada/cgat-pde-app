import React from 'react';
import { Switch, Tooltip as MCPTooltip, Pills } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useFormikContext } from 'formik';
import style from './style.module.scss';

const NotificationPreferencePanel = ({
  config,
  allPreferred = false,
  showTooltip = false,
  readOnly = true,
  showLabel = true,
  isLoadingPreferences,
  isPreferencesLoaded,
  emptyData
}) => {
  const { t: translateFn } = useTranslate();
  const { moduleName, options, sections, userPermissions } = config;
  const { values, setFieldValue } = useFormikContext();
  const handleOnChange = (e, keyPath) => setFieldValue(keyPath, e.target.checked);
  const handleHeaderChange = (sectionIndex, index) => (e) => handleOnChange(e, `sections[${sectionIndex}].optionValues[${index}].value`);
  const handleRowChange = (sectionIndex, rowIndex, index) => (e) =>
    handleOnChange(e, `sections[${sectionIndex}].rows[${rowIndex}].optionValues[${index}].value`);

  const preferenceSections = sections.map((section, sectionIndex) => {
    const { title, subtitle, rows = [], optionValues, permissions } = section;
    let _hasPermission;
    if (permissions && Array.isArray(permissions)) {
      _hasPermission = permissions.some((permission) => userPermissions.includes(permission));
    } else {
      _hasPermission = userPermissions.includes(permissions);
    }
    if (!_hasPermission || !permissions) return null;

    return (
      <div className={style.section} key={`section-${sectionIndex}`}>
        <div className={`${style.grid} ${style.header}`}>
          <div className={style.info}>
            <div className={style.heading}>{translateFn(title)}</div>
            <p className={style.details}>{translateFn(subtitle)}</p>
          </div>
          <div className={style.options}>
            {optionValues &&
              options.map((optionKey, index) => {
                const { isPreferred } = optionValues[index] || {};
                const isDisabled = !isPreferencesLoaded || isPreferred || isLoadingPreferences;
                const controlValue = values.sections?.[sectionIndex]?.optionValues?.[index].value ?? false;
                const tooltipKey = isPreferred
                  ? 'notificationPreferences.optionNotAllowed'
                  : controlValue
                  ? 'notificationPreferences.unsubscribePreference'
                  : 'notificationPreferences.subscribePreference';
                return (
                  <div
                    style={{
                      justifyContent: showLabel ? 'flex-start' : 'center'
                    }}
                    className={style.option}
                    key={`section-${sectionIndex}-header-option-${index}`}>
                    {readOnly ? (
                      <Pills
                        id={`notification-setting-${sectionIndex}-header-${optionKey}-pill-label`}
                        key={`notification-setting-${sectionIndex}-header-${optionKey}-pill-label`}
                        labels={[
                          {
                            id: `notification-setting-${sectionIndex}-header-${optionKey}-pill-label`,
                            labelText: controlValue ? translateFn('label.Enabled') : translateFn('label.No_Preference')
                          }
                        ]}
                        name="Pill"
                        size="md"
                        variant={controlValue ? 'secondary' : 'primary'}
                      />
                    ) : (
                      <Tooltip body={showTooltip && translateFn(tooltipKey)}>
                        <div className={style['switch-control']}>
                          <Switch
                            id={`notification-setting-${sectionIndex}-header-${optionKey}`}
                            size="lg"
                            disabled={allPreferred ? false : isDisabled}
                            {...(showLabel
                              ? {
                                  label: controlValue ? translateFn('label.Enabled') : translateFn('label.No_Preference'),
                                  labelPosition: 'right'
                                }
                              : {})}
                            checked={controlValue}
                            onChange={handleHeaderChange(sectionIndex, index)}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        {rows.length > 0 && (
          <div className={style.rows}>
            {rows.map((row, rowIndex) => {
              const { title, subtitle, optionValues: rowOptionValues } = row;
              return (
                <div className={style.grid} key={`section-${sectionIndex}-row-${rowIndex}`}>
                  <div className={style.info}>
                    <div className={style.heading}>{translateFn(title)}</div>
                    <p className={style.details}>{translateFn(subtitle)}</p>
                  </div>
                  <div className={style.options}>
                    {options.map((optionKey, index) => {
                      const { isPreferred = false } = rowOptionValues[index] || {};
                      const controlValue = values.sections?.[sectionIndex]?.rows?.[rowIndex]?.optionValues?.[index]?.value ?? false;
                      const isDisabled = !isPreferencesLoaded || isPreferred || isLoadingPreferences;
                      const tooltipKey = isPreferred
                        ? 'notificationPreferences.optionNotAllowed'
                        : controlValue
                        ? 'notificationPreferences.unsubscribePreference'
                        : 'notificationPreferences.subscribePreference';
                      return (
                        <React.Fragment>
                          <div
                            style={{
                              justifyContent: showLabel ? 'flex-start' : 'center'
                            }}
                            className={style.option}
                            key={`section-${sectionIndex}-row-${rowIndex}-option-${index}`}>
                            {readOnly ? (
                              <Pills
                                id={`notification-setting-${sectionIndex}-header-${optionKey}`}
                                key={`notification-setting-${sectionIndex}-header-${optionKey}`}
                                labels={[
                                  {
                                    id: `notification-setting-${sectionIndex}-header-${optionKey}-pill-label`,
                                    labelText: controlValue ? translateFn('label.Enabled') : translateFn('label.No_Preference')
                                  }
                                ]}
                                name="Pill"
                                size="md"
                                variant={controlValue ? 'secondary' : 'primary'}
                              />
                            ) : (
                              <Tooltip body={showTooltip && translateFn(tooltipKey)}>
                                <div className={style['switch-control']}>
                                  <Switch
                                    id={`notification-setting-${sectionIndex}-${rowIndex}-${optionKey}`}
                                    size="lg"
                                    disabled={allPreferred ? false : isDisabled}
                                    {...(showLabel
                                      ? {
                                          label: controlValue ? translateFn('label.Enabled') : translateFn('label.No_Preference'),
                                          labelPosition: 'right'
                                        }
                                      : {})}
                                    checked={controlValue}
                                    onChange={handleRowChange(sectionIndex, rowIndex, index)}
                                  />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  });

  if (preferenceSections.filter((key) => Boolean(key)).length <= 0) return emptyData;

  return (
    <div className={style['notification-setting']}>
      <div className={style.grid}>
        <div className={style['module-header']}>{translateFn(moduleName)}</div>
        <div className={style.options}>
          {options.map((key) => (
            <div
              style={{
                justifyContent: showLabel ? 'flex-start' : 'center'
              }}
              className={`${style.option} ${style.header}`}
              key={`option-column-${key}`}>
              {translateFn(key)}
            </div>
          ))}
        </div>
      </div>

      <div className={style.sections}>{preferenceSections}</div>
    </div>
  );
};

function Tooltip(props) {
  const { body } = props;
  if (!body) return props.children;
  return (
    <MCPTooltip body={body} {...props}>
      {props.children}
    </MCPTooltip>
  );
}

export default NotificationPreferencePanel;
