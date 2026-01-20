import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useRouteMode from '../../routes/useRouteMode';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { RoutePaths } from '@src/routes/constants';
import UserCreationStepper from './UserCreationStepper';
import ModuleHeader from '@src/components/module-header';
import useActiveRouteHandle from '../../routes/useActiveRouteHandle';
import AuthUtils from '@src/util/AuthUtils';

const STEPS = [
  { key: 'Personal Details', path: 'personal' },
  { key: 'Role/Permissions', path: 'permissions' },
  { key: 'Accounts', path: 'accounts' },
  { key: 'Materials', path: 'materials' }
];

function CreateUserWrapper() {
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();
  const { isEdit } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const handleOnBack = () => {
    if (isEdit) navigate('..', { relative: 'path' });
    else navigate(RoutePaths.pathUserManagement);
  };
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { activeStep, stepIndex } = useActiveRouteHandle(STEPS);
  const translationConfig = React.useMemo(() => {
    const config = {};
    if (isSystemAdminView) {
      config.backButtonLabel = isEdit ? 'Back to user details' : 'Back to Manage System Admin Page';
      config.heading = isEdit ? 'Edit System Administrator' : 'Add System Administrator';
    } else {
      config.backButtonLabel = isEdit ? 'Back to user details' : 'Back to Manage Users';
      config.heading = isEdit ? 'Add Organization User' : 'Edit Organization User';
    }
    return config;
  }, []);
  return (
    <div>
      <div className="MCP-module-header">
        <div className="stack">
          <div>
            <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBack} size="md">
              {translateFn(translationConfig.backButtonLabel)}
            </Button>
          </div>
          <ModuleHeader heading={<Heading as="h1">{translateFn(translationConfig.heading)}</Heading>} />
          {!isEdit && (
            <div className="stepper">
              <UserCreationStepper activeIndex={stepIndex + 1} />
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default CreateUserWrapper;
