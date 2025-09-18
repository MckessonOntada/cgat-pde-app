import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { Field, useFormikContext } from 'formik';
import style from './Style.module.scss';
import React from 'react';

function SMSConfiguration() {
  const { t: translateFn } = useTranslate();
  const { values, setFieldValue, setFieldError, setFieldTouched } = useFormikContext();

  const handleOnChange = (e) => {
    const isChecked = e.target.checked;
    setFieldValue('subscribeSMSNotification', isChecked);
    if (!isChecked) {
      setFieldValue('linkedContactNumber', '');
      setFieldError('linkedContactNumber', '');
      setFieldTouched('linkedContactNumber', false);
    } else {
      setFieldError('linkedContactNumber', '');
      setFieldTouched('linkedContactNumber', false);
    }
  };

  return (
    <div className={style['sms-config-wrapper']}>
      <div className={style.info}>
        <div className={style.field}>
          <label className={style.heading}>{translateFn('smsConfiguration.enableSMSNotification')}</label>
          <Field component={Components['phoneInput']} name="linkedContactNumber" disabled={!values.subscribeSMSNotification} isRequired={false} size="sm" />
        </div>
        <p className={style.details}>{translateFn('smsConfiguration.description')}</p>
      </div>
      <div>
        <Tooltip body="Option tooltip">
          <Switch id="sms-config-switch" size="lg" checked={values.subscribeSMSNotification} onChange={handleOnChange} />
        </Tooltip>
      </div>
    </div>
  );
}

export default SMSConfiguration;
