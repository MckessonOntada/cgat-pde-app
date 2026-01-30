import RoleService from '@src/api/commonService/RoleService';
import { useWidgetContext } from '@src/context/WidgetContext';
import useRouteMode from '@src/mfe/user-management/routes/useRouteMode';
import React from 'react';
import { useQuery } from 'react-query';
import { Outlet } from 'react-router-dom';
import { Loader } from '@mckesson/mcp-component-library';
import { INITIAL_PREFERENCES } from '../constants';

function RoleLoader(props) {
  const { id, params } = useRouteMode({ editSegment: 'edit', paramKey: 'roleId' });
  const { state, setValue } = useWidgetContext();
  const { isLoading } = useQuery({
    queryFn: () => RoleService.getRoleDetails(id),
    onSuccess: (response) => {
      const isDetailsCompleted = Boolean(response.name && response.description);
      setValue('roleDetails', response);
      setValue('createWizardSteps', {
        details: isDetailsCompleted,
        permissions: Boolean(response.permissions),
        notificationConfig: Boolean(response.communicationPreferences)
      });
    },
    select: (data) => {
      const communicationPreferences = data?.communicationPreferences ?? {};
      const preferences = communicationPreferences.preferences ?? {};

      return {
        ...data,
        label: data.name,
        communicationPreferences: {
          ...communicationPreferences,
          preferences: {
            ...INITIAL_PREFERENCES,
            ...preferences
          }
        }
      };
    },
    onError: () => {},
    enabled: !!id
  });
  if (isLoading) {
    return <Loader variant="circular" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default RoleLoader;
