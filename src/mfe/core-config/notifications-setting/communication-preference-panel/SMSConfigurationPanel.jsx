import React, { useEffect, useState, useCallback } from 'react';
import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import style from './style.module.scss';
import PhoneInput from '@src/components/form/PhoneInput';
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';

function SMSConfigurationPanel({ isLoadingVerification, onSave, linkedContactNumber = '', setAlert }) {
  const { t: translateFn } = useTranslate();

  const [phone, setPhone] = useState(linkedContactNumber);
  const [isSubscribed, setIsSubscribed] = useState(Boolean(linkedContactNumber));
  const [error, setError] = useState(null);

  useEffect(() => {
    setPhone(linkedContactNumber);
    setIsSubscribed(Boolean(linkedContactNumber));
    setError(null);
  }, [linkedContactNumber]);

  const isValidPhoneNumber = useCallback((number = '') => PHONE_REGEX.test(number), []);

  const validatePhone = useCallback(() => {
    if (!phone) {
      setError(translateFn('message.phoneNumberRequired'));
      return false;
    }
    if (!isValidPhoneNumber(phone)) {
      setError(translateFn('message.enterPhoneNumber'));
      return false;
    }
    setError(null);
    return true;
  }, [phone, isValidPhoneNumber, translateFn]);

  const handleSwitchChange = useCallback(
    (e) => {
      const checked = e.target.checked;

      if (checked) {
        if (!validatePhone()) return;
        if (onSave) {
          onSave(phone);
        }
      } else {
        setIsSubscribed(false);
      }
    },
    [phone, validatePhone, setAlert, translateFn]
  );

  const handleInputChange = useCallback((value) => {
    setPhone(value);
    setError(null);
  }, []);

  const handleInputBlur = useCallback(() => {
    validatePhone();
  }, [validatePhone]);

  const tooltipContent = isSubscribed
    ? translateFn('smsConfiguration.switchTooltip')
    : !phone
    ? translateFn('smsConfiguration.switchTooltipEnterPhoneNumber')
    : translateFn('smsConfiguration.switchTooltipSavePhoneNumber', { number: phone });

  return (
    <div className={style['sms-config-wrapper']}>
      <div className={style.info}>
        <div className={style.field}>
          <label className={style.heading}>{translateFn('smsConfiguration.enableSMSNotification')}</label>
          <PhoneInput
            name="linkedContactNumber"
            value={phone}
            onChangeFn={handleInputChange}
            onBlurFn={handleInputBlur}
            disabled={isSubscribed || isLoadingVerification}
            error={error}
            className={`phone-input-field ${error ? 'outline-error' : ''}`}
            isRequired={false}
            size="sm"
          />
        </div>
        <p className={style.details}>{translateFn('smsConfiguration.description')}</p>
      </div>

      <Tooltip body={tooltipContent}>
        <Switch id="sms-config-switch" size="lg" disabled={isLoadingVerification} checked={isSubscribed} onChange={handleSwitchChange} />
      </Tooltip>
    </div>
  );
}

export default SMSConfigurationPanel;
