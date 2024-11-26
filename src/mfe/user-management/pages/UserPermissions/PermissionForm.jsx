import React, { useState } from 'react';
import { PERMISSIONS_ENUM } from './permissionsEnum';
import { ROLES } from '../../mockData/PermissionsData';
import { SearchableDropdown, Switch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import './PermissionForm.scss';

const PermissionForm = ({ enabledPermissions, setEnabledPermissions, handleRoleSelect }) => {
    const { t } = useTranslate();
    const [selectedRole, setSelectedRole] = useState();

    const getAllPermissions = () =>
        Object.values(PERMISSIONS_ENUM).flatMap((permissions) => Object.values(permissions));

    const enableAllPermissions = () => {
        const allPermissions = getAllPermissions();
        setEnabledPermissions(allPermissions);
    };

    const resetPermissions = () => {
        setEnabledPermissions([]);
    };
    
    const handleRoleChange = (value) => {
        const selected = value.find((item) => item.isChecked);
        if (selected) {
            setSelectedRole(selected);
            setEnabledPermissions(['ADD_USERS', 'ADD_ROLES']);
            handleRoleSelect(selected.value);
        }
    };

    const togglePermission = (permission) => {
        setEnabledPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((item) => item !== permission)
                : [...prev, permission]
        );
    };

    const isPermissionEnabled = (permission) => enabledPermissions.includes(permission);

    return (
        <div className="MCP-module-wrapper">
            <ModuleHeader heading={<p className="tertiaryHeading-24">{t('userManagement.user_permissions.select_role')}</p>} />
            <div className="MCP-panel-container">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    <SearchableDropdown
                        id="role"
                        label={t('userManagement.user_permissions.select_role')}
                        value={selectedRole}
                        onChange={handleRoleChange}
                        options={ROLES}
                    />
                </div>
            </div>

            <ModuleHeader
                heading={<p className="tertiaryHeading-24">{t('userManagement.user_permissions.managePermissions')}</p>}
                controls={
                    <div className="controls">
                        <Button size="md" variant="secondary" onClick={resetPermissions}>
                            {t('userManagement.user_permissions.button.reset')}
                        </Button>
                        <Button size="md" variant="secondary" onClick={enableAllPermissions}>{t('userManagement.user_permissions.button.applyall')}</Button>
                    </div>
                }
            />
            <div className="MCP-panel-container grid grid-gap-16">
                {Object.entries(PERMISSIONS_ENUM).map(([category, permissions]) => (
                    <div key={category} className="MCP-module-body permission-category">
                        <div className="secondaryHeading">{t(category)}</div>
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                            {Object.entries(permissions).map(([key, permission]) => (
                                <div key={key} className="permission-item flex items-center justify-between">
                                    <div className="permission-info">
                                        <div className="permission-info-header">{t(`${category}.${key}`)}</div>
                                        <p>{t(`${category}.${key}.DESCRIPTION`)}</p>
                                    </div>
                                    <Switch
                                        id={`toggle-${category}-${key}`}
                                        label={isPermissionEnabled(permission) ? 'Enabled' : 'Disabled'}
                                        labelPosition="right"
                                        size="lg"
                                        checked={isPermissionEnabled(permission)}
                                        onChange={() => togglePermission(permission)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PermissionForm;
