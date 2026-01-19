import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Switch, Button, Heading } from '@mckesson/mcp-component-library';
import Dropdown from '@src/components/form/Dropdown';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import './PermissionForm.scss';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import AuthUtils from '@src/util/AuthUtils';
import { serializeParams } from '@src/util/ApiUtils';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { PERMISSIONS_ENUM } from './permissionsEnum';
import { CUSTOMER_CENTRE, CUSTOMER_SERVICE } from '@src/api/commonService/CommonService';

const PermissionForm = ({ enabledPermissions, setEnabledPermissions, handleRoleSelect, editRoleId, isRolePage, defaultRole }) => {
  const { t } = useTranslate();
  const [selectedRole, setSelectedRole] = useState(editRoleId || '');
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [searchKey, setSearchKey] = useState('');
  const [selectedRoleData, setSelectedRoleData] = useState(null);

  useEffect(() => {
    if (defaultRole) {
      setSelectedRoleData({ label: defaultRole.name, value: defaultRole.id });
    }
  }, [defaultRole]);

  const getParams = () => {
    let payload = { status: 'active', isPhysicianRequired: false, query: searchKey };
    return payload;
  };

  const {
    isLoading,
    isError,
    data: roleData,
    refetch
  } = useQuery({
    queryKey: [`users/getAll}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}?${serializeParams(getParams())}`, httpVerb.GET, {});

      if (res.data?.content) {
        const roles = res.data?.content?.map((role) => ({
          ...role,
          label: role.name === CUSTOMER_CENTRE ? CUSTOMER_SERVICE : role.name, //  `role.name` for the label
          value: role.id //  `role.id` for the value
        }));
        return roles;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  const userType = isSystemAdminView ? 'ADMIN' : 'GENERAL';

  useEffect(() => {
    refetch();
  }, [searchKey]);

  const { data: permissionsData } = useQuery({
    queryKey: ['users/permissions'],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${ApiRoutes.GET_PERMISSIONS(userType)}`, httpVerb.GET, {});
      const rawPermissions = res.data || [];
      // grouped format
      const groupedPermissions = {
        CREATE_NEW_ORDER: {},
        USER_MANAGEMENT: {},
        ADMIN_MANAGEMENT: {},
        ORGANIZATION_MANAGEMENT: {},
        ORDER_MANAGEMENT: {},
        SYSTEM_CONFIGURATION: {},
        PAYMENT_INVOICING: {},
        MANAGE_PROVIDERS: {},
        MANAGE_LINKED_ACCOUNTS: {}
      };

      rawPermissions.forEach((permission) => {
        Object.entries(PERMISSIONS_ENUM).forEach(([key, value]) => {
          if (Object.values(value).includes(permission)) {
            groupedPermissions[key][permission] = permission;
          }
        });
      });
      // remove empty data
      const filteredPermissions = Object.fromEntries(Object.entries(groupedPermissions).filter(([key, value]) => Object.keys(value).length > 0));
      return filteredPermissions;
    },
    enabled: true,
    refetchOnWindowFocus: false
  });

  const filteredPermissionsEnum = isSystemAdminView
    ? permissionsData || {}
    : Object.fromEntries(Object.entries(permissionsData || {}).filter(([key]) => key !== 'ORGANIZATION_MANAGEMENT'));

  const getAllPermissions = () => Object.values(filteredPermissionsEnum).flatMap((permissions) => Object.values(permissions));

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
    setSelectedRoleData(roleId);

    // Get permissions for the selected role
    let permissions = roleId?.permissions ?? [];

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
    return Array.isArray(enabledPermissions) && enabledPermissions.includes(permission);
  };

  return (
    <div className="MCP-module-wrapper">
      {
        <Fragment>
          <ModuleHeader heading={<Heading as="h2">{t('userManagement.user_permissions.select_role')}</Heading>} />

          <div className="MCP-panel-container">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              <MultiSelectDropdown
                id={'select-role-search'}
                label={t('userManagement.user_permissions.select_role')}
                isMultiSelect={false}
                placeholder={'Select Role'}
                onChange={handleRoleChange}
                options={roleData || []}
                variant={'async'}
                onSearch={(event) => setSearchKey(event)}
                recordsCountToEnableSearch={5}
                isRequired={!isRolePage}
                size="lg"
                isSortEnable={false}
                value={editRoleId?.toString() || ''}
                fieldDisplayValue={selectedRoleData}
              />
            </div>
          </div>
        </Fragment>
      }
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h2">{t('userManagement.user_permissions.managePermissions')}</Heading>}
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
          {filteredPermissionsEnum &&
            Object.entries(filteredPermissionsEnum).map(([category, permissions]) => (
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
                        {idx % 2 === 0 && idx !== Object.keys(filteredPermissionsEnum[category]).length - 1 && <div className="divider"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionForm;
