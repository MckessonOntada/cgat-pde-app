import React, { useState } from 'react'
import { PERMISSIONS_ENUM } from './permissionsEnum'
import { ROLES } from '../../mockData/PermissionsData';
import { SearchableDropdown, Switch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '../../../../components/module-header';
import { Field } from 'formik';
import './PermissionForm.scss';


const PermissionForm = ({ enabledPermissions, setEnabledPermissions }) => {
    const { t } = useTranslate();
    //hoist enabledPermissions to parent component

    const handleReset = () => {

    };
    const handleApplyall = () => {

    };

    const handleToggle = (category, permission) => {
        setEnabledPermissions(prevPermissions => {
            const updatedCategoryPermissions = prevPermissions[category]?.includes(permission)
                ? prevPermissions[category].filter(item => item !== permission)
                : [...(prevPermissions[category] || []), permission];

            return {
                ...prevPermissions,
                [category]: updatedCategoryPermissions,
            };
        });
    };

    const handleRoleChange = (role) => {
        const rolePermissions = {
            "USER_MANAGEMENT":
                ["ADD_USERS", "ADD_ROLES"],
            "AUTHENTICATION_FLOW":
                ["LOGIN_SCREEN"]
        };
        setEnabledPermissions(rolePermissions);
    };


    const isPermissionEnabled = (category, permission) => {
        return enabledPermissions[category]?.includes(permission);
    };

    return (
        <div className='MCP-module-wrapper'>
            <ModuleHeader
                heading={<p className="secondaryHeading">Select Role</p>}
            />

            <div className='MCP-panel-container'>
                <div class=" grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
                    <SearchableDropdown
                        id="role"
                        isSuccess
                        label={t('userManagement.user_permissions.select_role')}
                        name={t('userManagement.user_permissions.select_role')}
                        isRequired={false}
                        onChange={(role) => handleRoleChange(role)}
                        options={ROLES}
                    />
                </div>
            </div>
            <div className="MCP-module-body">
                <ModuleHeader
                    heading={<p className="secondaryHeading">{t('userManagement.user_permissions.managePermissions')}</p>}
                    controls={
                        <div className="controls">
                            <Button variant="secondary" onClick={handleReset} size={'md'}>
                                {t('userManagement.user_permissions.button.reset')}
                            </Button>
                            <Button variant="secondary" size={'md'} onClick={handleApplyall} >
                                {t('userManagement.user_permissions.button.applyall')}
                            </Button>
                        </div>
                    }
                />

                <div className="MCP-panel-container grid grid-gap-16">
                    {Object.keys(PERMISSIONS_ENUM).map((categoryKey, index) => (
                        <React.Fragment key={index}>
                            <div className="subheader-text">{t(`${categoryKey}`)}</div>
                            <div className="permission-category">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 permission-list">
                                    {Object.keys(PERMISSIONS_ENUM[categoryKey]).map((permissionKey, idx) => {
                                        const label = `${categoryKey}.${permissionKey}`;
                                        const description = `${categoryKey}.${permissionKey}.DESCRIPTION`;
                                        return (
                                            <React.Fragment key={idx}>
                                                <div className="flex items-center justify-between permission-item">
                                                    <div className="permission-info">
                                                        <h4>{t(label)}</h4>
                                                        <p>{t(description)}</p>
                                                    </div>

                                                    <div className="permission-toggle">
                                                        {/* <Field
                                                            id="name.firstName"
                                                            name="name.firstName"
                                                            label={t("userManagement.create_user.inputLabel.first_name")}
                                                            placeholder=" "
                                                            isRequired
                                                            component={}
                                                            maxLength={50}
                                                        />
                                                        <Switch
                                                            onChange={() => handleToggle(categoryKey, permissionKey)}
                                                            id={`toggle-${label}`}
                                                            label={isPermissionEnabled(categoryKey, permissionKey) ? "Enabled" : "Disabled"}
                                                            labelPosition="right"
                                                            name={t(label)}
                                                            size="lg"
                                                            value={isPermissionEnabled(categoryKey, permissionKey)}
                                                        /> */}
                                                        <Field
                                                            name={`permissions.${categoryKey}.${permissionKey}`}
                                                            as={Switch}
                                                            id={`toggle-${label}`}
                                                            label={
                                                                isPermissionEnabled(categoryKey, permissionKey) ? "Enabled" : "Disabled"
                                                            }
                                                            labelPosition="right"
                                                            size="lg"
                                                            // name={t(label)}
                                                            value={isPermissionEnabled(categoryKey, permissionKey)}
                                                            onChange={() => handleToggle(categoryKey, permissionKey)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Divider for every second item */}
                                                {idx % 2 === 0 && idx !== Object.keys(PERMISSIONS_ENUM[categoryKey]).length - 1 && (
                                                    <div className="divider"></div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PermissionForm;