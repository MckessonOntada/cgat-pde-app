import { useTranslate } from '@src/translations/useTranslation';
import { Stepper } from '@mckesson/mcp-component-library';
import React from 'react';

const stepHeaders = [
  'userManagement.stepper.option.user_details',
  'userManagement.stepper.option.roles_and_permissions',
  'userManagement.stepper.option.associate_accounts',
  'userManagement.stepper.option.associate_materials'
];

function UserCreationStepper({ activeIndex }) {
  const { t } = useTranslate();

  const translatedHeaders = React.useMemo(() => stepHeaders.map((h) => ({ label: t(h) })), [t]);

  return <Stepper activeIndex={activeIndex} dividerText="of" stepHeaders={translatedHeaders} />;
}

export default React.memo(UserCreationStepper);
