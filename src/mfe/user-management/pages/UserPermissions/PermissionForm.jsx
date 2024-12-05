import React, { useState, useEffect, Fragment } from 'react';
import { PERMISSIONS_ENUM } from './permissionsEnum';
import { Switch, Button, Dropdown, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import './PermissionForm.scss';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';

const PermissionForm = ({ enabledPermissions, setEnabledPermissions, handleRoleSelect, editRoleId, isRolePage }) => {
  const { t } = useTranslate();
  const [selectedRole, setSelectedRole] = useState(editRoleId || '');
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const {
    isLoading,
    isError,
    data: roleData,
    refetch
  } = useQuery({
    queryKey: [`users/getAll}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}`, httpVerb.GET, {});

      if (res.data?.content) {
        const roles = res.data?.content?.map((role) => ({
          ...role,
          label: role.name, //  `role.name` for the label
          value: role.id //  `role.id` for the value
        }));
        return roles;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  const getAllPermissions = () => Object.values(PERMISSIONS_ENUM).flatMap((permissions) => Object.values(permissions));

  const enableAllPermissions = () => {
    const allPermissions = getAllPermissions();
    setEnabledPermissions(allPermissions);
  };

  const resetPermissions = () => {
    setEnabledPermissions([]);
  };

  const handleRoleChange = (value) => {
    const selected = value;
    const roleId = roleData?.find((item) => item.id == value);

    const permissions = roleId?.permissions ?? [];

    if (selected) {
      setSelectedRole(selected);
      setEnabledPermissions(permissions);
      handleRoleSelect(selected);
    }
  };

  const togglePermission = (permission) => {
    const updatedPermissions = isPermissionEnabled(permission) ? enabledPermissions.filter((perm) => perm !== permission) : [...enabledPermissions, permission];

    setEnabledPermissions(updatedPermissions);
  };

  const isPermissionEnabled = (permission) => {
    return isSystemAdminView || (Array.isArray(enabledPermissions) && enabledPermissions.includes(permission));
  };

  return (
    <div className="MCP-module-wrapper">
      {!isSystemAdminView && (
        <Fragment>
          <ModuleHeader heading={<Heading as="h3">{t('userManagement.user_permissions.select_role')}</Heading>} />

          <div className="MCP-panel-container">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              <Dropdown id="role" label={t('userManagement.user_permissions.select_role')} value={selectedRole} onChange={handleRoleChange} options={roleData || []} isRequired={!isRolePage} size="lg" />
            </div>
          </div>
        </Fragment>
      )}

      <ModuleHeader
        heading={<Heading as="h3">{t('userManagement.user_permissions.managePermissions')}</Heading>}
        controls={
          !isSystemAdminView && (
            <div className="controls">
              <Button size="md" variant="secondary" onClick={resetPermissions}>
                {t('userManagement.user_permissions.button.reset')}
              </Button>
              <Button size="md" variant="secondary" onClick={enableAllPermissions}>
                {t('userManagement.user_permissions.button.applyall')}
              </Button>
            </div>
          )
        }
      />

      <div className="MCP-panel-container grid grid-gap-16">
        {Object.entries(PERMISSIONS_ENUM).map(([category, permissions]) => (
          <div key={category} className="MCP-module-body permission-category">
            <Heading as="h3">{t(category)}</Heading>
            <div className="permission-category">
              <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 permission-list">
                {Object.entries(permissions).map(([key, permission], idx) => (
                  <React.Fragment key={idx}>
                    <div key={key} className="flex items-center justify-between permission-item">
                      <div className="permission-info">
                        <div className="permission-info-header">{t(`${category}.${key}`)}</div>
                        <p>{t(`${category}.${key}.DESCRIPTION`)}</p>
                      </div>
                      <div className="permission-toggle">
                        <Switch
                          id={`toggle-${category}-${key}`}
                          label={!isSystemAdminView ? (isPermissionEnabled(permission) ? 'Enabled' : 'Disabled') : undefined}
                          disabled={isSystemAdminView}
                          labelPosition="right"
                          size="lg"
                          checked={isPermissionEnabled(permission)}
                          onChange={() => togglePermission(permission)}
                        />
                      </div>
                    </div>
                    {idx % 2 === 0 && idx !== Object.keys(PERMISSIONS_ENUM[category]).length - 1 && <div className="divider"></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionForm;
