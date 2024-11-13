import React, { useState } from 'react'
import { Stepper, SearchableDropdown, Switch, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES } from '../../mockData/PermissionsData';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import PageHeader from '@src/components/pageHeader';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { PERMISSIONS_ENUM } from './permissionsEnum'
import { useParams } from 'react-router-dom';
import { USER_DATA } from '../../mockData/UsersData';

const UserPermissions = () => {
    const { t } = useTranslate();
    const navigate = useNavigate(); 
    const [enabledPermissions, setEnabledPermissions] = useState([]); 
    const { userId } = useParams();

	// Fetch user data based on userId 
	const userData = userId ? USER_DATA.find(user => user.id === parseInt(userId)) : {};

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleReset = () => {

    };
    const handleApplyall = () => {

    };

    const handleSaveandContinue = () => {
        const selectedPermissions = {};
        Object.keys(enabledPermissions).forEach(category => {
            if (enabledPermissions[category]?.length > 0) {
                selectedPermissions[category] = enabledPermissions[category];
            }
        });
         const updatedUserData = {
            ...userData, // To Spread existing user data
            permissions: selectedPermissions, // Update the top-level permissions
            role: {
              ...userData.role, // To Spread existing role data
              permissions: selectedPermissions // Add permissions to role.permissions
            }
          };
        
        console.log('updatedUserData: ' ,JSON.stringify(updatedUserData, null, 2));
        alert(JSON.stringify(updatedUserData, null, 2));
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
        <div>
            <div
                className="back-navigation py2 capitalize"
                onClick={handleGoBack}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <MdOutlineKeyboardArrowLeft size="24px" />
                <p>Back to Manage Users</p>
            </div>
            <PageHeader
                title={t('userManagement.create_user')}
            /><div className="stepper">
                <Stepper
                    activeIndex={2}
                    dividerText="of"
                    stepHeaders={[
                        {
                            label: t('userManagement.stepper.option.user_details'),
                        },
                        {
                            label: t('userManagement.stepper.option.roles_and_permissions'),
                        },
                        {
                            label: t('userManagement.stepper.option.associate_accounts'),
                        },
                    ]}
                />
            </div>
            <div class="filterBox line-height grid grid-gap-24 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
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
            <div className="flexBox spaceBetween py3">
                <h1>{t('userManagement.user_permissions.managePermissions')}</h1>
                <div className="flexBox">
                    <Button variant="secondary" onClick={handleReset} size={'md'}>
                        {t('userManagement.user_permissions.button.reset')}
                    </Button>
                    <Button variant="secondary" size={'md'} onClick={handleApplyall} >
                        {t('userManagement.user_permissions.button.applyall')}
                    </Button>
                </div>
            </div>


            <div className="container grid grid-gap-16">
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
                                                    <Switch
                                                        onChange={() => handleToggle(categoryKey, permissionKey)}
                                                        id={`toggle-${label}`}
                                                        label={isPermissionEnabled(categoryKey, permissionKey) ? "Enabled" : "Disabled"}
                                                        labelPosition="right"
                                                        name={t(label)}
                                                        size="lg"
                                                        value={isPermissionEnabled(categoryKey, permissionKey)}
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
            <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                    {t('userManagement.button.back')}
                </Button>
                <Button variant="primary" type="button" onClick={handleSaveandContinue} size={'md'}>{t('userManagement.button.savencontinue')}</Button>

            </div>
        </div>

    )
}

export default UserPermissions;