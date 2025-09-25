import React, { useEffect, useState, useCallback } from 'react';
import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import style from './Style.module.scss';
import UserService from '@src/api/commonService/UserService';
import PhoneInput from '@src/components/form/PhoneInput';
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';

function SMSConfiguration({ linkedContactNumber = '', setAlert, setLinkedNumber }) {
  const { t: translateFn } = useTranslate();

  const [isSubscribed, setIsSubscribed] = useState(Boolean(linkedContactNumber));
  const [phone, setPhone] = useState(linkedContactNumber);
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
    } else if (!isValidPhoneNumber(phone)) {
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

        UserService.subscribeSmsNotification(phone)
          .then(() => {
            setIsSubscribed(true);
            setLinkedNumber(phone);
            setAlert({
              description: translateFn('smsSubscription.phoneNumberUpdated'),
              type: 'success'
            });
          })
          .catch(() => {
            setAlert({
              description: translateFn('smsSubscription.phoneNumberUpdateFailed'),
              type: 'error'
            });
          });
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
            disabled={isSubscribed}
            error={error}
            className={`phone-input-field ${error ? 'outline-error' : ''}`}
            isRequired={false}
            size="sm"
          />
        </div>
        <p className={style.details}>{translateFn('smsConfiguration.description')}</p>
      </div>
      <Tooltip body={tooltipContent}>
        <Switch id="sms-config-switch" size="lg" checked={isSubscribed} onChange={handleSwitchChange} />
      </Tooltip>
    </div>
  );
}

export default SMSConfiguration;
