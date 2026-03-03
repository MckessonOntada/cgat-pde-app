import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useRouteMode from '../../routes/useRouteMode';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import UserCreationStepper from './UserCreationStepper';
import ModuleHeader from '@src/components/module-header';
import useActiveRouteHandle from '../../routes/useActiveRouteHandle';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';

const STEPS = [
  { key: 'Personal Details', path: 'personal' },
  { key: 'Role/Permissions', path: 'permissions' },
  { key: 'Accounts', path: 'accounts' },
  { key: 'Materials', path: 'materials' }
];

function CreateUserWrapper() {
  const { t: translateFn } = useTranslate();
  const { state } = useWidgetContext();
  const navigate = useNavigate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { isEdit } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });

  const { stepIndex } = useActiveRouteHandle(STEPS);
  const translationConfig = React.useMemo(() => {
    const config = {};
    const isEditHeading = () => {
      if (location.pathname.includes('personal')) return 'Edit Personal Details';
      if (location.pathname.includes('permissions')) return 'Edit User Role';
      if (location.pathname.includes('accounts')) return 'Link Accounts';
      if (location.pathname.includes('material')) return 'Link Materials';
      return '';
    };

    if (isSystemAdminView) {
      config.backButtonLabel = isEdit ? 'Back to user details page' : 'Back to Manage System Admin Page';

      config.heading = isEdit ? isEditHeading() : 'Add System Administrator';
    } else {
      config.backButtonLabel = isEdit ? 'Back to user details page' : 'Back to Manage Users';

      config.heading = isEdit ? isEditHeading() : 'Add Organization User';
    }

    return config;
  }, []);
  const handleOnBack = () => {
    if (isEdit) navigate('..', { relative: 'path' });
    else navigate('..');
  };
  const selectedRole = state.selectedRole;
  const currentStep = React.useMemo(() => {
    if (selectedRole === 'Customer Centre' && isSystemAdminView && stepIndex === 3) return stepIndex - 1;
    return stepIndex;
  }, [selectedRole, stepIndex]);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <div className="stack">
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
              {translateFn(translationConfig.backButtonLabel)}
            </Button>
          </div>
          <ModuleHeader heading={<Heading as="h1">{translateFn(translationConfig.heading)}</Heading>} />
          {!isEdit && <UserCreationStepper activeIndex={currentStep + 1} />}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default CreateUserWrapper;
