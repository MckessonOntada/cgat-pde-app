import React from 'react';
import useRouteMode from './routes/useRouteMode';
import { useWidgetContext } from '@src/context/WidgetContext';
import AuthUtils from '@src/util/AuthUtils';
import UserService from '@src/api/commonService/UserService';
import CommonUtils from '@src/util/CommonUtils';
import { Outlet } from 'react-router-dom';
import { Loader } from '@mckesson/mcp-component-library';

const UserLoader = () => {
  const { id, params } = useRouteMode({ editSegment: 'edit', paramKey: 'userId' });
  const { state, setValue } = useWidgetContext();
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  React.useEffect(() => {
    if (!id) {
      setValue('isLoading', false);
      return;
    }
    const requestParams = {
      userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
    };
    const isProvisioned = params.provision === 'true';
    UserService.getUserDetails(id, requestParams, isProvisioned)
      .then((response) => {
        let selectedRole = response.role?.name;

        const completedSteps = {};
        if (response.id && CommonUtils.isNonEmptyObject(response.name)) completedSteps.personalDetails = true;
        if (CommonUtils.isNonEmptyObject(response.role)) completedSteps.rolePermissions = true;
        if (CommonUtils.isNonEmptyObject(response.includedMaterials)) completedSteps.materialSelection = true;
        if (CommonUtils.isNonEmptyObject(response.accounts)) completedSteps.accountsSelection = true;

        setValue('createWizardSteps', completedSteps);
        setValue('selectedRole', selectedRole);
        setValue('userDetails', response);
      })
      .catch((_error) => {})
      .finally(() => {
        setValue('isLoading', false);
      });
  }, [id]);

  if (state.isLoading) return <Loader variant="circular" />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default UserLoader;
