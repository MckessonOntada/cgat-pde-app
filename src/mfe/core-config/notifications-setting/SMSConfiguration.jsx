import React, { useCallback } from 'react';
import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import style from './Style.module.scss';
import UserService from '@src/api/commonService/UserService';
import PhoneInputFormik from '@src/components/form/formik/PhoneInputFormik';
import PhoneInput from '@src/components/form/PhoneInput';
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';

function SMSConfiguration({ linkedContactNumber = '', setAlert }) {
  const { t: translateFn } = useTranslate();
  const [isSubscribeSMSNotification, setIsSubscribeSMSNotification] = React.useState(Boolean(linkedContactNumber));
  const [form, setForm] = React.useState({
    value: linkedContactNumber,
    error: null
  });

  const isValidPhoneNumber = (number = '') => number.match(PHONE_REGEX);

  const handleOnChange = (e) => {
    if (!form.value) {
      setForm({
        ...form,
        error: translateFn('message.phoneNumberRequired')
      });
      return;
    } else if (!isValidPhoneNumber(form.value)) {
      setForm({
        ...form,
        error: translateFn('message.enterPhoneNumber')
      });
      return;
    }
    const isChecked = e.target.checked;
    if (isChecked) {
      if (isValidPhoneNumber(form.value)) {
        UserService.subscribeSmsNotification(form.value)
          .then(() => {
            setIsSubscribeSMSNotification(isChecked);
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
        setForm({
          ...form,
          error: translateFn('message.enterPhoneNumber')
        });
      }
    } else {
      setIsSubscribeSMSNotification(isChecked);
    }
  };

  const handleOnInput = (value) => {
    setForm({
      value,
      error: null
    });
  };

  const handleOnBlur = () => {
    if (!form.value) {
      setForm({
        ...form,
        error: translateFn('message.phoneNumberRequired')
      });
    } else if (!isValidPhoneNumber(form.value)) {
      setForm({
        ...form,
        error: translateFn('message.enterPhoneNumber')
      });
    }
  };

  return (
    <div className={style['sms-config-wrapper']}>
      <div className={style.info}>
        <div className={style.field}>
          <label className={style.heading}>{translateFn('smsConfiguration.enableSMSNotification')}</label>
          <PhoneInput
            name="linkedContactNumber"
            onBlurFn={handleOnBlur}
            onChangeFn={handleOnInput}
            disabled={isSubscribeSMSNotification}
            value={form.value}
            error={form.error}
            className={`phone-input-field ${form.error ? 'outline-error' : ''}`}
            isRequired={false}
            size="sm"
          />
        </div>
        <p className={style.details}>{translateFn('smsConfiguration.description')}</p>
      </div>
      <div>
        <Tooltip
          body={
            isSubscribeSMSNotification
              ? translateFn('smsConfiguration.switchTooltip')
              : translateFn(!form.value ? 'smsConfiguration.switchTooltipEnterPhoneNumber' : 'smsConfiguration.switchTooltipSavePhoneNumber', {
                  number: form.value
                })
          }>
          <Switch id="sms-config-switch" size="lg" checked={isSubscribeSMSNotification} onChange={handleOnChange} />
        </Tooltip>
      </div>
    </div>
  );
}

export default SMSConfiguration;
