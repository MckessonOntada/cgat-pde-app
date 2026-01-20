import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useRouteMode from '../../routes/useRouteMode';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { RoutePaths } from '@src/routes/constants';
import UserCreationStepper from './UserCreationStepper';
import ModuleHeader from '@src/components/module-header';
import useActiveRouteHandle from '../../routes/useActiveRouteHandle';
import AuthUtils from '@src/util/AuthUtils';
import { useWidgetContext } from '@src/context/WidgetContext';
import useUser from '../../useUser';
import CommonUtils from '@src/util/CommonUtils';

const STEPS = [
  { key: 'Personal Details', path: 'personal' },
  { key: 'Role/Permissions', path: 'permissions' },
  { key: 'Accounts', path: 'accounts' },
  { key: 'Materials', path: 'materials' }
];

function CreateUserWrapper() {
  const { t: translateFn } = useTranslate();
  const { state: widgetState, setValue } = useWidgetContext();
  const navigate = useNavigate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { isEdit, id } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  React.useEffect(() => {
    if (!isEdit) setValue('isLoading', false);
  }, []);
  const { data: userDetails = {}, isFetched } = useUser(id, { userType: isSystemAdminView ? 'ADMIN' : 'GENERAL' });
  React.useEffect(() => {
    if (isEdit && isFetched) {
      setValue('isLoading', false);
    }
  }, [isFetched]);
  React.useEffect(() => {
    if (userDetails.id) {
      const { role = {} } = userDetails;
      if (CommonUtils.isNonEmptyObject(role) && role.name) {
        let roleName = role.name;
        if (roleName === 'Customer Service') {
          roleName = 'Customer Center';
        }
      }
      setValue('userDetails', userDetails);
    }
  }, [userDetails]);
  const { activeStep, stepIndex } = useActiveRouteHandle(STEPS);
  const translationConfig = React.useMemo(() => {
    const config = {};
    if (isSystemAdminView) {
      config.backButtonLabel = isEdit ? 'Back to user details page' : 'Back to Manage System Admin Page';
      config.heading = isEdit ? 'Edit System Administrator' : 'Add System Administrator';
    } else {
      config.backButtonLabel = isEdit ? 'Back to user details page' : 'Back to Manage Users';
      config.heading = isEdit ? 'Edit Organization User' : 'Add Organization User';
    }
    return config;
  }, []);
  const handleOnBack = () => {
    if (isEdit) navigate('..', { relative: 'path' });
    else navigate(RoutePaths.pathUserManagement);
  };
  const selectedRole = widgetState.selectedRole;
  const currentStep = React.useMemo(() => {
    if (selectedRole === 'Customer Centre' && isSystemAdminView && stepIndex === 3) return stepIndex--;
    return stepIndex;
  }, [selectedRole]);

  if (widgetState.isLoading) return <Loader variant="circular" />;
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
              <UserCreationStepper activeIndex={currentStep + 1} />
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default CreateUserWrapper;
