import { useTranslate } from '@src/translations/useTranslation';
import { Stepper } from '@mckesson/mcp-component-library';
import React from 'react';
import { useWidgetContext } from '@src/context/WidgetContext';
import AuthUtils from '@src/util/AuthUtils';

const STEPS = {
  USER_DETAILS: 'userManagement.stepper.option.user_details',
  ROLE_AND_PERMISSIONS: 'userManagement.stepper.option.roles_and_permissions',
  ASSOCIATED_ACCOUNTS: 'userManagement.stepper.option.associate_accounts',
  ASSOCIATE_MATERIALS: 'userManagement.stepper.option.associate_materials'
};

function UserCreationStepper({ activeIndex }) {
  const { t } = useTranslate();
  const { state } = useWidgetContext();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const selectedRole = state.selectedRole;
  const steps = React.useMemo(() => {
    const userCreationSteps = [STEPS.USER_DETAILS, STEPS.ROLE_AND_PERMISSIONS];
    if (isSystemAdminView) {
      if (selectedRole === 'Customer Centre') userCreationSteps.push(STEPS.ASSOCIATE_MATERIALS);
    } else {
      userCreationSteps.push(STEPS.ASSOCIATED_ACCOUNTS, STEPS.ASSOCIATE_MATERIALS);
    }

    return userCreationSteps;
  }, [selectedRole]);

  if (isSystemAdminView && steps.length <= 2 && selectedRole !== 'Customer Centre') return null;
  return <Stepper activeIndex={activeIndex} dividerText="of" stepHeaders={steps.map((x) => ({ label: t(x) }))} />;
}

export default React.memo(UserCreationStepper);
