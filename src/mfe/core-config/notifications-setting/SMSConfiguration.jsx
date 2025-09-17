import React from 'react';
import { Switch, Tooltip, Heading } from '@mckesson/mcp-component-library';
import style from './Style.module.scss';
import InputField from '@src/components/form/InputField';

function SMSConfiguration({ value, onChange }) {
  return (
    <div className={style['sms-config-wrapper']}>
      <div className={style.info}>
        <div className={style.field}>
          Enable SMS Notifications: <InputField name="linkedContactNumber" value={value} onChange={(e) => onChange(e.target.value)} size="sm" />
        </div>
        <p>
          To update the phone number, switch Enable SMS Notifications to Off, change the phone number, then switch Enable SMS Notifications to On. You will then
          receive a new SMS invitation to the new phone number.
        </p>
      </div>
      <div>
        <Tooltip body={'Option tooltip'}>
          <Switch id={`sms-config-switch`} size="lg" checked={true} onChange={() => {}} />
        </Tooltip>
      </div>
    </div>
  );
}

export default SMSConfiguration;
